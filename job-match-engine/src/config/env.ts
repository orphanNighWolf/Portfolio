import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file if available
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export interface AppConfig {
  gmail: {
    clientId?: string;
    clientSecret?: string;
    refreshToken?: string;
  };
  apiKeys: {
    indeed?: string;
    zipRecruiter?: string;
    dice?: string;
  };
  outputFormat: 'json' | 'csv';
  logLevel: string;
}

export const config: AppConfig = {
  gmail: {
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    refreshToken: process.env.GMAIL_REFRESH_TOKEN,
  },
  apiKeys: {
    indeed: process.env.INDEED_API_KEY,
    zipRecruiter: process.env.ZIPRECRUITER_API_KEY,
    dice: process.env.DICE_API_KEY,
  },
  outputFormat: (process.env.OUTPUT_FORMAT as 'json' | 'csv') || 'json',
  logLevel: process.env.LOG_LEVEL || 'info',
};
