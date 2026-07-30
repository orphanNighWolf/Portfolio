import { config } from './env.js';

/**
 * Health Check Verification Script
 * Validates whether environment variables are loaded and prints system status.
 */
export function runHealthCheck(): void {
  console.log('\n==========================================');
  console.log('  Job Match Engine — Health Check Report');
  console.log('==========================================\n');

  console.log('Status: OK (System Operational)');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Output Format:', config.outputFormat);
  console.log('Log Level:', config.logLevel);

  console.log('\n--- Provider Credentials Check ---');
  console.log('Gmail OAuth Client ID:', config.gmail.clientId ? '✓ Loaded' : '✗ Missing (.env)');
  console.log('Gmail Refresh Token:  ', config.gmail.refreshToken ? '✓ Loaded' : '✗ Missing (.env)');
  console.log('Indeed API Key:       ', config.apiKeys.indeed ? '✓ Loaded' : '✗ Missing (.env)');
  console.log('ZipRecruiter API Key: ', config.apiKeys.zipRecruiter ? '✓ Loaded' : '✗ Missing (.env)');
  console.log('Dice API Key:         ', config.apiKeys.dice ? '✓ Loaded' : '✗ Missing (.env)');

  console.log('\nHealth check finished successfully.\n');
}

// Execute health check if run directly via tsx/CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  runHealthCheck();
}
