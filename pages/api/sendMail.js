import sgClient from '@sendgrid/client';
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
    console.error('[Newsletter] SENDGRID_SECRET not set in environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Username can be anything, password must match SENDGRID_SECRET
  if (password !== expectedSecret) {
    return res.status(401).json({ error: 'Unauthorized - Invalid credentials' });
  }

  try {
    // Extract page data from webhook
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

    // Generate email HTML
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

    // Send email via SendGrid Marketing Campaigns API
    sgClient.setApiKey(process.env.SENDGRID_API_KEY);

    const listId = process.env.SENDGRID_LIST_ID;
    const senderId = parseInt(process.env.SENDGRID_SENDER_ID);

    if (!listId || !senderId) {
      console.error('[Newsletter] Missing required environment variables');
      return res.status(500).json({
        success: false,
        error: 'SENDGRID_LIST_ID or SENDGRID_SENDER_ID not configured'
      });
    }

    // Create a Single Send to the list
    const emailConfig = {
      subject: `neel update: ${title}`,
      html_content: emailHtml,
      sender_id: senderId
    };

    // Add suppression group if configured
    if (process.env.SENDGRID_SUPPRESSION_GROUP_ID) {
      emailConfig.suppression_group_id = parseInt(process.env.SENDGRID_SUPPRESSION_GROUP_ID);
    }

    const singleSendData = {
      name: `${title} - ${new Date().toISOString()}`,
      send_to: {
        list_ids: [listId]
      },
      email_config: emailConfig
    };

    console.log('[Newsletter] Attempting to create Single Send with data:', JSON.stringify(singleSendData, null, 2));

    const [createResponse] = await sgClient.request({
      method: 'POST',
      url: '/v3/marketing/singlesends',
      body: singleSendData
    });

    const singleSendId = createResponse.body.id;

    // Schedule to send immediately
    await sgClient.request({
      method: 'PUT',
      url: `/v3/marketing/singlesends/${singleSendId}/schedule`,
      body: {
        send_at: 'now'
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Newsletter sent to marketing list',
      listId: listId,
      singleSendId: singleSendId,
      title: title
    });

  } catch (error) {
    console.error('[Newsletter] Error:', error);

    // Log detailed SendGrid error response if available
    if (error.response && error.response.body) {
      console.error('[Newsletter] SendGrid Error Details:', JSON.stringify(error.response.body, null, 2));
    }

    return res.status(500).json({
      success: false,
      error: error.message,
      details: error.response?.body || null
    });
  }
}