"use client";

import { useEffect, useState } from "react";
import Player from "@/components/Player";
import { fetchMultiplePlaylists } from "@/lib/playlist";
import ScrollToTopButton from "@/components/ScrollToTopButton";


const PLAYLIST_URLS =
  process.env.NEXT_PUBLIC_PLAYLIST_URLS?.split(",") ?? [];


type Channel = {
  name: string;
  url: string;
  tvg?: {
    logo?: string;
  };
  group?: {
    title?: string;
  };
};


export default function HomePage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    (async () => {
      const items = await fetchMultiplePlaylists(PLAYLIST_URLS);
      setChannels(items);
      if (items.length) setCurrentUrl(items[0].url);
    })();
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  const toggleFavorite = (url: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(url)
        ? prev.filter((f) => f !== url)
        : [...prev, url];
      localStorage.setItem("favorites", JSON.stringify(updated));
      return updated;
    });
  };

  const favoriteChannels = channels.filter((ch) => favorites.includes(ch.url));

  const groupedChannels = channels.reduce((acc, ch) => {
    const group = ch.group?.title || "Other";
    if (!acc[group]) acc[group] = [];
    acc[group].push(ch);
    return acc;
  }, {} as Record<string, Channel[]>);

  const categoryList = Object.keys(groupedChannels);

  return (
    <main className="max-w-screen-xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🌍MRTV🌍</h1>

      <Player src={currentUrl} />

      {/* Toggle Categories */}
      {categoryList.length > 1 && (
        <div className="sticky top-0 z-10 bg-white shadow-sm py-2 px-4 border-b flex justify-between items-center">
          <span className="font-semibold text-gray-700 text-sm">Categories</span>
          <button
            onClick={() => setShowCategories(!showCategories)}
            className="text-sm text-blue-600 border border-blue-600 rounded px-2 py-1 hover:bg-blue-50 transition"
          >
            {showCategories ? "−" : "+"}
          </button>
        </div>
      )}

      {/* Multi-line Categories */}
      {showCategories && (
        <div className="bg-white shadow-inner py-2 px-4 border-b">
          <div className="flex flex-wrap gap-2">
            {categoryList.map((group) => (
              <a
                key={group}
                href={`#${group.replace(/\s+/g, "-").toLowerCase()}`}
                className="bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-600 font-medium px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors duration-200 border border-gray-200"
              >
                {group}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Favorites Section */}
      {favoriteChannels.length > 0 && (
        <div id="favorites" className="mt-10 scroll-mt-20">
          <h2 className="text-xl font-semibold mb-4">⭐ Favorites</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {favoriteChannels.map((ch, i) => (
              <ChannelCard
                key={i}
                channel={ch}
                isFavorite={true}
                onClick={() => setCurrentUrl(ch.url)}
                toggleFavorite={() => toggleFavorite(ch.url)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Grouped Channels */}
      {Object.entries(groupedChannels).map(([group, items]) => (
        <div key={group} id={group.replace(/\s+/g, "-").toLowerCase()} className="mt-10 scroll-mt-20">
          <h2 className="text-xl font-semibold mb-4">{group}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {items.map((ch, i) => (
              <ChannelCard
                key={i}
                channel={ch}
                isFavorite={favorites.includes(ch.url)}
                onClick={() => setCurrentUrl(ch.url)}
                toggleFavorite={() => toggleFavorite(ch.url)}
              />
            ))}
          </div>
        </div>
      ))}
      <ScrollToTopButton />
    </main>
  );
}

// ChannelCard component inside the same file (or move to /components)
function ChannelCard({
  channel,
  isFavorite,
  onClick,
  toggleFavorite,
}: {
  channel: Channel;
  isFavorite: boolean;
  onClick: () => void;
  toggleFavorite: () => void;
}) {
  return (
    <div className="relative">
      <button
        onClick={onClick}
        className="flex flex-col items-center justify-center w-full h-full bg-white text-black rounded-xl shadow hover:bg-gray-100 p-3 text-sm text-center space-y-2"
      >
        {channel.tvg?.logo ? (
          <img
            src={channel.tvg.logo}
            alt={channel.name}
            onError={(e) => (e.currentTarget.src = "/mrtv500.png")}
            className="w-16 h-16 object-contain rounded"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
            No Logo
          </div>
        )}
        <span className="truncate w-full">{channel.name}</span>
      </button>

      {/* Favorite Toggle */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite();
        }}
        className="absolute top-2 right-2 text-red-500"
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>

    </div>
  );
}
