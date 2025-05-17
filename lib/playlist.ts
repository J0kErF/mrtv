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
            console.warn("❌ Broken or blocked stream skipped:", item.url);
            continue;
          }

          urlSet.add(item.url);
          allItems.push(item);
        }
      }
    } catch (err) {
      console.warn("⚠️ Failed to fetch playlist:", url, err);
    }
  }

  return allItems;
}

// ✅ Smart stream validator using GET + Range + common headers
async function isUrlWorking(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // timeout after 5s

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Range: "bytes=0-1",
        "User-Agent": "Mozilla/5.0",
        Referer: "https://tv.mryosef.com", // mimic origin
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);
    return res.ok && res.status < 400;
  } catch (err) {
    console.warn("Stream test failed:", url, err);
    return false;
  }
}
