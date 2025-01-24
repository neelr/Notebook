import RSS from "rss";
import { promises as fs } from "fs";
import { local } from "../pages/api/get";

async function handleRSSFeed(results, options = { writeFiles: true }) {
  // Get upvotes for each story
  const upvotes = {};
  for (const story of results) {
    const votes = await local(story.id);
    upvotes[story.id] = votes;
  }

  if (options.writeFiles) {
    // Create RSS feed
    const rssFeed = new RSS({
      title: "My Notebook",
      description:
        "A fun place to jot down my thoughts and ideas! You'll find everything from my favorite music to political thoughts! Have a stroll, and stay a while!",
      feed_url: "https://notebook.neelr.dev/feed.rss",
      site_url: "https://notebook.neelr.dev",
      managingEditor: "Neel Redkar",
      language: "en",
      categories: ["Tech", "Notebook", "Politics", "Philosophy"],
      pubDate: new Date().toUTCString(),
      ttl: "60",
    });

    // Add items to RSS feed
    results.forEach((story) => {
      rssFeed.item({
        title: story.title,
        description: story.description,
        url: `https://notebook.neelr.dev/stories/${story.slug}`,
        guid: story.id,
        date: story.dateCreated,
        categories: story.tags,
        custom_elements: [
          {
            "media:content": {
              _attr: {
                url: story.coverImage,
                medium: "image",
              },
            },
          },
          {
            "stars:count": upvotes[story.id],
          },
        ],
      });
    });

    // Save RSS feed
    await fs.writeFile("./public/feed.rss", rssFeed.xml());

    // Save first 5 stories to JSON
    await fs.writeFile(
      "./public/feed_first5.json",
      JSON.stringify(
        results.slice(0, 5).map((story) => ({
          title: story.title,
          description: story.description,
          url: `https://notebook.neelr.dev/stories/${story.slug}`,
          guid: story.id,
          date: story.dateCreated,
          categories: story.tags,
          image: story.coverImage,
          upvotes: upvotes[story.id],
        }))
      )
    );
  }

  return {
    upvotes,
  };
}

export default handleRSSFeed;
