import React from "react";
import type { Question } from "../../../types/index.js";
import { ErrorMessage } from "../../shared/ui/ErrorMessage";

interface TextFieldProps {
  question: Question;
  index: number;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export const TextField: React.FC<TextFieldProps> = ({
  question,
  index,
  value,
  error,
  onChange,
}) => {
  const errorId = `error-${question.id}`;

  return (
    <div
      id={`question-${index}`}
      className="decathlon-text-input fade-in"
      aria-invalid={error ? "true" : "false"}
      aria-describedby={error ? errorId : undefined}
    >
      <label htmlFor={`question-${index}-input`}>
        {question.question}
        {question.required && <span className="decathlon-legend-required"> *</span>}
      </label>
      <input
        type="text"
        id={`question-${index}-input`}
        value={value}
        placeholder={question.placeholder || ""}
        required={question.required ?? false}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={error ? errorId : undefined}
        aria-required={question.required}
      />
      {error && <ErrorMessage id={errorId} message={error} />}
    </div>
  );
};
