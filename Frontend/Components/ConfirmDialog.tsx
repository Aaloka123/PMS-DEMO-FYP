import React, { useEffect, useRef, useState } from "react";

interface Props {
  message: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<Props> = ({
  message,
  title = "Confirm Action",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

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

  // ENTER key
  useEffect(() => {
    const handleEnter = (e: KeyboardEvent) => {
      if (
        e.key === "Enter" &&
        !loading &&
        document.activeElement !== cancelRef.current
      ) {
        handleConfirm();
      }
    };

    window.addEventListener("keydown", handleEnter);
    return () => window.removeEventListener("keydown", handleEnter);
  }, [loading]);

  // Focus trap + fallback
  useEffect(() => {
    const focusEl = confirmRef.current || cancelRef.current;
    focusEl?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (document.activeElement === confirmRef.current && !e.shiftKey) {
        e.preventDefault();
        cancelRef.current?.focus();
      } else if (document.activeElement === cancelRef.current && e.shiftKey) {
        e.preventDefault();
        confirmRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleTab);
    return () => window.removeEventListener("keydown", handleTab);
  }, []);

  // Prevent accidental outside click (mousedown instead of click)
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (
      dialogRef.current &&
      !dialogRef.current.contains(e.target as Node) &&
      !loading
    ) {
      onCancel();
    }
  };

  const handleConfirm = async () => {
    if (loading) return; // guard against double click
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

        <div className="flex justify-end gap-3" aria-live="polite">
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
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 outline-none focus:ring"
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
