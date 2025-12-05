import React from "react";
import type { Question } from "../../../types/index.js";
import { ErrorMessage } from "../../shared/ui/ErrorMessage";

interface BooleanFieldProps {
  question: Question;
  index: number;
  value: boolean;
  error?: string;
  onChange: (value: boolean) => void;
}

export const BooleanField: React.FC<BooleanFieldProps> = ({
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
      className="decathlon-fieldset fade-in"
      aria-invalid={error ? "true" : "false"}
      aria-describedby={error ? errorId : undefined}
    >
      <div
        className={`decathlon-checkbox-simple ${value ? "decathlon-checkbox-checked" : ""}`}
        onClick={() => onChange(!value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onChange(!value);
          }
        }}
        tabIndex={0}
        role="checkbox"
        aria-checked={value}
      >
        <input
          type="checkbox"
          id={`question-${index}`}
          checked={value}
          required={question.required ?? false}
          onChange={() => onChange(!value)}
          aria-describedby={error ? errorId : undefined}
          aria-required={question.required}
        />
        <label htmlFor={`question-${index}`}>
          {question.question}
          {question.required && <span className="decathlon-legend-required"> *</span>}
        </label>
      </div>
      {error && <ErrorMessage id={errorId} message={error} />}
    </div>
  );
};
