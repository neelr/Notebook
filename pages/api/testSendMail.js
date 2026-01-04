import sgMail from '@sendgrid/mail';
import { parseRichTextForEmail, generatePreviewHtml, generateNewsletterEmail } from '../../lib/emailHelpers.js';

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check Basic Auth
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ error: 'Unauthorized - Missing Basic Auth' });
  }

  // Decode Basic Auth - expecting "Basic base64(username:password)"
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');

  // Verify against SENDGRID_SECRET
  const expectedSecret = process.env.SENDGRID_SECRET;

  if (!expectedSecret) {
    console.error('[TestMail] SENDGRID_SECRET not set in environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Username can be anything, password must match SENDGRID_SECRET
  if (password !== expectedSecret) {
    return res.status(401).json({ error: 'Unauthorized - Invalid credentials' });
  }

  try {
    // Extract page data from webhook (same format as sendMail.js)
    const pageData = req.body.data;
    const pageId = pageData.id;
    const title = pageData.properties.Name.title[0]?.text.content;
    const slug = pageData.properties.slug.formula?.string;
    const description = pageData.properties.description.rich_text[0]?.text.content;
    const coverImage = pageData.properties.coverImage.url || null;
    const tags = pageData.properties.tags.multi_select.map(tag => tag.name);
    const dateCreated = pageData.properties.dateCreated.date?.start;
    const postUrl = pageData.properties.url.formula?.string;
    const emailPreBodyRichText = pageData.properties['email prebody']?.rich_text || [];
    const emailPreBody = parseRichTextForEmail(emailPreBodyRichText);

    // Import NotionClient and fetch content
    const { NotionClient } = await import('../../lib/notion.js');
    const notionClient = new NotionClient(
      process.env.NOTION_API_KEY,
      process.env.NOTION_DATABASE_ID
    );

    // Fetch blocks and generate preview
    const blocksData = await notionClient.getAllBlocks(pageId);
    const previewHtml = generatePreviewHtml(blocksData.blocks);

    // Generate email HTML using shared helper
    const emailHtml = generateNewsletterEmail({
      title,
      description,
      coverImage,
      tags,
      dateCreated,
      postUrl,
      previewHtml,
      emailPreBody
    });

    // Send test email via SendGrid (to single recipient, not marketing list)
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: 'neel.redkar@gmail.com',
      from: process.env.SENDGRID_FROM_EMAIL || 'hi@neelr.dev',
      subject: `[TEST] neel update: ${title}`,
      html: emailHtml
    };

    await sgMail.send(msg);

    return res.status(200).json({
      success: true,
      message: 'Test email sent to neel.redkar@gmail.com',
      title: title
    });

  } catch (error) {
    console.error('[TestMail] Error:', error);

    if (error.response && error.response.body) {
      console.error('[TestMail] SendGrid Error Details:', JSON.stringify(error.response.body, null, 2));
    }

    return res.status(500).json({
      success: false,
      error: error.message,
      details: error.response?.body || null
    });
  }
}
