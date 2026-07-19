"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Radio } from "lucide-react";
import {
  fadeUp,
  staggerContainer,
  cardVariant,
} from "@/data/animationVariants";
import reciters from "@/data/jsons/imam.json";
import { SPOTLIGHT_IDS, audioFeatures } from "@/data/datas/homeData";
import ReciterCard from "./ReciterCard";
import AudioNowPlayingBar from "./AudioNowPlayingBar";
import useUIStore from "@/lib/store/useUIStore";

const spotlightReciters = SPOTLIGHT_IDS.map((id) =>
  reciters.find((r) => r.id === id),
).filter(Boolean);

function getFatihaUrl(reciterPath) {
  return `https://everyayah.com/data/${reciterPath}/001002.mp3`;
}

const TOTAL_RECITERS = reciters.length;

export default function AudioRecitationsSection() {
  // `selectedId` = which card the user clicked (drives the <audio> src)
  // `playingId` = confirmed playing (set once audio actually starts)
  const [selectedId, setSelectedId] = useState(null);
  const [playingId, setPlayingId] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [favorites, setFavorites] = useState(new Set([42, 7]));
  const audioRef = useRef(null);

  const { volume } = useUIStore();

  // Keep the live <audio> element in sync whenever global volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handlePlay = useCallback(
    (reciter) => {
      // Tap the same card → pause & deselect
      if (selectedId === reciter.id) {
        audioRef.current?.pause();
        setSelectedId(null);
        setPlayingId(null);
        return;
      }
      // Switch to a different reciter
      setLoadingId(reciter.id);
      setPlayingId(null);
      setSelectedId(reciter.id);
    },
    [selectedId],
  );

  const toggleFav = useCallback((id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  // Derive the current audio URL from the selected reciter
  const activeReciter = spotlightReciters.find((r) => r.id === selectedId);
  const audioUrl = activeReciter ? getFatihaUrl(activeReciter.path) : null;
  const activeReciterName =
    spotlightReciters.find((r) => r.id === playingId)?.name || "";

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
      {/* Ambient orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-1/4 size-96 bg-accent opacity-[0.07] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 size-72 bg-violet-500 opacity-[0.08] rounded-full blur-3xl" />
      </div>

      {/* Hidden audio player */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          autoPlay
          onPlay={() => {
            setLoadingId(null);
            setPlayingId(selectedId);
          }}
          onEnded={() => {
            setPlayingId(null);
            setSelectedId(null);
          }}
          onPause={() => setPlayingId(null)}
          onWaiting={() => setLoadingId(selectedId)}
          onCanPlay={() => setLoadingId(null)}
          onError={() => {
            setLoadingId(null);
            setPlayingId(null);
            setSelectedId(null);
          }}
          onLoadedMetadata={(e) => {
            e.target.volume = volume; // ensure volume persists across reciter switches
          }}
        />
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-accent text-xs font-semibold font-jakarta tracking-widest uppercase mb-5 border border-accent/20">
            <Radio size={11} />
            Audio Recitations
          </div>

          <h2 className="font-jakarta font-bold text-3xl sm:text-4xl text-text-primary mb-4">
            Listen to the Quran with{" "}
            <span className="gradient-text">your favourite reciter</span>
          </h2>
          <p className="font-inter text-text-secondary max-w-xl mx-auto leading-relaxed">
            Play, pause, and explore over{" "}
            <span className="text-accent font-semibold">
              {TOTAL_RECITERS} world-class reciters
            </span>
            . Favourite the voices that move your heart and return to them
            anytime.
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* LEFT — Feature highlights */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="flex flex-col gap-5"
          >
            {audioFeatures.map(({ icon: Icon, color, bg, title, desc }) => (
              <motion.div
                key={title}
                variants={cardVariant}
                className="flex items-start gap-4 glass rounded-2xl p-5 hover:border-accent/30 transition-all duration-300"
              >
                <div
                  className={`shrink-0 size-10 rounded-xl ${bg} flex items-center justify-center`}
                >
                  <Icon size={18} className={color} />
                </div>
                <div>
                  <h3 className="font-jakarta font-semibold text-text-primary text-sm mb-1">
                    {title}
                  </h3>
                  <p className="font-inter text-text-secondary text-xs leading-relaxed">
                    {desc}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* CTA */}
            <motion.div variants={cardVariant}>
              <Link
                href="/quran"
                className="inline-flex items-center gap-2 mt-1 px-6 py-3.5 rounded-2xl bg-accent text-white font-semibold font-jakarta text-sm hover:opacity-90 hover:shadow-[0_0_30px_rgba(20,184,166,0.4)] active:scale-95 transition-all duration-200"
              >
                Browse all {TOTAL_RECITERS} reciters
                <ChevronRight size={16} />
              </Link>
            </motion.div>
          </motion.div>

          {/* RIGHT — Reciter cards & controls */}
          <motion.div
            variants={staggerContainer}
            layout
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Now playing bar */}
            <AnimatePresence>
              {playingId && (
                <motion.div
                  key="now-playing"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  layout
                  className="overflow-hidden" // Prevents the bar from spilling out while height shrinks
                >
                  <AudioNowPlayingBar
                    reciterName={activeReciterName}
                    onStop={() => {
                      audioRef.current?.pause();
                      setPlayingId(null);
                      setSelectedId(null);
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Grid of reciter cards */}
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-3 gap-3 pr-1"
            >
              {spotlightReciters.map((reciter) => (
                <ReciterCard
                  key={reciter.id}
                  reciter={reciter}
                  isPlaying={playingId === reciter.id}
                  isLoading={loadingId === reciter.id}
                  isFav={favorites.has(reciter.id)}
                  onPlay={handlePlay}
                  onFavToggle={toggleFav}
                />
              ))}
            </motion.div>

            {/* …and N more hint */}
            <motion.p
              variants={fadeUp}
              className="mt-4 text-center text-xs text-text-secondary font-inter"
            >
              …and{" "}
              <Link
                href="/quran"
                className="text-accent hover:underline underline-offset-2"
              >
                {TOTAL_RECITERS - spotlightReciters.length} more reciters
              </Link>{" "}
              waiting for you inside the Quran reader.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
