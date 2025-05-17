// lib/playlist.ts
import { parse } from "iptv-playlist-parser";

export async function fetchMultiplePlaylists(urls: string[]) {
  const allItems: any[] = [];

  for (const url of urls) {
    try {
      const res = await fetch(url);
      const text = await res.text();
      const result = parse(text);
      const filtered = result.items.filter((item) => item.url?.endsWith(".m3u8"));
      allItems.push(...filtered);
    } catch (err) {
      console.warn("Failed to fetch playlist:", url, err);
    }
  }

  return allItems;
}
