import fs from "node:fs";
import path from "node:path";
import {
  PUBLIC_AVATARS_PATH,
  PUBLIC_UPLOADS_PATH,
  RIP_GRAVATAR_AVATAR_DIRS,
  RIP_UPLOADS_PATH,
} from "./constants";

export type Warn = (message: string) => void;

export function ensurePublicDirs(): void {
  fs.mkdirSync(PUBLIC_UPLOADS_PATH, { recursive: true });
  fs.mkdirSync(PUBLIC_AVATARS_PATH, { recursive: true });
}

function toPublicPath(...segments: string[]): string {
  return "/" + segments.join("/").split(path.sep).join("/");
}

/** WordPress keeps the original upload plus size-suffixed copies, e.g. "img-600x450.jpg" next to "img.jpg". We always want the original. */
export function toOriginalFilename(relativeUploadPath: string): string {
  return relativeUploadPath.replace(/-\d+x\d+(\.[a-zA-Z0-9]+)$/, "$1");
}

/** Pull the `YYYY/MM/filename.ext` tail out of any uploads URL/path (handles both the HTTrack-rewritten absolute host and relative forms). */
export function extractUploadPath(url: string): string | null {
  const marker = "/wp-content/uploads/";
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length).split("?")[0].split("#")[0];
}

const copiedUploads = new Map<string, string | null>();

function sniffImageMagicBytes(buffer: Buffer): boolean {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return true; // JPEG
  if (buffer.length >= 4 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return true; // PNG
  if (buffer.length >= 4 && buffer.toString("ascii", 0, 4) === "GIF8") return true; // GIF
  if (buffer.length >= 12 && buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") return true; // WEBP
  return false;
}

/**
 * Resolve the actual file to read bytes from for a given expected upload
 * path. HTTrack sometimes mis-saves an image under a `.html` extension
 * instead of its real one (confirmed: the live WordPress server returned a
 * text/html content-type header for some image requests even though the
 * body bytes are a genuine image) — so if the expected filename isn't
 * present, this also tries the same path with a `.html` extension and
 * verifies via magic-byte sniffing that it's really image data before
 * trusting it, guarding against actually copying a real HTML error page.
 */
function resolveImageSource(filePath: string): string | null {
  if (fs.existsSync(filePath)) return filePath;
  const ext = path.extname(filePath);
  const htmlVariant = filePath.slice(0, -ext.length) + ".html";
  if (fs.existsSync(htmlVariant)) {
    const fd = fs.openSync(htmlVariant, "r");
    const header = Buffer.alloc(16);
    fs.readSync(fd, header, 0, 16, 0);
    fs.closeSync(fd);
    if (sniffImageMagicBytes(header)) return htmlVariant;
  }
  return null;
}

/**
 * Copy an uploaded image (always the original, unsized file when available)
 * from the HTTrack mirror into public/old-blog/uploads/, preserving the
 * WordPress YYYY/MM/filename structure. Returns the new public path, or
 * null if no source file could be found at all.
 */
export function copyUploadImage(relativeUploadPath: string, slug: string, warn: Warn): string | null {
  const original = toOriginalFilename(relativeUploadPath);
  if (copiedUploads.has(original)) return copiedUploads.get(original)!;

  const originalSource = resolveImageSource(path.join(RIP_UPLOADS_PATH, original));
  const sizedSource = resolveImageSource(path.join(RIP_UPLOADS_PATH, relativeUploadPath));

  let chosenSource: string | null = null;
  let chosenRelative: string | null = null;
  if (originalSource) {
    chosenSource = originalSource;
    chosenRelative = original;
  } else if (sizedSource) {
    warn(`Original image missing for "${slug}", using sized variant: ${relativeUploadPath}`);
    chosenSource = sizedSource;
    chosenRelative = relativeUploadPath;
  } else {
    warn(`Image source not found for "${slug}": ${relativeUploadPath}`);
    copiedUploads.set(original, null);
    return null;
  }

  const dest = path.join(PUBLIC_UPLOADS_PATH, chosenRelative);
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(chosenSource, dest);
  }
  const publicPath = toPublicPath("old-blog", "uploads", chosenRelative);
  copiedUploads.set(original, publicPath);
  return publicPath;
}

const GRAVATAR_HASH_RE = /avatar\/([a-f0-9]{32})/i;

export function extractGravatarHash(url: string): string | null {
  const m = GRAVATAR_HASH_RE.exec(url);
  return m ? m[1].toLowerCase() : null;
}

function findLocalAvatarFile(hash: string): string | null {
  for (const dir of RIP_GRAVATAR_AVATAR_DIRS) {
    if (!fs.existsSync(dir)) continue;
    const match = fs.readdirSync(dir).find((f) => f.toLowerCase().startsWith(hash));
    if (match) return path.join(dir, match);
  }
  return null;
}

async function fetchLiveAvatar(hash: string): Promise<{ buffer: Buffer; ext: string } | null> {
  try {
    const res = await fetch(`https://www.gravatar.com/avatar/${hash}?s=96&d=retro&r=g`);
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") ?? "";
    const ext = contentType.includes("png") ? "png" : contentType.includes("gif") ? "gif" : "jpg";
    const buffer = Buffer.from(await res.arrayBuffer());
    return { buffer, ext };
  } catch {
    return null;
  }
}

const avatarCache = new Map<string, string | null>();
export const avatarStats = { local: 0, liveFetched: 0, failed: 0 };

/**
 * Resolve a gravatar URL (from a comment's <img class="avatar"> or the
 * author bio widget) to a local public path, preferring the HTTrack mirror
 * and falling back to a live fetch from gravatar.com for hashes HTTrack
 * didn't capture (confirmed: only www.gravatar.com/avatar/ has real files
 * locally, e.g. some avatars are only reachable via 0.gravatar.com).
 */
export async function resolveAvatar(gravatarUrl: string, warn: Warn): Promise<string | null> {
  const hash = extractGravatarHash(gravatarUrl);
  if (!hash) {
    warn(`Could not extract gravatar hash from: ${gravatarUrl}`);
    return null;
  }
  if (avatarCache.has(hash)) return avatarCache.get(hash)!;

  const localFile = findLocalAvatarFile(hash);
  if (localFile) {
    const ext = path.extname(localFile).replace(".", "") || "jpg";
    const dest = path.join(PUBLIC_AVATARS_PATH, `${hash}.${ext}`);
    if (!fs.existsSync(dest)) fs.copyFileSync(localFile, dest);
    const publicPath = toPublicPath("old-blog", "avatars", `${hash}.${ext}`);
    avatarStats.local++;
    avatarCache.set(hash, publicPath);
    return publicPath;
  }

  const fetched = await fetchLiveAvatar(hash);
  // Light courtesy throttle on the third-party service.
  await new Promise((r) => setTimeout(r, 100));
  if (!fetched) {
    warn(`Avatar fetch failed for hash ${hash}`);
    avatarStats.failed++;
    avatarCache.set(hash, null);
    return null;
  }
  const dest = path.join(PUBLIC_AVATARS_PATH, `${hash}.${fetched.ext}`);
  fs.writeFileSync(dest, fetched.buffer);
  const publicPath = toPublicPath("old-blog", "avatars", `${hash}.${fetched.ext}`);
  avatarStats.liveFetched++;
  avatarCache.set(hash, publicPath);
  return publicPath;
}
