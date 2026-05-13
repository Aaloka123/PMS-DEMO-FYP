import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Info, Loader2 } from "lucide-react";

interface Props {
  message: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  loadingText?: string; // NEW
  danger?: boolean;
  size?: "sm" | "md" | "lg";
  icon?: "warning" | "info" | null;
  footerAlign?: "left" | "center" | "right";
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  autoFocus?: "confirm" | "cancel";
  className?: string; // NEW
  onOpen?: () => void; // NEW
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<Props> = ({
  message,
  title = "Confirm Action",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loadingText = "Processing...",
  danger = true,
  size = "md",
  icon = "warning",
  footerAlign = "right",
  closeOnBackdrop = true,
  closeOnEsc = true,
  autoFocus = "confirm",
  className = "",
  onOpen,
  onConfirm,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(true);
  const [error, setError] = useState<string | null>(null); // NEW

  const confirmRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Lifecycle: onOpen
  useEffect(() => {
    onOpen?.();
  }, []);

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
    setError(null);

    try {
      await onConfirm();
      handleClose();
    } catch (e: any) {
      setError(e?.message || "Something went wrong"); // NEW UI feedback
    } finally {
      setLoading(false);
    }
  };

  const sizeMap = {
    sm: "max-w-xs",
    md: "max-w-sm",
    lg: "max-w-md",
  };

  const alignMap = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };

  const modal = (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm transition duration-200 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
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
        className={`w-full transform rounded-2xl border border-slate-200 bg-white p-6 shadow-xl transition-all duration-200 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        } ${sizeMap[size]} ${className}`}
      >
        <div className="mb-2 flex items-start gap-3">
          {icon === "warning" && (
            <AlertTriangle
              className="mt-0.5 h-6 w-6 shrink-0 text-amber-500"
              aria-hidden
            />
          )}
          {icon === "info" && (
            <Info className="mt-0.5 h-6 w-6 shrink-0 text-blue-500" aria-hidden />
          )}
          <h2 id="dialog-title" className="text-lg font-semibold text-slate-900">
            {title}
          </h2>
        </div>

        <p id="dialog-message" className="mb-3 text-slate-600">
          {message}
        </p>

        {error && (
          <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className={`flex flex-wrap gap-2 sm:gap-3 ${alignMap[footerAlign]}`}>
          <button
            ref={cancelRef}
            type="button"
            aria-label="Cancel action"
            onClick={handleClose}
            disabled={loading}
            className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-300 disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            ref={confirmRef}
            type="button"
            aria-label="Confirm action"
            onClick={handleConfirm}
            disabled={loading}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 ${
              danger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading && <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />}
            {loading ? loadingText : confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default ConfirmDialog;
