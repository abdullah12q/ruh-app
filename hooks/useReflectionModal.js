import { useAyahReflections, useSubmitReflection } from "@/lib/queries/halaqah";
import useHalaqahStore from "@/lib/store/useHalaqahStore";
import { useCallback, useEffect, useRef, useState } from "react";
import SURAH_META from "@/data/surahMeta";

export default function useReflectionModal(halaqahId) {
  const [content, setContent] = useState("");
  const [submitError, setSubmitError] = useState(null);
  const textareaRef = useRef(null);
  const listBottomRef = useRef(null);

  const { isModalOpen, selectedAyah, closeReflectionModal, clearSelectedAyah } =
    useHalaqahStore();

  const surahNumber = selectedAyah?.surahNumber ?? null;
  const ayahNumber = selectedAyah?.ayahNumber ?? null;
  const surahName = surahNumber
    ? (SURAH_META.find((s) => s.id === surahNumber)?.name ??
      `Surah ${surahNumber}`)
    : "";

  const {
    data: reflections = [],
    isLoading,
    isFetching,
  } = useAyahReflections(halaqahId, surahNumber, ayahNumber);

  const { mutate: submitReflection, isPending: isSubmitting } =
    useSubmitReflection(halaqahId, surahNumber, ayahNumber);

  const handleClose = useCallback(() => {
    closeReflectionModal();
    // Delay clearing selectedAyah to avoid flash during exit animation
    setTimeout(clearSelectedAyah, 300);
  }, [closeReflectionModal, clearSelectedAyah]);

  // Auto-focus textarea when modal opens
  useEffect(() => {
    if (isModalOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setContent("");
      setSubmitError(null);
      setTimeout(() => textareaRef.current?.focus(), 80);
    }
  }, [isModalOpen, surahNumber, ayahNumber]);

  // Auto-scroll on new reflections
  useEffect(() => {
    if (reflections.length > 0) {
      listBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [reflections.length]);

  // Keyboard: Escape to close
  useEffect(() => {
    if (!isModalOpen) return;
    function onKeyDown(e) {
      if (e.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleClose, isModalOpen]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  function handleSubmit(e) {
    e?.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || isSubmitting) return;
    setSubmitError(null);

    submitReflection(
      { content: trimmed },
      {
        onSuccess: (result) => {
          if (result?.success) {
            setContent("");
            textareaRef.current?.focus();
          } else {
            setSubmitError(result?.error ?? "Failed to submit. Try again.");
          }
        },
        onError: () => setSubmitError("Something went wrong."),
      },
    );
  }

  return {
    content,
    setContent,
    submitError,
    textareaRef,
    listBottomRef,
    isModalOpen,
    selectedAyah,
    clearSelectedAyah,
    surahNumber,
    ayahNumber,
    surahName,
    reflections,
    isLoading,
    isFetching,
    isSubmitting,
    handleClose,
    handleSubmit,
  };
}
