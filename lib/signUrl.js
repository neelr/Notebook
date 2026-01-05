import crypto from "crypto";

const SECRET = process.env.IMAGE_SIGN_SECRET;

export function signImageUrl(blockId) {
  const sig = crypto
    .createHmac("sha256", SECRET)
    .update(blockId)
    .digest("hex");

  return `/api/notion-image/${blockId}?sig=${sig}`;
}

export function verifySignature(blockId, signature) {
  const expected = crypto
    .createHmac("sha256", SECRET)
    .update(blockId)
    .digest("hex");

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}
