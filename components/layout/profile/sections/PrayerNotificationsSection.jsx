import {
  BellRing,
  BellOff,
  BellMinus,
  Volume2,
  Clock,
  Play,
  Square,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import useUIStore from "@/lib/store/useUIStore";
import { useState, useRef, useEffect } from "react";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { useNotifications } from "@/hooks/useNotifications";

const MODES = [
  {
    value: "enabled",
    label: "On",
    labelFull: "Notifications & Adhan",
    icon: BellRing,
    color: "text-emerald-400",
    bg: "bg-emerald-500/15 border-emerald-500/30",
    activeBg: "bg-emerald-500",
  },
  {
    value: "muted",
    label: "Muted",
    labelFull: "Notification only, no audio",
    icon: BellMinus,
    color: "text-amber-400",
    bg: "bg-amber-500/15 border-amber-500/30",
    activeBg: "bg-amber-500",
  },
  {
    value: "disabled",
    label: "Off",
    labelFull: "No notifications",
    icon: BellOff,
    color: "text-rose-400",
    bg: "bg-rose-500/15 border-rose-500/30",
    activeBg: "bg-rose-500",
  },
];

export default function PrayerNotificationsSection() {
  const {
    prayerNotificationMode,
    setPrayerNotificationMode,
    prayerNotificationVolume,
    setPrayerNotificationVolume,
    prayerNotificationOffsets,
    setPrayerNotificationOffsets,
  } = useUIStore();

  const [isPlayingTest, setIsPlayingTest] = useState(false);
  const audioRef = useRef(null);
  const { prayers, nextPrayerKey } = usePrayerTimes();
  const { permission, requestPermission, isSupported } = useNotifications();

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = prayerNotificationVolume;
    }
  }, [prayerNotificationVolume]);

  function toggleTestAudio() {
    if (isPlayingTest && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlayingTest(false);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      const nextPrayer = prayers?.find((p) => p.key === nextPrayerKey);
      const nameEn = nextPrayer?.label ?? "Default";

      const audioPath = `/adhanNotificationAudios/${nameEn}${prayerNotificationOffsets[0] ? "_Before" : "_Now"}.mp3`;
      const audio = new Audio(audioPath);
      audio.volume = prayerNotificationVolume;

      audio.onended = () => setIsPlayingTest(false);
      audio.play().catch((e) => {
        console.error("Error playing test audio:", e);
        setIsPlayingTest(false);
      });

      audioRef.current = audio;
      setIsPlayingTest(true);
    }
  }

  const active =
    MODES.find((m) => m.value === prayerNotificationMode) ?? MODES[0];
  const ActiveIcon = active.icon;

  const volumePct = prayerNotificationVolume * 100;

  return (
    <div id="prayer-notifications" className="px-5 py-4">
      <div className="space-y-3">
        {/* Section Title */}
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-accent/10 flex items-center justify-center">
            <BellRing size={13} className="text-accent" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">
            Prayer Notifications
          </span>
        </div>

        {isSupported && permission !== "granted" ? (
          <div className="p-5 glass rounded-xl border border-rose-500/20 bg-rose-500/5 text-center space-y-3">
            <div className="inline-flex items-center justify-center size-10 rounded-full bg-rose-500/20 text-rose-500 mb-1">
              <BellOff size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary mb-1">
                Notifications Disabled
              </p>
              <p className="text-xs text-text-secondary">
                Please allow browser notifications to receive prayer alerts and
                adhan audio.
              </p>
            </div>
            <button
              onClick={requestPermission}
              className="w-full py-2.5 bg-accent text-white hover:bg-accent/90 rounded-lg text-xs font-bold tracking-wider transition-colors cursor-pointer"
            >
              Enable Notifications
            </button>
          </div>
        ) : !isSupported ? (
          <div className="p-5 glass rounded-xl border border-white/5 text-center">
            <p className="text-xs text-text-secondary">
              Push notifications are not supported on this device/browser.
            </p>
          </div>
        ) : (
          <>
            {/* Status card */}
            <div
              className={`flex items-center gap-3 rounded-xl px-4 py-3 border ${active.bg} transition-colors duration-300`}
            >
              <ActiveIcon size={16} className={active.color} />
              <div className="flex-1">
                <p className={`text-sm font-semibold ${active.color}`}>
                  {active.label}
                </p>
                <p className="text-xs text-text-secondary">
                  {active.labelFull}
                </p>
              </div>
            </div>

            {/* 3-state pill toggle */}
            <div
              className="relative flex gap-1 glass rounded-xl p-1"
              role="group"
              aria-label="Prayer notification mode"
            >
              {MODES.map((mode) => {
                const Icon = mode.icon;
                const isActive = prayerNotificationMode === mode.value;
                return (
                  <button
                    key={mode.value}
                    onClick={() => setPrayerNotificationMode(mode.value)}
                    aria-pressed={isActive}
                    aria-label={mode.labelFull}
                    className={`relative flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer z-10 ${
                      isActive
                        ? "text-white"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="notif-pill"
                        className={`absolute inset-0 rounded-lg ${mode.activeBg}`}
                        transition={{
                          type: "spring",
                          stiffness: 150,
                          damping: 30,
                        }}
                      />
                    )}
                    <Icon size={12} className="relative z-10 shrink-0" />
                    <span className="relative z-10">{mode.label}</span>
                  </button>
                );
              })}
            </div>

            <p className="text-[10px] text-text-secondary/60 px-1">
              {prayerNotificationMode === "disabled" &&
                "No alerts will be sent for prayer times."}
              {prayerNotificationMode === "muted" &&
                "Silent browser popup will appear. The adhan audio is silenced."}
              {prayerNotificationMode === "enabled" &&
                "You will receive a browser notification and adhan audio before each prayer."}
            </p>
          </>
        )}
      </div>

      {/* Offsets & Volume Controls */}
      {permission === "granted" && (
        <AnimatePresence>
          {prayerNotificationMode !== "disabled" && (
            <motion.div
              key="offsets-volume"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-3 pb-1">
                {/* Timing (Offsets) */}
                <div className="glass p-3 rounded-xl border border-text-secondary/5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-text-secondary" />
                    <span className="text-xs font-semibold text-text-primary">
                      Notification Timing
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {[
                      { label: "5 Min & Now", offsets: [5, 0] },
                      { label: "Now Only", offsets: [0] },
                      { label: "5 Min Only", offsets: [5] },
                    ].map((opt) => {
                      const isActive =
                        JSON.stringify(prayerNotificationOffsets) ===
                        JSON.stringify(opt.offsets);
                      return (
                        <button
                          key={opt.label}
                          onClick={() =>
                            setPrayerNotificationOffsets(opt.offsets)
                          }
                          className={`flex-1 py-2 px-1 rounded-lg text-[11px] font-semibold transition-all duration-400 border ${
                            isActive
                              ? "bg-accent/15 border-accent/30 text-accent"
                              : "bg-text-primary/5 border-transparent text-text-secondary hover:text-text-primary hover:bg-text-primary/10"
                          } cursor-pointer`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Volume (Only if enabled) */}
                <AnimatePresence>
                  {prayerNotificationMode === "enabled" && (
                    <motion.div
                      key="volume-controls"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4">
                        <div className="glass p-3 rounded-xl border border-text-secondary/5">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Volume2
                                size={14}
                                className="text-text-secondary"
                              />
                              <span className="text-xs font-semibold text-text-primary">
                                Adhan Volume
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={toggleTestAudio}
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all duration-300 cursor-pointer border ${
                                  isPlayingTest
                                    ? "bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20"
                                    : "bg-accent/10 text-accent border-accent/20 hover:bg-accent/20"
                                }`}
                              >
                                {isPlayingTest ? (
                                  <>
                                    <Square
                                      size={10}
                                      className="fill-current"
                                    />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">
                                      Stop
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <Play size={10} className="fill-current" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">
                                      Test
                                    </span>
                                  </>
                                )}
                              </button>
                              <span className="text-xs text-text-secondary font-mono w-8 text-right">
                                {Math.round(prayerNotificationVolume * 100)}%
                              </span>
                            </div>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={prayerNotificationVolume}
                            onChange={(e) =>
                              setPrayerNotificationVolume(
                                parseFloat(e.target.value),
                              )
                            }
                            style={{ "--range-progress": `${volumePct}%` }}
                            className="range-fill always-show-thumb w-full h-0.75 rounded-full appearance-none cursor-pointer outline-none"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
