import React from "react";
import type { Question } from "../../types/index.js";
import {
  SingleChoiceField,
  MultipleChoiceField,
  NumberField,
  TextField,
  BooleanField,
} from "./fields";

interface QuestionFieldProps {
  question: Question;
  index: number;
  value: string | number | boolean | string[] | null;
  error?: string;
  onChange: (value: string | number | boolean | string[]) => void;
}

export const QuestionField: React.FC<QuestionFieldProps> = ({
  question,
  index,
  value,
  error,
  onChange,
}) => {
  switch (question.type) {
    case "single_choice":
      return (
        <SingleChoiceField
          question={question}
          index={index}
          selectedValue={value as string | null}
          error={error}
          onChange={(val) => onChange(val)}
        />
      );

    case "multiple_choice":
      return (
        <MultipleChoiceField
          question={question}
          index={index}
          selectedValues={Array.isArray(value) ? (value as string[]) : []}
          error={error}
          onChange={(vals) => onChange(vals)}
        />
      );

    case "number":
      return (
        <NumberField
          question={question}
          index={index}
          value={typeof value === "number" ? value : question.min || 0}
          error={error}
          onChange={(val) => onChange(val)}
        />
      );

    case "text":
      return (
        <TextField
          question={question}
          index={index}
          value={typeof value === "string" ? value : ""}
          error={error}
          onChange={(val) => onChange(val)}
        />
      );

    case "boolean":
      return (
        <BooleanField
          question={question}
          index={index}
          value={Boolean(value)}
          error={error}
          onChange={(val) => onChange(val)}
        />
      );

    default:
      return null;
  }
};

