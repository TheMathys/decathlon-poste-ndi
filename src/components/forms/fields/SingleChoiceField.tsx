import React from "react";
import type { Question } from "../../../types/index.js";
import { ErrorMessage } from "../../shared/ui/ErrorMessage";

interface SingleChoiceFieldProps {
  question: Question;
  index: number;
  selectedValue: string | null;
  error?: string;
  onChange: (value: string) => void;
}

export const SingleChoiceField: React.FC<SingleChoiceFieldProps> = ({
  question,
  index,
  selectedValue,
  error,
  onChange,
}) => {
  const errorId = `error-${question.id}`;

  return (
    <fieldset
      id={`question-${index}`}
      className="decathlon-fieldset"
      aria-invalid={error ? "true" : "false"}
      aria-describedby={error ? errorId : undefined}
    >
      <legend
        className={`decathlon-legend ${question.required ? "decathlon-legend-required" : ""}`}
      >
        {question.question}
      </legend>
      <div className="decathlon-radio-group" role="radiogroup" aria-required={question.required}>
        {question.options?.map((option) => (
          <div
            key={option.value}
            className={`decathlon-radio ${selectedValue === option.value ? "decathlon-radio-checked" : ""}`}
            onClick={() => onChange(option.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onChange(option.value);
              }
            }}
            tabIndex={0}
            role="radio"
            aria-checked={selectedValue === option.value}
          >
            <input
              type="radio"
              id={`question-${index}-${option.value}`}
              name={`question-${index}`}
              value={option.value}
              checked={selectedValue === option.value}
              required={question.required ?? false}
              onChange={() => onChange(option.value)}
              aria-describedby={error ? errorId : undefined}
            />
            <label htmlFor={`question-${index}-${option.value}`}>{option.label}</label>
          </div>
        ))}
      </div>
      {error && <ErrorMessage id={errorId} message={error} />}
    </fieldset>
  );
};
