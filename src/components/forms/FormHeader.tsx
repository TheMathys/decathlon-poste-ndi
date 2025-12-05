import React from "react";
import { ProgressBar } from "../shared/ui/ProgressBar";

interface FormHeaderProps {
  progress: number;
  answeredCount: number;
  totalRequired: number;
}

export const FormHeader: React.FC<FormHeaderProps> = ({
  progress,
  answeredCount,
  totalRequired,
}) => {
  return (
    <div className="decathlon-form-header">
      <h2>Questionnaire de Profilage Sportif</h2>
      <p>
        Répondez aux questions pour recevoir des recommandations personnalisées adaptées à votre
        profil
      </p>
      <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-700 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Votre progression est sauvegardée automatiquement
        </p>
      </div>

      <div className="mt-6">
        <ProgressBar value={progress} max={100} showPercentage label="Progression" />
        <p className="text-xs text-gray-500 mt-2">
          {answeredCount} / {totalRequired} questions requises complétées
        </p>
      </div>
    </div>
  );
};
