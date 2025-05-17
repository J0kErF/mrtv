// lib/playlist.ts
import { parse } from "iptv-playlist-parser";

export async function fetchMultiplePlaylists(urls: string[]) {
  const urlSet = new Set<string>();
  const allItems: any[] = [];

  for (const url of urls) {
    try {
      const res = await fetch(url);
      const text = await res.text();
      const result = parse(text);

      for (const item of result.items) {
        if (!item.url || urlSet.has(item.url)) continue;

        const isStream = /\.(m3u8|mp4|webm|ogg)(\?.*)?$/i.test(item.url);
        const isTSFile = /\.ts(\?.*)?$/i.test(item.url);

        if (isTSFile) {
          console.log("TS FILE DETECTED:", item.url);
        }

        if (isStream) {
          const isValid = await isUrlWorking(item.url);

          if (!isValid) {
            console.warn("Broken stream skipped:", item.url);
            continue;
          }

          urlSet.add(item.url);
          allItems.push(item);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch playlist:", url, err);
    }
  }

  return allItems;
}

// Helper: Validate stream URL with HEAD request
async function isUrlWorking(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch (err) {
    return false;
  }
}
