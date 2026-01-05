import { Client } from "@notionhq/client";
import { createClient } from "redis";
import { verifySignature } from "@lib/signUrl";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

let redis = null;
async function getRedis() {
  if (!redis) {
    redis = await createClient({ url: process.env.IMAGE_REDIS_URL }).connect();
  }
  return redis;
}

const CACHE_TTL = 45 * 60; // 45 minutes (Notion URLs expire in ~1hr)

export default async function handler(req, res) {
  const { blockId, sig } = req.query;

  if (!sig || !verifySignature(blockId, sig)) {
    return res.status(403).json({ error: "Invalid signature" });
  }

  try {
    const cache = await getRedis();
    const cacheKey = `notion-img:${blockId}`;

    // Check cache first
    const cached = await cache.get(cacheKey);
    if (cached) {
      return res.redirect(307, cached);
    }

    // Fetch from Notion
    const block = await notion.blocks.retrieve({ block_id: blockId });

    let url = null;
    if (block.type === "image") {
      url = block.image?.file?.url || block.image?.external?.url;
    } else if (block.type === "file") {
      url = block.file?.file?.url || block.file?.external?.url;
    }

    if (!url) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Cache the URL
    await cache.set(cacheKey, url, { EX: CACHE_TTL });

    res.redirect(307, url);
  } catch (e) {
    console.error("Failed to fetch notion image:", e);
    res.status(500).json({ error: "Failed to fetch image" });
  }
}
