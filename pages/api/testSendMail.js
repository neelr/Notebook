import {
  verifyBasicAuth,
  extractPageDataFromWebhook,
  fetchPageContent,
  generateNewsletterEmail,
  sendEmailToList
} from '../../lib/emailHelpers.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = verifyBasicAuth(req, process.env.SENDGRID_SECRET);
  if (!auth.valid) {
    return res.status(auth.status).json({ error: auth.error });
  }

  try {
    const pageData = extractPageDataFromWebhook(req.body);
    const { previewHtml } = await fetchPageContent(pageData.pageId);
    const emailHtml = generateNewsletterEmail({ ...pageData, previewHtml });

    const result = await sendEmailToList({
      listId: process.env.SENDGRID_TEST_LIST_ID,
      subject: `[TEST] neel update: ${pageData.title}`,
      emailHtml,
      includeSuppression: false
    });

    return res.status(200).json({ ...result, title: pageData.title });

  } catch (error) {
    console.error('[TestMail] Error:', error);
    if (error.response?.body) {
      console.error('[TestMail] SendGrid Error Details:', JSON.stringify(error.response.body, null, 2));
    }
    return res.status(500).json({
      success: false,
      error: error.message,
      details: error.response?.body || null
    });
  }
}
