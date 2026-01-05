// Shared email helper functions for newsletter system

// Helper function: Replace curly quotes with straight quotes
function normalizeCurlyQuotes(str) {
  return str
    .replace(/[\u201C\u201D]/g, '"')  // Curly double quotes to straight
    .replace(/[\u2018\u2019]/g, "'"); // Curly single quotes to straight
}

// Helper function: Convert YouTube iframes to clickable thumbnails
function convertYouTubeIframes(html) {
  // Match iframe tags with YouTube embed URLs
  const iframeRegex = /<iframe[^>]*src=["']https?:\/\/(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]+)[^"']*["'][^>]*><\/iframe>/gi;

  return html.replace(iframeRegex, (match, videoId) => {
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    return `<a href="${videoUrl}" target="_blank" style="display: inline-block;"><img src="${thumbnailUrl}" alt="YouTube Video" style="max-width: 560px; width: 100%; border-radius: 8px;"/></a>`;
  });
}

// Helper function: Parse Notion rich text to email-safe HTML
function parseRichTextForEmail(richTextArray) {
  if (!richTextArray || !richTextArray.length) return "";

  return richTextArray
    .map((text) => {
      let content = text.text?.content.replace(/\n/g, "<br>") || "";
      content = normalizeCurlyQuotes(content);
      content = convertYouTubeIframes(content);

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
      return "";
  }
}

// Helper function: Generate preview HTML from Notion blocks
function generatePreviewHtml(blocks) {
  if (!blocks || blocks.length === 0) return "";

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

  const previewBlocks = contentBlocks.slice(0, 5);

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
      if (currentList) {
        currentList += currentListType === "ul" ? "</ul>" : "</ol>";
        html.push(currentList);
        currentList = null;
        currentListType = null;
      }
      html.push(parseEmailBlock(block));
    }
  }

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

// Helper function: Verify Basic Auth
function verifyBasicAuth(req, expectedSecret) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return { valid: false, error: 'Unauthorized - Missing Basic Auth', status: 401 };
  }

  if (!expectedSecret) {
    return { valid: false, error: 'Server configuration error', status: 500 };
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [, password] = credentials.split(':');

  if (password !== expectedSecret) {
    return { valid: false, error: 'Unauthorized - Invalid credentials', status: 401 };
  }

  return { valid: true };
}

// Helper function: Extract page data from Notion webhook
function extractPageDataFromWebhook(body) {
  const pageData = body.data;
  const emailPreBodyRichText = pageData.properties['email prebody']?.rich_text || [];

  return {
    pageId: pageData.id,
    title: pageData.properties.Name.title[0]?.text.content,
    slug: pageData.properties.slug.formula?.string,
    description: pageData.properties.description.rich_text[0]?.text.content,
    coverImage: pageData.properties.coverImage.url || null,
    tags: pageData.properties.tags.multi_select.map(tag => tag.name),
    dateCreated: pageData.properties.dateCreated.date?.start,
    postUrl: pageData.properties.url.formula?.string,
    emailPreBody: parseRichTextForEmail(emailPreBodyRichText)
  };
}

// Helper function: Fetch page content from Notion and generate preview
async function fetchPageContent(pageId) {
  const { NotionClient } = await import('./notion.js');
  const notionClient = new NotionClient(
    process.env.NOTION_API_KEY,
    process.env.NOTION_DATABASE_ID
  );

  const blocksData = await notionClient.getAllBlocks(pageId);
  const previewHtml = generatePreviewHtml(blocksData.blocks);

  return { previewHtml };
}

// Helper function: Send email to a SendGrid list via transactional API
async function sendEmailToList({ listId, subject, emailHtml, includeSuppression = false }) {
  const sgClient = (await import('@sendgrid/client')).default;
  sgClient.setApiKey(process.env.SENDGRID_API_KEY);

  if (!listId) {
    return { success: false, error: 'List ID not configured', recipientCount: 0 };
  }

  // Fetch contacts from the list
  const [contactsResponse] = await sgClient.request({
    method: 'POST',
    url: '/v3/marketing/contacts/search',
    body: {
      query: `CONTAINS(list_ids, '${listId}')`
    }
  });

  const contacts = contactsResponse.body.result || [];

  if (contacts.length === 0) {
    return { success: true, message: 'No contacts in list to send to', listId, recipientCount: 0 };
  }

  // Build personalizations
  const personalizations = contacts.map(contact => ({
    to: [{ email: contact.email, name: contact.first_name || '' }]
  }));

  // Send via transactional API
  const emailData = {
    personalizations,
    from: { email: 'hi@neelr.dev', name: 'hi its neel!' },
    subject,
    content: [{ type: 'text/html', value: emailHtml }]
  };

  // Add unsubscribe group if configured
  if (includeSuppression && process.env.SENDGRID_SUPPRESSION_GROUP_ID) {
    emailData.asm = {
      group_id: parseInt(process.env.SENDGRID_SUPPRESSION_GROUP_ID)
    };
  }

  await sgClient.request({
    method: 'POST',
    url: '/v3/mail/send',
    body: emailData
  });

  return {
    success: true,
    message: 'Newsletter sent via transactional API',
    listId,
    recipientCount: contacts.length
  };
}

export {
  normalizeCurlyQuotes,
  convertYouTubeIframes,
  parseRichTextForEmail,
  parseEmailBlock,
  generatePreviewHtml,
  generateNewsletterEmail,
  verifyBasicAuth,
  extractPageDataFromWebhook,
  fetchPageContent,
  sendEmailToList
};
