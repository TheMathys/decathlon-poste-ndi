import React from "react";
import type { Question } from "../../../types/index.js";
import { ErrorMessage } from "../../shared/ui/ErrorMessage";

interface NumberFieldProps {
  question: Question;
  index: number;
  value: number;
  error?: string;
  onChange: (value: number) => void;
}

export const NumberField: React.FC<NumberFieldProps> = ({
  question,
  index,
  value,
  error,
  onChange,
}) => {
  const errorId = `error-${question.id}`;

  const handleDecrease = () => {
    const newValue = Math.max(question.min || 0, value - 1);
    onChange(newValue);
  };

  const handleIncrease = () => {
    const newValue = Math.min(question.max || 100, value + 1);
    onChange(newValue);
  };

  return (
    <div
      id={`question-${index}`}
      className="decathlon-number-input fade-in"
      aria-invalid={error ? "true" : "false"}
      aria-describedby={error ? errorId : undefined}
    >
      <label htmlFor={`question-${index}-input`} className="decathlon-legend">
        {question.question}
        {question.required && <span className="decathlon-legend-required"> *</span>}
      </label>
      <div className="decathlon-number-input-wrapper">
        <button type="button" onClick={handleDecrease} aria-label="Diminuer la valeur" tabIndex={0}>
          −
        </button>
        <input
          type="number"
          id={`question-${index}-input`}
          value={value}
          min={question.min}
          max={question.max}
          required={question.required ?? false}
          onChange={(e) => {
            const val = e.target.value === "" ? question.min || 0 : Number(e.target.value);
            onChange(val);
          }}
          aria-describedby={error ? errorId : undefined}
          aria-required={question.required}
        />
        <button
          type="button"
          onClick={handleIncrease}
          aria-label="Augmenter la valeur"
          tabIndex={0}
        >
          +
        </button>
      </div>
      {error && <ErrorMessage id={errorId} message={error} />}
    </div>
  );
};
