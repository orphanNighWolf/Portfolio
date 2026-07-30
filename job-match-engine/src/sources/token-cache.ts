import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface OAuthTokens {
  access_token: string;
  refresh_token?: string;
  scope: string;
  token_type: string;
  expiry_date?: number;
}

const ALGORITHM = 'aes-256-gcm';
const CACHE_FILE_PATH = path.resolve(process.cwd(), '.tokens.enc');
// Machine-specific key derivation fallback for token encryption
const SECRET_KEY = crypto
  .createHash('sha256')
  .update(process.env.GMAIL_CLIENT_SECRET || 'job-match-engine-local-secure-salt-2026')
  .digest();

export class TokenCache {
  /**
   * Saves encrypted OAuth2 tokens to disk
   */
  public static saveTokens(tokens: OAuthTokens): void {
    try {
      const iv = crypto.randomBytes(12);
      const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
      
      const jsonStr = JSON.stringify(tokens);
      let encrypted = cipher.update(jsonStr, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const authTag = cipher.getAuthTag().toString('hex');
      const payload = JSON.stringify({
        iv: iv.toString('hex'),
        authTag,
        data: encrypted,
      });

      fs.writeFileSync(CACHE_FILE_PATH, payload, 'utf8');
      console.log('[TokenCache]: Successfully saved encrypted tokens to disk (.tokens.enc)');
    } catch (err) {
      console.error('[TokenCache]: Failed to save tokens:', err);
    }
  }

  /**
   * Loads and decrypts OAuth2 tokens from disk if present
   */
  public static loadTokens(): OAuthTokens | null {
    try {
      if (!fs.existsSync(CACHE_FILE_PATH)) {
        return null;
      }

      const raw = fs.readFileSync(CACHE_FILE_PATH, 'utf8');
      const { iv, authTag, data } = JSON.parse(raw);

      const decipher = crypto.createDecipheriv(
        ALGORITHM,
        SECRET_KEY,
        Buffer.from(iv, 'hex')
      );
      decipher.setAuthTag(Buffer.from(authTag, 'hex'));

      let decrypted = decipher.update(data, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      const tokens: OAuthTokens = JSON.parse(decrypted);
      return tokens;
    } catch (err) {
      console.warn('[TokenCache]: Could not load/decrypt cached tokens, re-authentication will be required.', err);
      return null;
    }
  }

  /**
   * Clears token cache file
   */
  public static clearTokens(): void {
    if (fs.existsSync(CACHE_FILE_PATH)) {
      fs.unlinkSync(CACHE_FILE_PATH);
      console.log('[TokenCache]: Cleared cached token file.');
    }
  }
}
