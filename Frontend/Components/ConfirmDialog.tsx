import React, { useEffect, useRef, useState } from "react";

interface Props {
  message: string;
  title?: string; // NEW
  confirmText?: string; // NEW
  cancelText?: string; // NEW
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
      if (e.key === "Enter" && !loading) handleConfirm();
    };

    window.addEventListener("keydown", handleEnter);
    return () => window.removeEventListener("keydown", handleEnter);
  }, [loading]);

  // Focus trap
  useEffect(() => {
    confirmRef.current?.focus();

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
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={() => !loading && onCancel()}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="bg-white p-6 rounded-xl shadow-xl w-80"
        onClick={(e) => e.stopPropagation()}
      >
        {/* NEW Title */}
        <h2 className="text-lg font-semibold mb-2">{title}</h2>

        <p className="mb-5 text-gray-700">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            ref={cancelRef}
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            ref={confirmRef}
            onClick={handleConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
