import { runHealthCheck } from './config/health-check.js';

/**
 * Job Match Engine — CLI Entrypoint Orchestrator
 * Pipeline Flow: Fetch (Sources) -> Parse (Parsers) -> Deduplicate (Aggregator) -> Rank (Ranking) -> Output (Storage)
 */
async function main(): Promise<void> {
  console.log('\n==========================================');
  console.log('  Job Match Engine — Orchestrator CLI');
  console.log('==========================================\n');

  // Step 0: Run Health Check & Verify Configuration
  runHealthCheck();

  console.log('Pipeline Steps Scaffold:');
  console.log('1. [Sources]    Fetch raw job alerts from Gmail API & API feeds');
  console.log('2. [Parsers]    Parse HTML email digests & normalize API payloads');
  console.log('3. [Aggregator] Deduplicate listings by (company + title + location)');
  console.log('4. [Ranking]    Score matches against candidate resume skills');
  console.log('5. [Storage]    Output clean JSON / CSV dataset for Tools page\n');

  console.log('System initialized successfully. Ready for stage implementations.\n');
}

main().catch((err) => {
  console.error('Pipeline execution error:', err);
  process.exit(1);
});
