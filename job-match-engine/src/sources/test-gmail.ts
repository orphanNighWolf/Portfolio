import { GmailFetcher } from './gmail.js';

async function testGmailIngestion(): Promise<void> {
  console.log('\n==========================================');
  console.log('  Testing Gmail API Ingestion (LinkedIn Alerts)');
  console.log('==========================================\n');

  try {
    const fetcher = new GmailFetcher();
    const emailHtmlBodies = await fetcher.fetchLinkedInJobAlertEmails({ daysBack: 7, maxResults: 5 });

    console.log('\n--- INGESTION TEST RESULT ---');
    console.log(`Total LinkedIn Job Alert emails found & retrieved: ${emailHtmlBodies.length}`);

    emailHtmlBodies.forEach((html, index) => {
      console.log(`\nEmail #${index + 1}: Raw HTML Payload Length = ${html.length} characters`);
      console.log(`Email #${index + 1} Preview: ${html.substring(0, 150).replace(/\s+/g, ' ')}...`);
    });

    console.log('\n✓ Gmail API Ingestion test complete.\n');
  } catch (err) {
    console.error('\n✗ Gmail Ingestion Test Error:', err);
  }
}

testGmailIngestion();
