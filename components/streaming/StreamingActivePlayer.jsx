import { AnimatePresence, motion } from "framer-motion";
import RadioPlayer from "./radio/RadioPlayer";
import LiveTVPlayer from "./live-tv/LiveTVPlayer";

export default function StreamingActivePlayer({
  activePlayer,
  setActivePlayer,
  setIsPlaying,
}) {
  return (
    <div className="w-full mb-10">
      <AnimatePresence mode="popLayout">
        {activePlayer && (
          <motion.div
            key={activePlayer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {setIsPlaying ? (
              <RadioPlayer
                station={activePlayer}
                onCloseAudio={() => setActivePlayer(null)}
                onPlayingChange={setIsPlaying}
              />
            ) : (
              <LiveTVPlayer
                channel={activePlayer}
                onCloseVideo={() => setActivePlayer(null)}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
