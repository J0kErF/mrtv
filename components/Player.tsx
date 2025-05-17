"use client";

import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";

type PlayerProps = {
  src: string | null;
};

const FALLBACK_VIDEO = "/fallback.mp4";

export default function Player({ src }: PlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // Clean up old hls instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Clear old video source
    video.pause();
    video.removeAttribute("src");
    video.load();

    setIsFallback(false);

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        maxBufferLength: 60,
        backBufferLength: 90,
      });

      hlsRef.current = hls;

      hls.attachMedia(video);
      hls.loadSource(src);

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data?.fatal) {
          console.warn("HLS fatal error:", data);

          if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          } else {
            hls.destroy();
            hlsRef.current = null;
            setIsFallback(true);
          }
        }
      });

      return () => {
        hls.destroy();
        hlsRef.current = null;
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.play().catch((err) => console.warn("Playback error:", err));
    }
  }, [src]);

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl shadow-md overflow-hidden">
      <video
        ref={videoRef}
        controls
        autoPlay
        playsInline
        muted
        loop={isFallback}
        src={isFallback ? FALLBACK_VIDEO : undefined}
        className="w-full h-full object-contain"
      />
      {isFallback && (
        <div className="absolute inset-0 flex items-center justify-center bg-opacity-10 text-white text-sm md:text-base font-medium text-center px-4">
          ❌ This stream failed. Showing demo video...
        </div>
      )}
    </div>
  );
}
