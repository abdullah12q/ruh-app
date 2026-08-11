import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { backdropVariants, panelVariants } from "@/data/animationVariants";
import useReflectionModal from "@/hooks/useReflectionModal";
import ReflectionHeader from "./ReflectionHeader";
import ReflectionList from "./ReflectionList";
import ReflectionSubmit from "./ReflectionSubmit";

const MAX_CHARS = 2000;

export default function ReflectionModal({ halaqahId, colorMap }) {
  const {
    isModalOpen,
    selectedAyah,
    clearSelectedAyah,
    content,
    setContent,
    submitError,
    textareaRef,
    listBottomRef,
    surahNumber,
    ayahNumber,
    surahName,
    reflections,
    isLoading,
    isFetching,
    isSubmitting,
    handleClose,
    handleSubmit,
  } = useReflectionModal(halaqahId);

  const dragControls = useDragControls();

  const charsLeft = MAX_CHARS - content.length;
  const isOverLimit = charsLeft < 0;

  return (
    <AnimatePresence onExitComplete={clearSelectedAyah}>
      {isModalOpen && selectedAyah && (
        <>
          {/* Backdrop */}
          <motion.div
            key="reflection-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleClose}
            className="fixed inset-0 z-40 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="reflection-panel"
            role="dialog"
            aria-modal="true"
            aria-label={`Reflections on ${surahName} ${ayahNumber}`}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            // el7gat ely t7t deh lel drag 3l mobile
            drag="y" // vertical bs
            dragControls={dragControls}
            dragListener={false} // Disable dragging on the whole container (only the handle will work)
            dragConstraints={{ top: 0 }} // Prevent dragging upwards past the starting point
            dragMomentum={false} // Disable the smooth sliding effect when you let go
            onDragEnd={(event, info) => {
              // Close if dragged down more than 100px or with a fast swipe
              if (info.offset.y > 100 || info.velocity.y > 1200) {
                handleClose();
              }
            }}
            className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-2xl sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:w-[calc(100%-2rem)]"
          >
            <div className="flex flex-col glass rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl max-h-[92dvh] sm:max-h-[85vh]">
              {/* Reflection Header */}
              <ReflectionHeader
                surahNumber={surahNumber}
                surahName={surahName}
                ayahNumber={ayahNumber}
                isFetching={isFetching}
                isLoading={isLoading}
                handleClose={handleClose}
                dragControls={dragControls}
              />

              {/* Reflection list */}
              <ReflectionList
                isLoading={isLoading}
                reflections={reflections}
                listBottomRef={listBottomRef}
                colorMap={colorMap}
              />

              {/* Reflection Submit */}
              <ReflectionSubmit
                handleSubmit={handleSubmit}
                isOverLimit={isOverLimit}
                content={content}
                setContent={setContent}
                textareaRef={textareaRef}
                MAX_CHARS={MAX_CHARS}
                charsLeft={charsLeft}
                isSubmitting={isSubmitting}
                submitError={submitError}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
