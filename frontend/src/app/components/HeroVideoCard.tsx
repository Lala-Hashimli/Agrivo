import { Clock3, Play, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import heroVideo from "../../assets/agrivo-hero-video.mp4";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const POSTER_URL =
  "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1600&q=80";

export function HeroVideoCard() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handlePlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      setHasError(false);
      await video.play();
      setIsPlaying(true);
    } catch {
      setHasError(true);
      setIsPlaying(false);
    }
  }, []);

  const handleRetry = useCallback(() => {
    setHasError(false);
    const video = videoRef.current;
    if (video) {
      video.load();
    }
  }, []);

  if (hasError) {
    return (
      <div className="agrivo-hero-video">
        <ImageWithFallback
          src={POSTER_URL}
          alt="Fresh produce prepared for farm-to-market delivery"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[rgba(16,32,24,0.55)] p-4 text-center backdrop-blur-sm sm:p-6">
          <p className="max-w-xs text-sm leading-6 text-white/90">
            The preview video could not be loaded. You can retry or continue browsing the marketplace.
          </p>
          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/95 px-5 py-2.5 text-sm font-semibold text-[#14532D] shadow-lg transition hover:bg-white"
          >
            <RefreshCw className="h-4 w-4" />
            Retry video
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="agrivo-hero-video group">
      <video
        ref={videoRef}
        src={heroVideo}
        poster={POSTER_URL}
        controls={isPlaying}
        playsInline
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={() => setHasError(true)}
        className={`absolute inset-0 h-full w-full object-cover ${isPlaying ? "bg-black" : ""}`}
      />

      <AnimatePresence>
        {!isPlaying && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(16,32,24,0.10)_0%,rgba(16,32,24,0.04)_38%,rgba(16,32,24,0.45)_100%)]"
            />

            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.96 }}
              onClick={handlePlay}
              className="absolute left-1/2 top-[46%] z-10 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/75 bg-white/92 text-[#14532D] shadow-[0_24px_60px_rgba(16,32,24,0.26)] sm:h-24 sm:w-24 lg:h-[5.5rem] lg:w-[5.5rem]"
              aria-label="Play Agrivo overview"
            >
              <span className="agrivo-play-pulse absolute inset-0 rounded-full" />
              <Play className="relative ml-1 h-8 w-8 fill-current lg:h-9 lg:w-9" />
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.35 }}
              className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-6 lg:p-7"
            >
              <div className="rounded-[20px] border border-white/18 bg-[rgba(16,32,24,0.62)] p-4 text-white backdrop-blur-md sm:rounded-[24px] sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D5F4D9]">
                      Featured overview
                    </p>
                    <h3 className="mt-1.5 agrivo-heading text-lg leading-tight text-white sm:text-xl lg:text-[1.7rem]">
                      Agrivo market flow
                    </h3>
                    <p className="mt-2 hidden text-sm leading-6 text-white/78 sm:block">
                      A quick look at harvest collection, verified farmer handoff, and the delivery routes that keep
                      produce moving fresh.
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 self-start rounded-full bg-white/10 px-3.5 py-2 text-sm font-medium text-white/88">
                    <Clock3 className="h-4 w-4 text-[#A7E3B0]" />
                    02:14 preview
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
