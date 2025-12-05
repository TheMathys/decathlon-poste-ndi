import React from "react";
import type { Question } from "../../../types/index.js";
import { ErrorMessage } from "../../shared/ui/ErrorMessage";

interface MultipleChoiceFieldProps {
  question: Question;
  index: number;
  selectedValues: string[];
  error?: string;
  onChange: (values: string[]) => void;
}

export const MultipleChoiceField: React.FC<MultipleChoiceFieldProps> = ({
  question,
  index,
  selectedValues,
  error,
  onChange,
}) => {
  const errorId = `error-${question.id}`;

  const handleToggle = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  return (
    <fieldset
      id={`question-${index}`}
      className="decathlon-fieldset fade-in"
      aria-invalid={error ? "true" : "false"}
      aria-describedby={error ? errorId : undefined}
    >
      <legend
        className={`decathlon-legend ${question.required ? "decathlon-legend-required" : ""}`}
      >
        {question.question}
      </legend>
      <div className="decathlon-checkbox-group" role="group" aria-required={question.required}>
        {question.options?.map((option, optIndex) => {
          const isChecked = selectedValues.includes(option.value);
          return (
            <div
              key={optIndex}
              className={`decathlon-checkbox ${isChecked ? "decathlon-checkbox-checked" : ""}`}
              onClick={() => handleToggle(option.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleToggle(option.value);
                }
              }}
              tabIndex={0}
              role="checkbox"
              aria-checked={isChecked}
            >
              <input
                type="checkbox"
                id={`question-${index}-option-${optIndex}`}
                value={option.value}
                checked={isChecked}
                onChange={() => handleToggle(option.value)}
                aria-describedby={error ? errorId : undefined}
              />
              <label htmlFor={`question-${index}-option-${optIndex}`}>{option.label}</label>
            </div>
          );
        })}
      </div>
      {error && <ErrorMessage id={errorId} message={error} />}
    </fieldset>
  );
};
