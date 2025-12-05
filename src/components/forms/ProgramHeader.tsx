import React from "react";
import { Badge } from "../shared/ui/Badge";

interface ProgramHeaderProps {
  exerciseCount: number;
}

export const ProgramHeader: React.FC<ProgramHeaderProps> = ({ exerciseCount }) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Votre Programme Personnalisé</h1>
      <p className="text-lg text-gray-600">
        Exercices adaptés à votre profil pour prévenir les blessures
      </p>
      <div className="mt-4 flex items-center justify-center gap-2">
        <Badge variant="info">{exerciseCount} exercices recommandés</Badge>
      </div>
    </div>
  );
};
