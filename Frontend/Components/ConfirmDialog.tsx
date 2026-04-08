import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
  message: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  disableOutsideClick?: boolean;
  closeOnEsc?: boolean; // NEW
  autoFocus?: "confirm" | "cancel";
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
  closeOnEsc = true,
  autoFocus = "confirm",
  onConfirm,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(true); // animation state

  const confirmRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Save & restore focus
  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement;
    return () => previouslyFocused.current?.focus();
  }, []);

  // Disable background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // ESC key control
  useEffect(() => {
    if (!closeOnEsc) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) handleClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [loading, closeOnEsc]);

  // Focus trap (future scalable)
  useEffect(() => {
    const focusEl =
      autoFocus === "cancel" ? cancelRef.current : confirmRef.current;

    focusEl?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusable = [cancelRef.current, confirmRef.current].filter(
        Boolean,
      ) as HTMLElement[];

      const index = focusable.indexOf(document.activeElement as HTMLElement);

      if (e.shiftKey) {
        if (index === 0) {
          e.preventDefault();
          focusable[focusable.length - 1].focus();
        }
      } else {
        if (index === focusable.length - 1) {
          e.preventDefault();
          focusable[0].focus();
        }
      }
    };

    window.addEventListener("keydown", handleTab);
    return () => window.removeEventListener("keydown", handleTab);
  }, [autoFocus]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onCancel(), 200); // match animation
  };

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (
      !disableOutsideClick &&
      dialogRef.current &&
      !dialogRef.current.contains(e.target as Node) &&
      !loading
    ) {
      handleClose();
    }
  };

  const handleConfirm = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await onConfirm();
      handleClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const modal = (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onMouseDown={handleOutsideClick}
      data-testid="confirm-overlay"
    >
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        className={`bg-white p-6 rounded-xl shadow-xl w-80 transform transition-all duration-200 ${
          visible ? "scale-100" : "scale-95"
        }`}
        data-testid="confirm-dialog"
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
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 outline-none focus:ring"
            data-testid="cancel-btn"
          >
            {cancelText}
          </button>

          <button
            ref={confirmRef}
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className={`px-4 py-2 text-white rounded disabled:opacity-50 outline-none focus:ring flex items-center gap-2 ${
              danger
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            data-testid="confirm-btn"
          >
            {loading && (
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="white"
                  strokeWidth="3"
                  opacity="0.3"
                />
                <path
                  d="M22 12a10 10 0 00-10-10"
                  stroke="white"
                  strokeWidth="3"
                />
              </svg>
            )}
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default ConfirmDialog;
