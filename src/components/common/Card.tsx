import React from "react";

interface CardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  padding?: "sm" | "md" | "lg";
}

export default function Card({
  children,
  title,
  description,
  className = "",
  padding = "md",
}: CardProps) {
  const paddingClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <section
      className={`
        rounded-2xl border border-gray-200
        bg-white shadow-sm
        ${paddingClasses[padding]}
        ${className}
      `}
    >
      {(title || description) && (
        <div className="mb-5">
          {title && (
            <h2 className="text-lg font-bold text-gray-900">
              {title}
            </h2>
          )}

          {description && (
            <p className="mt-1 text-sm text-gray-500">
              {description}
            </p>
          )}
        </div>
      )}

      {children}
    </section>
  );
}