import React from "react";
import { Button } from "../shared/ui/Button";

interface FormActionsProps {
  onReset: () => void;
  resetLabel?: string;
  submitLabel?: string;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onReset,
  resetLabel = "Réinitialiser",
  submitLabel = "Générer mon programme personnalisé",
}) => {
  const resetIcon = (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );

  const submitIcon = (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 7l5 5m0 0l-5 5m5-5H6"
      />
    </svg>
  );

  return (
    <div className="mt-8 pt-6 border-t-2" style={{ borderColor: "var(--decathlon-gray-light)" }}>
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Button
          type="button"
          variant="gray"
          onClick={onReset}
          icon={resetIcon}
          aria-label="Réinitialiser le formulaire"
          className="bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          {resetLabel}
        </Button>
        <Button
          type="submit"
          variant="primary"
          icon={submitIcon}
          className="decathlon-button flex-1 sm:flex-initial"
          aria-label="Soumettre le formulaire et générer le programme personnalisé"
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  );
};
