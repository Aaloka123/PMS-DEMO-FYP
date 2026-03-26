import React, { useEffect, useRef, useState } from "react";

interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<Props> = ({ message, onConfirm, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const confirmRef = useRef<HTMLButtonElement>(null);

  // ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onCancel]);

  // ENTER key
  useEffect(() => {
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !loading) handleConfirm();
    };

    window.addEventListener("keydown", handleEnter);
    return () => window.removeEventListener("keydown", handleEnter);
  }, [loading]);

  // Focus confirm button
  useEffect(() => {
    confirmRef.current?.focus();
  }, []);

  const handleConfirm = () => {
    if (loading) return;
    setLoading(true);
    onConfirm();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="bg-white p-6 rounded-xl shadow-xl w-80 transform transition-all duration-300 scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mb-5 text-gray-700">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            ref={confirmRef}
            onClick={handleConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
