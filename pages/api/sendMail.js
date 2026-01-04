const sgMail = require('@sendgrid/mail');
const sgClient = require('@sendgrid/client');

// Helper function: Parse Notion rich text to email-safe HTML
// Adapted from lib/notion.js lines 564-579
function parseRichTextForEmail(richTextArray) {
  if (!richTextArray || !richTextArray.length) return "";

  return richTextArray
    .map((text) => {
      let content = text.text?.content.replace(/\n/g, "<br>") || "";

      if (text.annotations.bold) content = `<strong>${content}</strong>`;
      if (text.annotations.italic) content = `<em>${content}</em>`;
      if (text.annotations.strikethrough) content = `<del>${content}</del>`;
      if (text.annotations.underline) content = `<u>${content}</u>`;
      if (text.annotations.code) content = `<code style="background-color: #f5f5f5; padding: 2px 4px; border-radius: 3px; font-family: monospace;">${content}</code>`;
      if (text.text?.link) {
        content = `<a clicktracking=off href="${text.text.link.url}" target="_blank" style="color: #EE6C4D; text-decoration: underline;">${content}</a>`;
      }

      return content;
    })
    .join("");
}

// Helper function: Parse individual Notion blocks for email
// Adapted from lib/notion.js lines 605-667
function parseEmailBlock(block) {
  const type = block.type;

  switch (type) {
    case "paragraph":
      return `<p style="margin: 12px 0; line-height: 1.6; color: #293241; font-family: Arial, Helvetica, sans-serif;">${parseRichTextForEmail(block.paragraph.rich_text)}</p>`;

    case "heading_1":
      return `<h1 style="color: #EE6C4D; margin: 20px 0 10px; font-size: 28px; font-weight: 700; font-family: Arial, Helvetica, sans-serif;">${parseRichTextForEmail(block.heading_1.rich_text)}</h1>`;

    case "heading_2":
      return `<h2 style="color: #EE6C4D; margin: 18px 0 10px; font-size: 24px; font-weight: 700; font-family: Arial, Helvetica, sans-serif;">${parseRichTextForEmail(block.heading_2.rich_text)}</h2>`;

    case "heading_3":
      return `<h3 style="color: #293241; margin: 16px 0 8px; font-size: 20px; font-weight: 700; font-family: Arial, Helvetica, sans-serif;">${parseRichTextForEmail(block.heading_3.rich_text)}</h3>`;

    case "bulleted_list_item":
      return `<li style="margin: 6px 0; line-height: 1.6; color: #293241; font-family: Arial, Helvetica, sans-serif;">${parseRichTextForEmail(block.bulleted_list_item.rich_text)}</li>`;

    case "numbered_list_item":
      return `<li style="margin: 6px 0; line-height: 1.6; color: #293241; font-family: Arial, Helvetica, sans-serif;">${parseRichTextForEmail(block.numbered_list_item.rich_text)}</li>`;

    default:
      // Skip complex block types (code, callout, toggle, image, etc.)
      return "";
  }
}

// Helper function: Generate preview HTML from Notion blocks
function generatePreviewHtml(blocks) {
  if (!blocks || blocks.length === 0) return "";

  // Filter to content blocks only
  const contentBlocks = blocks.filter((block) => {
    const type = block.type;
    return (
      type === "paragraph" ||
      type === "heading_1" ||
      type === "heading_2" ||
      type === "heading_3" ||
      type === "bulleted_list_item" ||
      type === "numbered_list_item"
    );
  });

  // Take first 5 blocks max
  const previewBlocks = contentBlocks.slice(0, 5);

  // Group list items together
  const html = [];
  let currentList = null;
  let currentListType = null;

  for (const block of previewBlocks) {
    const type = block.type;

    if (type === "bulleted_list_item") {
      if (currentListType !== "ul") {
        if (currentList) html.push(currentList);
        currentList = "<ul style='margin: 12px 0; padding-left: 20px;'>";
        currentListType = "ul";
      }
      currentList += parseEmailBlock(block);
    } else if (type === "numbered_list_item") {
      if (currentListType !== "ol") {
        if (currentList) html.push(currentList);
        currentList = "<ol style='margin: 12px 0; padding-left: 20px;'>";
        currentListType = "ol";
      }
      currentList += parseEmailBlock(block);
    } else {
      // Non-list block
      if (currentList) {
        currentList += currentListType === "ul" ? "</ul>" : "</ol>";
        html.push(currentList);
        currentList = null;
        currentListType = null;
      }
      html.push(parseEmailBlock(block));
    }
  }

  // Close any open list
  if (currentList) {
    currentList += currentListType === "ul" ? "</ul>" : "</ol>";
    html.push(currentList);
  }

  return html.join("");
}

// Helper function: Generate complete newsletter email HTML
function generateNewsletterEmail(pageData) {
  const { title, description, coverImage, tags, dateCreated, postUrl, previewHtml, emailPreBody } = pageData;

  const tagsHtml = tags && tags.length > 0 ? tags.map(tag => `<a clicktracking=off href="https://notebook.neelr.dev/tags/${encodeURIComponent(tag)}" style="color: #EE6C4D;">#${tag}</a>`).join(", ") : "";
  const dateHtml = dateCreated ? new Date(dateCreated).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
</head>
<body>
  ${emailPreBody ? `<p>${emailPreBody}</p>` : ""}

  <hr>
  <p><strong>${title}</strong></p>
  <p>${description || ""}${tagsHtml ? `, ${tagsHtml}` : ""}</p>
  ${coverImage ? `<p><a clicktracking=off href="${postUrl}"><img src="${coverImage}" alt="${title}" style="width: 300px;"></a></p>` : ""}
  ${previewHtml || ""}
  <p><a clicktracking=off href="${postUrl}" style="color: #EE6C4D;">...read the full post! =&gt;</a></p>
  <hr>

  Thanks for subscribing to my newsletter/blogposts/other! It means a lot, and I would love to hear any thoughts (just reply to this email). Also if you want to unsubscribe, just reply to this email and I'll remove you from the list. (ignore this)

</body>
</html>
  `.trim();
}

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