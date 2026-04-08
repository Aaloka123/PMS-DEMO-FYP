import React, { useEffect, useRef, useState } from "react";

interface Props {
  message: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean; // NEW (for destructive actions)
  disableOutsideClick?: boolean; // NEW
  autoFocus?: "confirm" | "cancel"; // NEW
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<Props> = ({
  message,
  title = "Confirm Action",
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = true,
  disableOutsideClick = false,
  autoFocus = "confirm",
  onConfirm,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Save and restore focus
  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement;

    return () => {
      previouslyFocused.current?.focus();
    };
  }, []);

  // Disable background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onCancel();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onCancel, loading]);

  // ENTER + SPACE key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (
        (e.key === "Enter" || e.key === " ") &&
        !loading &&
        document.activeElement !== cancelRef.current
      ) {
        e.preventDefault();
        handleConfirm();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [loading]);

  // Focus trap
  useEffect(() => {
    const focusEl =
      autoFocus === "cancel" ? cancelRef.current : confirmRef.current;

    focusEl?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (!confirmRef.current || !cancelRef.current) return;

      if (!e.shiftKey && document.activeElement === confirmRef.current) {
        e.preventDefault();
        cancelRef.current.focus();
      } else if (e.shiftKey && document.activeElement === cancelRef.current) {
        e.preventDefault();
        confirmRef.current.focus();
      }
    };

    window.addEventListener("keydown", handleTab);
    return () => window.removeEventListener("keydown", handleTab);
  }, [autoFocus]);

  // Outside click handler
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (
      !disableOutsideClick &&
      dialogRef.current &&
      !dialogRef.current.contains(e.target as Node) &&
      !loading
    ) {
      onCancel();
    }
  };

  const handleConfirm = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await onConfirm();
      onCancel();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-200"
      onMouseDown={handleOutsideClick}
    >
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        className="bg-white p-6 rounded-xl shadow-xl w-80 transform transition-all duration-200 scale-100"
      >
        <h2 id="confirm-dialog-title" className="text-lg font-semibold mb-2">
          {title}
        </h2>

        <p id="confirm-dialog-message" className="mb-5 text-gray-700">
          {message}
        </p>

        <div className="flex justify-end gap-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 outline-none focus:ring"
          >
            {cancelText}
          </button>

          <button
            ref={confirmRef}
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className={`px-4 py-2 text-white rounded disabled:opacity-50 outline-none focus:ring ${
              danger
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
