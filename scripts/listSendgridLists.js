import sgClient from '@sendgrid/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

sgClient.setApiKey(process.env.SENDGRID_API_KEY);

async function listAllLists() {
  const [response] = await sgClient.request({
    method: 'GET',
    url: '/v3/marketing/lists'
  });

  console.log('SendGrid Contact Lists:\n');
  for (const list of response.body.result) {
    console.log(`Name: ${list.name}`);
    console.log(`ID: ${list.id}`);
    console.log(`Contact Count: ${list.contact_count}`);
    console.log('---');
  }
}

listAllLists().catch(console.error);
