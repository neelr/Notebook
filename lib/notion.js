import { Client } from "@notionhq/client";
import { marked } from "marked";

export class NotionClient {
  constructor(apiKey, databaseId) {
    this.client = new Client({ auth: apiKey });
    this.databaseId = databaseId;
    this.pageSize = 100; // Notion's max page size
  }

  /**
   * Transforms Notion page data into a consistent format
   */
  transformPageData(page) {
    return {
      id: page.id,
      title: page.properties.Name.title[0]?.text.content || "",
      slug: page.properties.slug.formula?.string || "",
      dateCreated: page.properties.dateCreated.date?.start || "",
      tags: page.properties.tags.multi_select.map((tag) => tag.name),
      description: page.properties.description.rich_text[0]?.text.content || "",
      coverImage: page.properties.coverImage.url || null,
      old: page.properties.old.checkbox,
    };
  }

  /**
   * Fetches all pages with optional filtering
   */
  async query(filter = {}, options = {}) {
    try {
      const defaultOptions = {
        page_size: this.pageSize,
        sorts: [
          {
            property: "dateCreated",
            direction: "descending",
          },
        ],
      };

      // Build filter conditions
      let filterConditions = {
        and: [
          {
            property: "published",
            checkbox: {
              equals: true,
            },
          },
        ],
      };

      // Add tag filter if specified
      if (filter.tags) {
        filterConditions.and.push({
          property: "tags",
          multi_select: {
            contains: filter.tags,
          },
        });
      }

      const response = await this.client.databases.query({
        database_id: this.databaseId,
        ...defaultOptions,
        ...options,
        filter: filterConditions,
      });

      return {
        results: response.results.map((page) => this.transformPageData(page)),
        total_pages: Math.ceil(response.total / this.pageSize),
        has_more: response.has_more,
      };
    } catch (error) {
      console.error("Failed to query Notion database:", error);
      throw error;
    }
  }

  /**
   * Fetches pages for homepage (featured and non-featured)
   */
  async getHomepageData(pageSize = 1500) {
    try {
      const allPages = await this.query({}, { page_size: pageSize });

      const featured = allPages.results.filter((page) =>
        page.tags.includes("featured")
      );

      const docs = allPages.results.filter(
        (page) => !page.tags.includes("featured")
      );

      return {
        featured,
        docs,
      };
    } catch (error) {
      console.error("Failed to fetch homepage data:", error);
      throw error;
    }
  }

  /**
   * Fetches pages by tag
   */
  async getPagesByTag(tagId, page = 1, pageSize = 10) {
    try {
      const response = await this.query(
        { tags: tagId },
        {
          page_size: pageSize,
          start_cursor:
            page > 1 ? this.calculateCursor(page, pageSize) : undefined,
        }
      );

      return {
        docs: response.results,
        page,
        total_pages: response.total_pages,
      };
    } catch (error) {
      console.error("Failed to fetch pages by tag:", error);
      throw error;
    }
  }

  /**
   * Calculate cursor position for pagination
   */
  calculateCursor(page, pageSize) {
    return (page - 1) * pageSize;
  }
  /**
   * Determines if a block can have children based on its type
   * @param {Object} block - The block to check
   * @returns {boolean} Whether the block can have children
   */
  blockHasChildren(block) {
    return block.has_children;
    // List of block types that can have children
    const typesWithChildren = [
      "toggle",
      "child_page",
      "column_list",
      "column",
      "table",
      "table_row",
      "bulleted_list_item",
      "numbered_list_item",
      "quote",
      "callout",
      "synced_block",
      "template",
      "paragraph", // Some paragraphs can have children
    ];

    // Check if block has the has_children property set to true
    if (block.has_children) {
      return true;
    }

    // Check if block type is in the list of types that can have children
    return typesWithChildren.includes(block.type);
  }
  /**
   * Recursively fetches all blocks and their children for a given page ID
   * Maintains pagination state throughout the recursion
   * @param {string} blockId - The block ID to fetch children for
   * @param {Object} options - Pagination options
   * @returns {Promise<Object>} Object containing blocks array and pagination info
   */
  async getAllBlocks(blockId, options = {}) {
    try {
      const {
        startCursor = undefined,
        pageSize = this.pageSize,
        maxDepth = Infinity, // Control recursion depth
        currentDepth = 0, // Track current depth
      } = options;

      // Initialize result structure
      let result = {
        blocks: [],
        has_more: false,
        next_cursor: null,
        total_blocks: 0,
      };

      // Stop recursion if we've reached max depth
      if (currentDepth >= maxDepth) {
        return result;
      }

      // Fetch blocks at current level with pagination
      const response = await this.client.blocks.children.list({
        block_id: blockId,
        page_size: pageSize,
        start_cursor: startCursor,
      });

      // Update pagination information
      result.has_more = response.has_more;
      result.next_cursor = response.next_cursor;

      // Process each block and its children
      const processedBlocks = await Promise.all(
        response.results.map(async (block) => {
          // Count this block
          result.total_blocks++;
          // Check if block can have children
          if (this.blockHasChildren(block)) {
            // Recursively get children with incremented depth
            const childrenResult = await this.getAllBlocks(block.id, {
              pageSize,
              maxDepth,
              currentDepth: currentDepth + 1,
            });
            // Add children's count to total
            result.total_blocks += childrenResult.total_blocks;

            // Return block with its children
            return {
              ...block,
              children: childrenResult.blocks,
              has_more_children: childrenResult.has_more,
            };
          }

          return block;
        })
      );

      result.blocks = processedBlocks;
      return result;
    } catch (error) {
      console.error("Failed to fetch blocks recursively:", error);
      throw error;
    }
  }

  async parse(transformedPage) {
    try {
      const page = transformedPage;
      const content = await this.parseContent(page.id, page.old);

      return {
        ...page,
        content,
      };
    } catch (error) {
      console.error("Failed to parse page:", error);
      throw error;
    }
  }

  // Main content parsing function that decides which parser to use
  async parseContent(pageId, isOld = false) {
    try {
      const blocks = await this.getAllBlocks(pageId);

      if (isOld) {
        return await this.getOldContent(pageId);
      }

      return this.parseModernContent(blocks);
    } catch (error) {
      console.error("Failed to parse content:", error);
      throw error;
    }
  }

  // Modern content parser
  // Modern content parser with enhanced styling
  parseModernContent(blocks) {
    const styleSheet = `
  <style>
/* Light mode styles (default) */
.notion-content {
  line-height: 1.5;
  margin: 0 auto;
  padding: 20px;
}

.notion-image {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 100%;
}

.notion-heading {
  font-weight: 600;
  margin: 1.4em 0 0.5em;
}

.notion-h1 { font-size: 2em; }
.notion-h2 { font-size: 1.5em; }
.notion-h3 { font-size: 1.25em; }
.mention-link {
  display: inline-flex;
  align-items: center;
  padding: 0 4px;
  border-radius: 4px;
  text-decoration: none;
  color: inherit;
  gap: 4px;
  transition: background-color 0.2s;
}

.mention-link:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.mention-favicon {
  width: 16px;
  height: 16px;
  object-fit: contain;
}
.notion-text {
  margin: 0.5em 0;
  white-space: pre-wrap;
}

.notion-divider {
  border: none;
  border-top: 1px solid #EE6C4D;
  margin: 1.7em 0;
}

/* Light mode colors */
.color-gray { color: rgb(120, 119, 116); }
.color-brown { color: rgb(159, 107, 83); }
.color-orange { color: rgb(217, 115, 13); }
.color-yellow { color: rgb(203, 145, 47); }
.color-green { color: rgb(68, 131, 97); }
.color-blue { color: rgb(51, 126, 169); }
.color-purple { color: rgb(144, 101, 176); }
.color-pink { color: rgb(193, 76, 138); }
.color-red { color: rgb(212, 76, 71); }

/* Light mode background colors */
.bg-gray { background: rgb(241, 241, 239); }
.bg-brown { background: rgb(244, 238, 238); }
.bg-orange { background: rgb(251, 236, 221); }
.bg-yellow { background: rgb(251, 243, 219); }
.bg-green { background: rgb(237, 243, 236); }
.bg-blue { background: rgb(231, 243, 248); }
.bg-purple { background: rgb(244, 240, 247); }
.bg-pink { background: rgb(249, 238, 243); }
.bg-red { background: rgb(253, 235, 236); }

/* Dark mode styles */
@media (prefers-color-scheme: dark) {

  /* Dark mode colors with increased brightness for better visibility */
  .color-gray { color: rgb(180, 179, 176); }
  .color-brown { color: rgb(199, 147, 123); }
  .color-orange { color: rgb(255, 155, 53); }
  .color-yellow { color: rgb(243, 185, 87); }
  .color-green { color: rgb(108, 171, 137); }
  .color-blue { color: rgb(91, 166, 209); }
  .color-purple { color: rgb(184, 141, 216); }
  .color-pink { color: rgb(233, 116, 178); }
  .color-red { color: rgb(252, 116, 111); }

  /* Dark mode background colors - darker and more saturated */
  .bg-gray { background: rgb(41, 41, 39); }
  .bg-brown { background: rgb(44, 38, 38); }
  .bg-orange { background: rgb(51, 36, 21); }
  .bg-yellow { background: rgb(51, 43, 19); }
  .bg-green { background: rgb(37, 43, 36); }
  .bg-blue { background: rgb(31, 43, 48); }
  .bg-purple { background: rgb(44, 40, 47); }
  .bg-pink { background: rgb(49, 38, 43); }
  .bg-red { background: rgb(53, 35, 36); }

  .notion-code {
    background: #2d2d2d;
    color: #e0e0e0;
  }
}

.notion-callout {
  padding: 16px;
  border-radius: 4px;
  display: flex;
  gap: 8px;
  margin: 1em 0;
}

/* Light mode background colors for callouts */
.notion-callout.bg-default { background: rgba(235, 236, 237, 0.3); }
.notion-callout.bg-gray { background: rgb(241, 241, 239); }
.notion-callout.bg-brown { background: rgb(244, 238, 238); }
.notion-callout.bg-orange { background: rgb(251, 236, 221); }
.notion-callout.bg-yellow { background: rgb(251, 243, 219); }
.notion-callout.bg-green { background: rgb(237, 243, 236); }
.notion-callout.bg-blue { background: rgb(231, 243, 248); }
.notion-callout.bg-purple { background: rgb(244, 240, 247); }
.notion-callout.bg-pink { background: rgb(249, 238, 243); }
.notion-callout.bg-red { background: rgb(253, 235, 236); }

/* Dark mode background colors for callouts */
@media (prefers-color-scheme: dark) {
  .notion-callout.bg-default { background: rgba(64, 64, 64, 0.3); }
  .notion-callout.bg-gray { background: rgb(41, 41, 39); }
  .notion-callout.bg-brown { background: rgb(44, 38, 38); }
  .notion-callout.bg-orange { background: rgb(51, 36, 21); }
  .notion-callout.bg-yellow { background: rgb(51, 43, 19); }
  .notion-callout.bg-green { background: rgb(37, 43, 36); }
  .notion-callout.bg-blue { background: rgb(31, 43, 48); }
  .notion-callout.bg-purple { background: rgb(44, 40, 47); }
  .notion-callout.bg-pink { background: rgb(49, 38, 43); }
  .notion-callout.bg-red { background: rgb(53, 35, 36); }
}


.notion-quote {
  padding-left: 14px;
  border-left: 3px solid currentColor;
  font-style: italic;
  margin: 1em 0;
}

.notion-list-item {
  margin: 0.2em 0 0.2em 1em;
}

.notion-code {
  background: #f7f6f3;
  padding: 16px;
  border-radius: 4px;
  font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 0.9em;
  white-space: pre-wrap;
  margin: 1em 0;
}

/* Toggle styles */
.notion-toggle-heading,
.notion-toggle {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  position: relative;
  padding-left: 1.2em;
}

.notion-toggle-heading::before,
.notion-toggle > summary::before {
  content: '▶';
  font-size: 0.8em;
  position: absolute;
  left: 0;
  top: 0.2em;
  transition: transform 0.2s ease;
  transform-origin: center;
}

.notion-toggle-heading[data-expanded="true"]::before,
.notion-toggle[open] > summary::before {
  transform: rotate(90deg);
}

.notion-toggle > summary {
  list-style: none;
}

.notion-toggle > summary::-webkit-details-marker {
  display: none;
}

.notion-toggle-content,
.notion-toggle > :not(summary) {
  margin-left: 1.5em;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

/* Column layout styles */
.notion-column-list {
  display: flex;
  gap: 2em;
  margin: 1em 0;
}

@media (max-width: 600px) {
  .notion-column-list {
    flex-direction: column;
  }
}

.notion-column {
  flex: 1;
  min-width: 0;
}
</style>
  `;

    // Helper function to get color classes
    const getColorClasses = (color) => {
      if (!color || color === "default") return "";

      // Handle background colors
      if (color.includes("_background")) {
        return `bg-${color.replace("_background", "")}`;
      }

      // Handle text colors
      return `color-${color}`;
    };

    // Helper function to parse rich text with color support
    const parseRichText = (richText) => {
      if (!richText || !richText.length) return "";

      return richText
        .map((text) => {
          if (
            text.type === "mention" &&
            text.mention?.type === "link_mention"
          ) {
            // Extract URL and create favicon URL
            const url = text.href;
            const domain = new URL(url).hostname;
            const faviconUrl = `https://${domain}/favicon.ico`;

            // Create link preview button with inline styles
            return `<a href="${url}" 
          style="
            display: inline-flex;
            align-items: center;
            padding: 3px 6px;
            background: rgba(35, 131, 226, 0.07);
            border-radius: 4px;
            text-decoration: none;
            color: rgb(35, 131, 226);
            font-size: 14px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.5;
            transition: background 0.1s ease-in;
            margin: 1px 2px;
            cursor: pointer;
            border: 1px solid transparent;
            max-width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          "
          onmouseover="this.style.background='rgba(35, 131, 226, 0.12)'; this.style.border='1px solid rgba(35, 131, 226, 0.5)'"
          onmouseout="this.style.background='rgba(35, 131, 226, 0.07)'; this.style.border='1px solid transparent'"
        >
          <img src="${faviconUrl}" 
            style="
              width: 14px;
              height: 14px;
              margin-right: 4px;
              flex-shrink: 0;
              object-fit: contain;
              vertical-align: middle;
            "
            onerror="this.style.display='none'"
          />
          <span style="
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          ">${domain}</span>
        </a>`;
          }

          // Original rich text parsing logic
          let content = text.text?.content.replace(/\n/g, "<br>") || "";
          const colorClass = getColorClasses(text.annotations.color);

          if (text.annotations.bold) content = `<strong>${content}</strong>`;
          if (text.annotations.italic) content = `<em>${content}</em>`;
          if (text.annotations.strikethrough) content = `<del>${content}</del>`;
          if (text.annotations.underline) content = `<u>${content}</u>`;
          if (text.annotations.code) content = `<code>${content}</code>`;
          if (colorClass)
            content = `<span class="${colorClass}">${content}</span>`;
          if (text.text?.link)
            content = `<a href="${text.text.link.url}" target="_blank">${content}</a>`;

          return content;
        })
        .join("");
    };

    // Parse individual blocks with color support
    // Enhanced parseBlock function with toggle heading support
    const parseBlock = (block) => {
      const colorClass = getColorClasses(block[block.type]?.color);
      const baseClass = colorClass ? ` ${colorClass}` : "";

      // Get any children content first
      const childrenContent = block.children
        ? block.children.map((child) => parseBlock(child)).join("")
        : "";

      const createToggleHeading = (level, content, children) => {
        const headingTag = `h${level}`;
        return `
          <${headingTag} class="notion-heading notion-h${level} notion-toggle-heading${baseClass}" onclick="this.dataset.expanded = this.dataset.expanded !== 'true'">
            ${content}
          </${headingTag}>
          <div class="notion-toggle-content" style="display: none;">
            ${children}
          </div>
        `;
      };

      switch (block.type) {
        // Handle toggle headings
        case "heading_1":
        case "heading_2":
        case "heading_3": {
          const level = parseInt(block.type.slice(-1));
          const content = parseRichText(block[block.type].rich_text);

          if (block[block.type].is_toggleable) {
            return createToggleHeading(level, content, childrenContent);
          } else {
            return `<h${level} class="notion-heading notion-h${level}${baseClass}">
              ${content}
            </h${level}>`;
          }
        }

        // Handle columns
        case "column_list":
          return `<div class="notion-column-list">${childrenContent}</div>`;

        case "column":
          return `<div class="notion-column">${childrenContent}</div>`;

        case "paragraph":
          return `<p class="notion-text${baseClass}">${parseRichText(
            block.paragraph.rich_text
          )}</p>`;

        case "heading_1":
          return `<h1 class="notion-heading notion-h1${baseClass}">${parseRichText(
            block.heading_1.rich_text
          )}</h1>`;

        case "heading_2":
          return `<h2 class="notion-heading notion-h2${baseClass}">${parseRichText(
            block.heading_2.rich_text
          )}</h2>`;

        case "heading_3":
          return `<h3 class="notion-heading notion-h3${baseClass}">${parseRichText(
            block.heading_3.rich_text
          )}</h3>`;

        case "divider":
          return `<hr class="notion-divider" />`;

        case "bulleted_list_item":
          return `
              <li class="notion-list-item${baseClass}">
                ${parseRichText(block.bulleted_list_item.rich_text)}
                ${childrenContent ? `<ul>${childrenContent}</ul>` : ""}
              </li>
            `;

        case "numbered_list_item":
          return `
              <li class="notion-list-item${baseClass}">
                ${parseRichText(block.numbered_list_item.rich_text)}
                ${childrenContent ? `<ol>${childrenContent}</ol>` : ""}
              </li>
            `;

        case "to_do":
          return `
          <div class="notion-to-do">
            <input type="checkbox" ${
              block.to_do.checked ? "checked" : ""
            } disabled>
            <span>${parseRichText(block.to_do.rich_text)}</span>
          </div>
        `;

        case "toggle":
          return `
            <details class="notion-toggle">
              <summary>${parseRichText(block.toggle.rich_text)}</summary>
              <div class="notion-toggle-content">
                ${childrenContent}
              </div>
            </details>
          `;

        case "child_page":
          return `
          <a href="/${block.id}" class="notion-page-link" 
             title="Click to open page">
            📄 ${block.child_page.title}
          </a>
        `;

        case "image": {
          const imageUrl =
            block.image.type === "external"
              ? block.image.external.url
              : block.image.file.url;

          // Extract width from caption if it exists
          const caption = block.image.caption?.[0]?.text?.content;
          const widthStyle = caption
            ? `max-width: ${caption}px; width: min(100%, ${caption}px);`
            : "";

          return `<img src="${imageUrl}" alt="Notion image" class="notion-image" style="${widthStyle}">`;
        }

        case "code":
          return `
          <pre class="notion-code">
            <code>${block.code.rich_text[0]?.text.content || ""}</code>
          </pre>
        `;

        case "quote":
          return `<blockquote class="notion-quote">${parseRichText(
            block.quote.rich_text
          )}</blockquote>`;

        case "callout": {
          const icon = block.callout.icon?.emoji || "💡";
          const content = parseRichText(block.callout.rich_text);
          const bgColorClass = block.callout.color
            ? `bg-${block.callout.color.replace("_background", "")}`
            : "bg-default";

          // Process any nested content within the callout
          const nestedContent = block.children
            ? block.children.map((child) => parseBlock(child)).join("")
            : "";

          return `
              <div class="notion-callout ${bgColorClass}">
                <div class="notion-callout-icon">${icon}</div>
                <div class="notion-callout-content${baseClass}">
                  ${content}
                  ${nestedContent}
                </div>
              </div>
            `;
        }

        case "file":
          const fileUrl =
            block.file.type === "external"
              ? block.file.external.url
              : block.file.file.url;
          return `
          <a href="${fileUrl}" class="notion-file-link" target="_blank" 
             title="Click to download">
            📎 ${block.file.name || "Download file"}
          </a>
        `;

        default:
          console.log("Unsupported block type:", block.type);
          return ""; // Skip unsupported blocks
      }
    };
    const toggleScript = `
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.notion-toggle-heading').forEach(heading => {
          const content = heading.nextElementSibling;
          
          heading.addEventListener('click', (e) => {
            e.preventDefault();
            const isExpanded = heading.dataset.expanded !== 'true';
            content.style.display = isExpanded ? 'none' : 'block';
          });
        });
      });
    </script>
  `;

    let html = "";
    let currentListType = null; // Track the current list type

    blocks.blocks.forEach((block, index) => {
      // Check if this is a list item
      const isList = ["bulleted_list_item", "numbered_list_item"].includes(
        block.type
      );
      const nextBlock = blocks.blocks[index + 1];
      const isNextList =
        nextBlock &&
        ["bulleted_list_item", "numbered_list_item"].includes(nextBlock.type);

      // Handle list opening
      if (isList && currentListType !== block.type) {
        html += block.type === "bulleted_list_item" ? "<ul>" : "<ol>";
        currentListType = block.type;
      }

      // Parse the current block
      html += parseBlock(block);

      // Handle list closing
      if (
        currentListType &&
        (!isNextList || nextBlock?.type !== currentListType)
      ) {
        html += currentListType === "bulleted_list_item" ? "</ul>" : "</ol>";
        currentListType = null;
      }
    });

    // Ensure any remaining list is closed
    if (currentListType) {
      html += currentListType === "bulleted_list_item" ? "</ul>" : "</ol>";
    }

    return [
      {
        content:
          styleSheet +
          `<div class="notion-content">${html}</div>` +
          toggleScript,
      },
    ];
  }
  /**
   * Fetches and deserializes the old content from code blocks
   * @param {string} pageId - The Notion page ID
   * @returns {Array} Array of content sections
   */
  async getOldContent(pageId) {
    try {
      const blocks = (await this.getAllBlocks(pageId)).blocks;

      // Filter for code blocks only
      const codeBlocks = blocks.filter((block) => block.type === "code");

      // Extract and concatenate the content from code blocks
      let rawContent = codeBlocks
        .map((block) => block.code.rich_text[0]?.text.content || "")
        .join("\n\n");

      // Replace markdown headers that don't have newlines before them
      rawContent = rawContent.replace(/([^\\n]) (#{1,6})/g, "$1\n$2");

      return [
        {
          content: await marked.parse(rawContent),
        },
      ];
    } catch (error) {
      console.error("Failed to fetch old content:", error);
      throw error;
    }
  }

  /**
   * Enhanced page fetch that includes content
   * @param {string} pageId - The Notion page ID
   * @returns {Object} Page data including content
   */
  async getFullPage(pageId) {
    try {
      // Fetch the page metadata
      const page = await this.client.pages.retrieve({ page_id: pageId });
      const pageData = this.transformPageData(page);

      // Fetch the content
      const content = await this.getOldContent(pageId);

      return {
        ...pageData,
        content,
      };
    } catch (error) {
      console.error("Failed to fetch full page:", error);
      throw error;
    }
  }
  // Add this method to the NotionClient class in paste-2.txt
  async getPageBySlug(slug) {
    try {
      const response = await this.client.databases.query({
        database_id: this.databaseId,
        filter: {
          and: [
            {
              property: "published",
              checkbox: {
                equals: true,
              },
            },
            {
              property: "slug",
              formula: {
                string: {
                  equals: slug,
                },
              },
            },
          ],
        },
      });

      if (!response.results.length) {
        return null;
      }

      const page = response.results[0];
      return {
        id: page.id,
        page,
      };
    } catch (error) {
      console.error("Failed to fetch page by slug:", error);
      throw error;
    }
  }
}

// Create a singleton instance
export const notionClient = new NotionClient(
  process.env.NOTION_API_KEY,
  process.env.NOTION_DATABASE_ID
);
