import React, { useMemo } from "react";
import type { Exercise, SportProfile } from "../../types/index.js";
import { DEFAULT_AGE, DEFAULT_NIVEAU, DEFAULT_FREQUENCE } from "../../config/constants";

interface PersonalizedInstructionsProps {
  exercise: Exercise;
  profile: SportProfile | null;
  exerciseId: string;
}

export const PersonalizedInstructions: React.FC<PersonalizedInstructionsProps> = ({
  exercise,
  profile,
  exerciseId,
}) => {
  const instructions = useMemo(() => {
    const instructionList: string[] = [];
    const niveau = profile?.identite?.niveau_de_base || DEFAULT_NIVEAU;
    const age = profile?.identite?.age || DEFAULT_AGE;
    const frequence = profile?.habitudes?.frequence_par_semaine || DEFAULT_FREQUENCE;
    const douleurs = profile?.sante_contraintes?.douleurs_actuelles || [];

    instructionList.push("Instructions de base :");
    instructionList.push(`- ${exercise.description}`);

    if (niveau === "debutant") {
      instructionList.push("\nAdaptations pour débutant :");
      instructionList.push("- Commencez par 3 séries de 5-8 répétitions");
      instructionList.push("- Prenez 60-90 secondes de repos entre les séries");
      instructionList.push("- Concentrez-vous sur la forme plutôt que sur l'intensité");
    } else if (niveau === "intermediaire") {
      instructionList.push("\nAdaptations pour niveau intermédiaire :");
      instructionList.push("- Effectuez 3-4 séries de 10-15 répétitions");
      instructionList.push("- Repos de 45-60 secondes entre les séries");
      instructionList.push("- Vous pouvez augmenter progressivement l'intensité");
    } else {
      instructionList.push("\nAdaptations pour niveau avancé :");
      instructionList.push("- Effectuez 4-5 séries de 15-20 répétitions");
      instructionList.push("- Repos de 30-45 secondes entre les séries");
      instructionList.push("- Ajoutez des variations pour augmenter la difficulté");
    }

    if (age > 50) {
      instructionList.push("\nAdaptations pour votre âge :");
      instructionList.push("- Échauffez-vous 10-15 minutes avant l'exercice");
      instructionList.push("- Écoutez votre corps et ne forcez pas");
      instructionList.push("- Hydratez-vous régulièrement");
    }

    if (frequence === "0" || frequence === "1") {
      instructionList.push("\nPour débuter :");
      instructionList.push("- Commencez par 2-3 séances par semaine");
      instructionList.push("- Laissez au moins un jour de repos entre les séances");
      instructionList.push("- Augmentez progressivement la fréquence");
    }

    if (douleurs.length > 0) {
      instructionList.push("\nPrécautions importantes :");
      if (exercise.contre_indications.some((ci) => douleurs.includes(ci))) {
        instructionList.push("- ATTENTION : Cet exercice peut aggraver vos douleurs actuelles");
        instructionList.push("- Consultez un professionnel de santé avant de pratiquer");
        instructionList.push("- Commencez très progressivement et arrêtez si la douleur augmente");
      } else {
        instructionList.push("- Écoutez votre corps et arrêtez si vous ressentez de la douleur");
        instructionList.push("- Modifiez l'amplitude du mouvement si nécessaire");
      }
    }

    instructionList.push("\nRespiration :");
    if (exercise.description.includes("Inspirez")) {
      const match = exercise.description.match(/Inspirez[^.]*\./);
      if (match) {
        instructionList.push(`- ${match[0]}`);
      }
    } else {
      instructionList.push("- Inspirez lors de la phase de préparation");
      instructionList.push("- Expirez lors de l'effort principal");
      instructionList.push("- Ne retenez jamais votre souffle");
    }

    instructionList.push("\nProgression :");
    instructionList.push("- Semaine 1-2 : Maîtrisez la technique de base");
    instructionList.push("- Semaine 3-4 : Augmentez le nombre de répétitions");
    instructionList.push("- Semaine 5+ : Ajoutez des variations ou augmentez l'intensité");

    return instructionList.join("\n");
  }, [exercise, profile]);

  return (
    <div
      className="mt-4 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border-2 border-blue-200"
      role="region"
      aria-labelledby={`instructions-title-${exerciseId}`}
    >
      <h4
        id={`instructions-title-${exerciseId}`}
        className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
      >
        <span>Instructions personnalisées pour vous</span>
      </h4>
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">
          {instructions}
        </pre>
      </div>
    </div>
  );
};

