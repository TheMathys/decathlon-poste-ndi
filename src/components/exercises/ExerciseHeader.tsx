import React from "react";
import { Badge } from "../shared/ui/Badge";
import type { Exercise } from "../../types/index.js";

interface ExerciseHeaderProps {
  exercise: Exercise;
  index: number;
}

export const ExerciseHeader: React.FC<ExerciseHeaderProps> = ({ exercise, index }) => {
  const niveauBadgeColor =
    {
      debutant: "success" as const,
      intermediaire: "warning" as const,
      avance: "danger" as const,
    }[exercise.niveau] || "default";

  const niveauLabel =
    {
      debutant: "Débutant",
      intermediaire: "Intermédiaire",
      avance: "Avancé",
    }[exercise.niveau] || exercise.niveau;

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl font-bold text-blue-600">#{index + 1}</span>
            <h3 className="text-2xl font-bold text-gray-900">{exercise.name}</h3>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant={niveauBadgeColor}>{niveauLabel}</Badge>
            {exercise.objectifs_cibles.map((objectif, idx) => (
              <Badge key={idx} variant="purple">
                {objectif.replace(/_/g, " ")}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
