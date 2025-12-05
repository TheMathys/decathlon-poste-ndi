import React from "react";
import DecathlonProducts from "./DecathlonProducts";
import type { Exercise, SportProfile } from "../../types/index.js";
import { ExpandableSection } from "../shared/ui/ExpandableSection";
import { ExerciseHeader } from "./ExerciseHeader";
import { PersonalizedInstructions } from "./PersonalizedInstructions";

interface ExerciseCardProps {
  exercise: Exercise;
  profile: SportProfile | null;
  index: number;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, profile, index }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <ExerciseHeader exercise={exercise} index={index} />

      <div className="p-6">
        <p className="text-gray-700 leading-relaxed mb-4">{exercise.description}</p>

        {exercise.description.includes("Muscles sollicités") && (
          <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-sm font-semibold text-orange-900 mb-1">Muscles sollicités :</p>
            <p className="text-sm text-orange-800">
              {exercise.description.match(/Muscles sollicités[^.]*\./)?.[0] || ""}
            </p>
          </div>
        )}

        <ExpandableSection
          id={`instructions-${exercise.id}`}
          buttonLabel={{
            expanded: "Masquer les instructions détaillées",
            collapsed: "Voir les instructions personnalisées",
          }}
          className="mt-4"
          ariaLabel={"Afficher ou masquer les instructions personnalisées pour cet exercice"}
        >
          <PersonalizedInstructions
            exercise={exercise}
            profile={profile}
            exerciseId={exercise.id}
          />
        </ExpandableSection>

        <div className="mt-6">
          <DecathlonProducts exercise={exercise} />
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;
