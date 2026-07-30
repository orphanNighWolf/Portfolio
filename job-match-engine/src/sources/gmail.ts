import http from 'http';
import { URL } from 'url';
import { config } from '../config/env.js';
import { TokenCache, OAuthTokens } from './token-cache.js';

export interface GmailFetchOptions {
  daysBack?: number;
  maxResults?: number;
}

export class GmailFetcher {
  private clientId: string;
  private clientSecret: string;
  private redirectPort = 8085;
  private redirectUri = `http://localhost:8085/oauth2callback`;

  constructor() {
    this.clientId = config.gmail.clientId || '';
    this.clientSecret = config.gmail.clientSecret || '';
  }

  /**
   * Exponential backoff helper for handling rate limits (HTTP 429/5xx)
   */
  private async fetchWithBackoff(url: string, options: RequestInit, maxRetries = 4): Promise<Response> {
    let delayMs = 1000;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const res = await fetch(url, options);
      if (res.status !== 429 && res.status < 500) {
        return res;
      }

      console.warn(`[Gmail API]: Rate limit or 5xx hit (Status ${res.status}). Retrying in ${delayMs}ms (Attempt ${attempt + 1}/${maxRetries})...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      delayMs *= 2; // Exponential backoff
    }

    return fetch(url, options);
  }

  /**
   * Authenticates using cached tokens or initiates local loopback OAuth2 auth flow
   */
  public async getValidAccessToken(): Promise<string> {
    let tokens = TokenCache.loadTokens();

    if (tokens && tokens.access_token) {
      // Check if access_token is expired and refresh if necessary
      if (tokens.expiry_date && Date.now() >= tokens.expiry_date - 60000 && tokens.refresh_token) {
        console.log('[Gmail Auth]: Access token expired. Refreshing token via OAuth2 token endpoint...');
        tokens = await this.refreshAccessToken(tokens.refresh_token);
      } else {
        console.log('[Gmail Auth]: Using valid cached OAuth2 access token.');
        return tokens.access_token;
      }
    }

    if (!tokens) {
      if (config.gmail.refreshToken) {
        console.log('[Gmail Auth]: Using refresh token provided in environment config...');
        tokens = await this.refreshAccessToken(config.gmail.refreshToken);
      } else {
        console.log('[Gmail Auth]: No cached tokens or refresh token found. Starting local OAuth2 loopback server...');
        tokens = await this.startInstalledAppOAuthFlow();
      }
    }

    TokenCache.saveTokens(tokens);
    return tokens.access_token;
  }

  private async refreshAccessToken(refreshToken: string): Promise<OAuthTokens> {
    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    });

    const res = await this.fetchWithBackoff('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to refresh OAuth2 token: ${errText}`);
    }

    const data = await res.json();
    return {
      access_token: data.access_token,
      refresh_token: refreshToken,
      scope: data.scope || 'https://www.googleapis.com/auth/gmail.readonly',
      token_type: data.token_type || 'Bearer',
      expiry_date: Date.now() + (data.expires_in || 3600) * 1000,
    };
  }

  private async startInstalledAppOAuthFlow(): Promise<OAuthTokens> {
    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(this.clientId)}&` +
      `redirect_uri=${encodeURIComponent(this.redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent('https://www.googleapis.com/auth/gmail.readonly')}&` +
      `access_type=offline&prompt=consent`;

    console.log('\n==========================================');
    console.log('  ACTION REQUIRED: GMAIL OAUTH2 AUTHORIZATION');
    console.log('==========================================');
    console.log(`Open the following URL in your browser to authorize access:\n\n${authUrl}\n`);

    return new Promise((resolve, reject) => {
      const server = http.createServer(async (req, res) => {
        try {
          if (req.url && req.url.startsWith('/oauth2callback')) {
            const reqUrl = new URL(req.url, `http://localhost:${this.redirectPort}`);
            const code = reqUrl.searchParams.get('code');

            if (code) {
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end('<html><body><h2>Authorization successful! You can close this window.</h2></body></html>');
              server.close();

              const tokenParams = new URLSearchParams({
                client_id: this.clientId,
                client_secret: this.clientSecret,
                code,
                grant_type: 'authorization_code',
                redirect_uri: this.redirectUri,
              });

              const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: tokenParams,
              });

              const tokenData = await tokenRes.json();
              if (tokenData.access_token) {
                const tokens: OAuthTokens = {
                  access_token: tokenData.access_token,
                  refresh_token: tokenData.refresh_token,
                  scope: tokenData.scope,
                  token_type: tokenData.token_type,
                  expiry_date: Date.now() + (tokenData.expires_in || 3600) * 1000,
                };
                resolve(tokens);
              } else {
                reject(new Error(`OAuth token exchange failed: ${JSON.stringify(tokenData)}`));
              }
            }
          }
        } catch (err) {
          reject(err);
        }
      });

      server.listen(this.redirectPort, () => {
        console.log(`[Gmail Auth]: Listening on http://localhost:${this.redirectPort}/oauth2callback for OAuth redirect...`);
      });
    });
  }

  /**
   * Fetches raw HTML strings of matching LinkedIn Job Alert emails
   */
  public async fetchLinkedInJobAlertEmails(opts: GmailFetchOptions = {}): Promise<string[]> {
    const daysBack = opts.daysBack || 7;
    const maxResults = opts.maxResults || 10;

    const accessToken = await this.getValidAccessToken();
    const query = `from:linkedin.com subject:"job alert" newer_than:${daysBack}d`;
    console.log(`[Gmail Fetcher]: Searching emails with query -> '${query}'`);

    const listUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=${maxResults}`;
    const listRes = await this.fetchWithBackoff(listUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!listRes.ok) {
      console.warn(`[Gmail Fetcher]: Gmail message list query failed (${listRes.status}).`);
      return [];
    }

    const listData = await listRes.json();
    const messages: Array<{ id: string }> = listData.messages || [];

    console.log(`[Gmail Fetcher]: Found ${messages.length} matching email message(s). Ingesting raw HTML bodies...`);

    const rawHtmlBodies: string[] = [];

    for (const msg of messages) {
      const msgUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`;
      const msgRes = await this.fetchWithBackoff(msgUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (msgRes.ok) {
        const msgData = await msgRes.json();
        const htmlBody = this.extractHtmlFromMessage(msgData);
        if (htmlBody) {
          rawHtmlBodies.push(htmlBody);
        }
      }
    }

    return rawHtmlBodies;
  }

  private extractHtmlFromMessage(msgData: any): string {
    if (!msgData.payload) return '';

    const parts = msgData.payload.parts || [msgData.payload];
    for (const part of parts) {
      if (part.mimeType === 'text/html' && part.body?.data) {
        const base64 = part.body.data.replace(/-/g, '+').replace(/_/g, '/');
        return Buffer.from(base64, 'base64').toString('utf8');
      }
    }
    return '';
  }
}
