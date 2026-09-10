"use client";

import { AlertTriangle, X } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  title?: string;
  onClose?: () => void;
}

export default function ErrorMessage({
  message,
  title = "Something went wrong",
  onClose,
}: ErrorMessageProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4">
      <div className="flex items-start gap-3">

        <AlertTriangle
          size={20}
          className="mt-0.5 shrink-0 text-red-600"
        />

        <div className="flex-1">
          <h3 className="font-semibold text-red-800">
            {title}
          </h3>

          <p className="mt-1 text-sm text-red-700">
            {message}
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700"
            aria-label="Close error"
          >
            <X size={18} />
          </button>
        )}

      </div>
    </div>
  );
}