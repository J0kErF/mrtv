"use client";

import React from "react";

type Channel = {
  name: string;
  url: string;
  tvg?: { logo?: string };
};

type ChannelCardProps = {
  channel: Channel;
  isFavorite: boolean;
  onClick: () => void;
  toggleFavorite: () => void;
};

export default function ChannelCard({
  channel,
  isFavorite,
  onClick,
  toggleFavorite,
}: ChannelCardProps) {
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
            onError={(e) => (e.currentTarget.src = "/default-logo.png")}
            className="w-16 h-16 object-contain rounded"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
            No Logo
          </div>
        )}
        <span className="truncate w-full">{channel.name}</span>
      </button>

      {/* Favorite toggle icon */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite();
        }}
        className="absolute top-2 right-2 text-red-500 text-lg"
        title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>
    </div>
  );
}
