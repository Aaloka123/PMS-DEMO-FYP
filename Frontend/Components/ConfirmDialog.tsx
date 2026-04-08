import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
  message: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  size?: "sm" | "md" | "lg"; // NEW
  icon?: "warning" | "info" | null; // NEW
  footerAlign?: "left" | "center" | "right"; // NEW
  closeOnBackdrop?: boolean; // NEW
  closeOnEsc?: boolean;
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
  size = "md",
  icon = "warning",
  footerAlign = "right",
  closeOnBackdrop = true,
  closeOnEsc = true,
  autoFocus = "confirm",
  onConfirm,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(true);

  const confirmRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Restore focus
  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement;
    return () => previouslyFocused.current?.focus();
  }, []);

  // Disable scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // ESC
  useEffect(() => {
    if (!closeOnEsc) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) handleClose();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [loading, closeOnEsc]);

  // Focus trap
  useEffect(() => {
    const el = autoFocus === "cancel" ? cancelRef.current : confirmRef.current;
    el?.focus();

    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const nodes = [cancelRef.current, confirmRef.current].filter(
        Boolean,
      ) as HTMLElement[];

      const i = nodes.indexOf(document.activeElement as HTMLElement);

      if (e.shiftKey && i === 0) {
        e.preventDefault();
        nodes[nodes.length - 1].focus();
      } else if (!e.shiftKey && i === nodes.length - 1) {
        e.preventDefault();
        nodes[0].focus();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [autoFocus]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onCancel, 200);
  };

  const handleBackdrop = (e: React.MouseEvent) => {
    if (
      closeOnBackdrop &&
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
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const sizeMap = {
    sm: "w-64",
    md: "w-80",
    lg: "w-96",
  };

  const alignMap = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };

  const iconMap = {
    warning: "⚠️",
    info: "ℹ️",
  };

  const modal = (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm transition ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onMouseDown={handleBackdrop}
    >
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-busy={loading}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-message"
        className={`bg-white p-6 rounded-xl shadow-xl transform transition ${
          visible ? "scale-100" : "scale-95"
        } ${sizeMap[size]}`}
      >
        <div className="flex items-center gap-2 mb-2">
          {icon && <span>{iconMap[icon]}</span>}
          <h2 id="dialog-title" className="text-lg font-semibold">
            {title}
          </h2>
        </div>

        <p id="dialog-message" className="mb-5 text-gray-700">
          {message}
        </p>

        <div className={`flex gap-3 ${alignMap[footerAlign]}`}>
          <button
            ref={cancelRef}
            type="button"
            aria-label="Cancel action"
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            ref={confirmRef}
            type="button"
            aria-label="Confirm action"
            onClick={handleConfirm}
            disabled={loading}
            className={`px-4 py-2 text-white rounded disabled:opacity-50 flex items-center gap-2 ${
              danger
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading && <span className="animate-spin">⏳</span>}
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default ConfirmDialog;
