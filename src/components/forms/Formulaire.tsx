import React, { useMemo, useRef } from "react";
import data from "../../assets/json/qcm.json";
import sample_person from "../../assets/json/sample_person.json";
import "./decathlon-styles.css";
import type { SportProfile, QCMData } from "../../types/index.js";
import { useProfileForm } from "../../hooks/useProfileForm";
import { useFormValidation } from "../../hooks/useFormValidation";
import { useProfilePersistence, useInitialProfile } from "../../hooks/useProfilePersistence";
import { clearProfileFromLocalStorage } from "../../utils/localStorage";
import { FormHeader } from "./FormHeader";
import { FormActions } from "./FormActions";
import { QuestionField } from "./QuestionField";

interface FormulaireProps {
  onSubmit: (profile: SportProfile) => void;
}

const Formulaire: React.FC<FormulaireProps> = ({ onSubmit }) => {
  const defaultProfile = sample_person as SportProfile;
  const initialProfile = useInitialProfile(defaultProfile);
  const { profile, getValue, setValue, resetProfile } = useProfileForm(initialProfile);
  const qcmData = data as QCMData;
  const formRef = useRef<HTMLFormElement>(null);

  const {
    validateAll,
    validateFieldOnChange,
    getFieldError,
    getFirstErrorFieldId,
    setTouchedFields,
  } = useFormValidation(profile, qcmData);

  useProfilePersistence(profile);

  const handleReset = () => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir réinitialiser le formulaire ? Toutes vos réponses seront perdues."
      )
    ) {
      resetProfile(defaultProfile);
      setTouchedFields(new Set());
      clearProfileFromLocalStorage();
      if (formRef.current) {
        formRef.current.reset();
      }
    }
  };

  const progress = useMemo(() => {
    const totalQuestions = qcmData.qcm.filter((q) => q.required).length;
    let answeredQuestions = 0;

    qcmData.qcm.forEach((question) => {
      if (!question.required) return;

      const value = getValue(question.store_as);
      if (value !== null && value !== "" && value !== false) {
        if (Array.isArray(value) && value.length > 0) {
          answeredQuestions++;
        } else if (!Array.isArray(value)) {
          answeredQuestions++;
        }
      }
    });

    return totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
  }, [qcmData, getValue]);

  const handleValueChange = (
    questionId: string,
    question: (typeof qcmData.qcm)[0],
    value: string | number | boolean | string[]
  ) => {
    setValue(question.store_as, value);
    validateFieldOnChange(questionId, question, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAll()) {
      onSubmit(profile);
    } else {
      const firstErrorId = getFirstErrorFieldId();
      if (firstErrorId && formRef.current) {
        setTimeout(() => {
          const errorElement = formRef.current?.querySelector(`#${firstErrorId}`);
          if (errorElement) {
            errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
            const inputElement = errorElement.querySelector(
              "input, select, textarea"
            ) as HTMLElement;
            if (inputElement) {
              inputElement.focus();
            }
          }
        }, 100);
      }
    }
  };

  const answeredCount = useMemo(() => {
    return qcmData.qcm.filter((q) => {
      const value = getValue(q.store_as);
      return (
        q.required &&
        value !== null &&
        value !== "" &&
        value !== false &&
        (!Array.isArray(value) || value.length > 0)
      );
    }).length;
  }, [qcmData, getValue]);

  const totalRequired = useMemo(() => {
    return qcmData.qcm.filter((q) => q.required).length;
  }, [qcmData]);

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="decathlon-form">
      <FormHeader progress={progress} answeredCount={answeredCount} totalRequired={totalRequired} />
      <div className="space-y-8">
        {qcmData.qcm.map((question, index) => {
          const error = getFieldError(question.id);
          const currentValue = getValue(question.store_as);

          return (
            <QuestionField
              key={question.id}
              question={question}
              index={index}
              value={currentValue}
              error={error}
              onChange={(value) => handleValueChange(question.id, question, value)}
            />
          );
        })}
      </div>
      <FormActions onReset={handleReset} />
    </form>
  );
};

export default Formulaire;
