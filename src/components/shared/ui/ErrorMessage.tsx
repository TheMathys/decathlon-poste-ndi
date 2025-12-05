import React from "react";

interface ErrorMessageProps {
  id?: string;
  message: string;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  id,
  message,
  className = "",
}) => {
  return (
    <div
      id={id}
      className={`decathlon-error ${className}`}
      role="alert"
      aria-live="polite"
    >
      {message}
    </div>
  );
};

