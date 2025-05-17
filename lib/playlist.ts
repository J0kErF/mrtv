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

        // 🎯 Log all .ts files for analysis
        if (/\.ts(\?.*)?$/i.test(item.url)) {
          console.log("TS FILE DETECTED:", item.url);
        }

        // ✅ Only accept these formats for playback
        if (/\.(m3u8|mp4|webm|ogg)(\?.*)?$/i.test(item.url)) {
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
