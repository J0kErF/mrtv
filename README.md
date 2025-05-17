
# 🌍 MRTV IPTV Player

A modern, responsive, and installable IPTV web app built with **Next.js**, supporting Arabic & Hebrew channels via open playlists. Includes powerful features like channel grouping, favorites, proxy-based CORS bypassing, and full PWA support.

---

## 🎯 Features

- ✅ Live streaming of `.m3u8`, `.mp4`, `.ts`, and more
- 📺 Grouped channels by category (`News`, `Kids`, `Movies`, etc.)
- ❤️ Favorite channels saved in `localStorage`
- 🔁 Automatic fallback if stream fails
- 🔒 CORS-proxy via API route to bypass restricted streams
- 📱 Progressive Web App (PWA) — installable on mobile and desktop
- 🎚 Category filters and country-based filtering
- ⬆️ Smooth "Scroll to Top" floating button

---

## 🚀 Demo

[🔗 Visit the demo](#)  
*(link your live URL here — e.g., Vercel)*

---

## 🧱 Tech Stack

| Tech | Usage |
|------|-------|
| [Next.js 15+](https://nextjs.org/) | React framework for SSR + static |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [HLS.js](https://github.com/video-dev/hls.js/) | Client-side `.m3u8` stream support |
| `next-pwa` | Enables service workers and offline capabilities |
| `.env` configuration | Manage playlist sources cleanly |
| TypeScript | Type safety and scalability |

---

## 📂 Project Structure

```
app/
 ┣ page.tsx                  ← Main IPTV dashboard
components/
 ┣ Player.tsx                ← Video player with HLS support
 ┣ ChannelCard.tsx           ← Single channel UI block
 ┣ ScrollToTopButton.tsx     ← Floating scroll-up button
lib/
 ┗ playlist.ts               ← Playlist fetch + parse + clean
public/
 ┣ manifest.json             ← PWA metadata
 ┗ icons/                    ← PWA icons (192px, 512px)
```

---

## ⚙️ Setup & Run

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/mrtv-iptv-player.git
cd mrtv-iptv-player
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure `.env.local`

```env
NEXT_PUBLIC_PLAYLIST_URLS=https://iptv-org.github.io/iptv/languages/ara.m3u,https://iptv-org.github.io/iptv/countries/sa.m3u
```

### 4. Run in Development

```bash
npm run dev
```

### 5. Build for Production

```bash
npm run build
npm run start
```

---

## 🌐 Deploy

### 📦 Recommended: [Vercel](https://vercel.com)

- Connect your GitHub repo
- Auto-builds and deploys with PWA support
- Add environment variable in Vercel dashboard:
  ```
  NEXT_PUBLIC_PLAYLIST_URLS=...
  ```

---

## 🛠 TODO & Future Features

- 🔍 Search bar for channels
- 📅 Show program schedule (EPG)
- 🌐 Language selector
- 🔐 Admin-protected premium playlist
- 📲 Android app wrapper (APK export)

---

## 📄 License

This project is MIT licensed. You are free to use and modify it as needed.

---

## 🙌 Acknowledgements

- [iptv-org/iptv](https://github.com/iptv-org/iptv) – Open source IPTV list source  
- [HLS.js](https://github.com/video-dev/hls.js) – Adaptive streaming  
- [next-pwa](https://github.com/shadowwalker/next-pwa) – PWA integration  

---

> Built with ❤️ by [Mohammad YF](https://github.com/yourusername)
