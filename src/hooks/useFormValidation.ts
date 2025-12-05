import { useState, useCallback } from "react";
import type { SportProfile, QCMData, Question } from "../types/index.js";

type FormValue = string | number | boolean | string[] | null;

function getNestedValue(obj: SportProfile, path: string): FormValue {
  const keys = path.split(".");
  let value: unknown = obj;
  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return null;
    }
  }
  return value as FormValue;
}

function validateQuestion(question: Question, value: FormValue): string | null {
  if (question.required) {
    if (value === null || value === "" || value === false) {
      return "Ce champ est requis.";
    }
    if (Array.isArray(value) && value.length === 0) {
      return "Ce champ est requis.";
    }
  }

  if (question.type === "number" && value !== null && typeof value === "number") {
    if (question.min !== undefined && value < question.min) {
      return `La valeur doit être supérieure ou égale à ${question.min}.`;
    }
    if (question.max !== undefined && value > question.max) {
      return `La valeur doit être inférieure ou égale à ${question.max}.`;
    }
  }

  return null;
}

export function useFormValidation(profile: SportProfile, qcmData: QCMData) {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const validateField = useCallback((question: Question, value: FormValue): string | null => {
    return validateQuestion(question, value);
  }, []);

  const validateAll = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    qcmData.qcm.forEach((question) => {
      const value = getNestedValue(profile, question.store_as);
      const error = validateQuestion(question, value);
      if (error) {
        errors[question.id] = error;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [profile, qcmData]);

  const validateFieldOnChange = useCallback(
    (questionId: string, question: Question, value: FormValue) => {
      setTouchedFields((prev) => new Set(prev).add(questionId));
      const error = validateField(question, value);
      setValidationErrors((prev) => {
        if (error) {
          return { ...prev, [questionId]: error };
        } else {
          const { [questionId]: _, ...rest } = prev;
          return rest;
        }
      });
    },
    [validateField]
  );

  const getFieldError = useCallback(
    (questionId: string): string | undefined => {
      if (touchedFields.has(questionId) || validationErrors[questionId]) {
        return validationErrors[questionId];
      }
      return undefined;
    },
    [validationErrors, touchedFields]
  );

  const getFirstErrorFieldId = useCallback((): string | null => {
    const firstError = Object.keys(validationErrors)[0];
    if (firstError) {
      const question = qcmData.qcm.find((q) => q.id === firstError);
      if (question) {
        const index = qcmData.qcm.indexOf(question);
        return `question-${index}`;
      }
    }
    return null;
  }, [validationErrors, qcmData]);

  return {
    validationErrors,
    validateAll,
    validateFieldOnChange,
    getFieldError,
    getFirstErrorFieldId,
    setTouchedFields,
  };
}
