import { extractNeeds } from "./extractNeeds.js";
import { hasContraIndication } from "./filters.js";
import { scoreExercise } from "./scoring.js";
import type { SportProfile, Exercise, ScoredExercise } from "../../types/index.js";

export function recommendExercises(
  profile: SportProfile,
  exercisesDatabase: Exercise[]
): ScoredExercise[] {
  const needs = extractNeeds(profile);

  const scored: ScoredExercise[] = exercisesDatabase
    .map((ex): ScoredExercise => {
      if (hasContraIndication(ex, needs.douleurs, needs.limitations)) {
        return { ...ex, score: -9999 };
      }

      return {
        ...ex,
        score: scoreExercise(ex, needs),
      };
    })
    .filter((ex) => ex.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, 5);
}
