import { weights } from "../../data/weights.js";
import type { Exercise, ExtractedNeeds } from "../../types/index.js";

const sportToCategoryMap: Record<string, string[]> = {
  musculation: ["renforcement_musculaire", "poids_du_corps"],
  course: ["cardio", "endurance"],
  velo: ["cardio", "endurance"],
  yoga_pilates: ["yoga_mobilite", "mobilite"],
  sports_collectifs: ["cardio", "cross_training", "renforcement_musculaire"],
  natation: ["cardio", "endurance"],
};

export function scoreExercise(ex: Exercise, needs: ExtractedNeeds): number {
  let score = 0;

  if (needs.objectifs?.length > 0) {
    const matchCount = needs.objectifs.filter((o: string) =>
      ex.objectifs_cibles.includes(o)
    ).length;
    const matchRatio = matchCount / needs.objectifs.length;
    score += matchCount * weights.objectifs + matchRatio * weights.objectifs * 0.5;
  }

  if (needs.niveau === ex.niveau) {
    score += weights.niveau;
  } else {
    const niveauOrder = { debutant: 1, intermediaire: 2, avance: 3 };
    const userNiveau = niveauOrder[needs.niveau as keyof typeof niveauOrder] || 2;
    const exNiveau = niveauOrder[ex.niveau as keyof typeof niveauOrder] || 2;
    const diff = Math.abs(userNiveau - exNiveau);
    if (diff === 1) {
      score += weights.niveau * 0.3;
    }
  }

  if (ex.materiel.length === 0) {
    score += weights.materiel;
  } else {
    const materielMap: Record<string, string> = {
      barre_de_traction: "barre",
      barre: "barre",
    };

    const mappedMateriel = needs.materiel.map((m: string) => materielMap[m] || m);
    const materielMatch = ex.materiel.filter((m: string) => mappedMateriel.includes(m)).length;
    const materielRatio = materielMatch / ex.materiel.length;
    if (materielRatio === 1) {
      score += weights.materiel;
    } else if (materielRatio >= 0.5) {
      score += weights.materiel * 0.5;
    }
  }

  if (needs.preferences?.length > 0) {
    const matchCount = needs.preferences.filter((p: string) => ex.categories.includes(p)).length;
    score += matchCount * weights.preferences;
  }

  if (needs.sports?.length > 0) {
    const relevantCategories = needs.sports.flatMap(
      (sport: string) => sportToCategoryMap[sport] || []
    );
    const uniqueCategories = [...new Set(relevantCategories)];
    const matchCount = uniqueCategories.filter((cat: string) => ex.categories.includes(cat)).length;
    if (matchCount > 0) {
      score += matchCount * 1.5;
    }
  }

  if (needs.frequence === "0" || needs.frequence === "1") {
    if (ex.niveau === "debutant") {
      score += 2;
    }
  } else if (needs.frequence === "4_plus") {
    if (ex.niveau === "intermediaire" || ex.niveau === "avance") {
      score += 1.5;
    }
  }

  if (needs.age && needs.age > 50) {
    if (ex.categories.includes("yoga_mobilite") || ex.niveau === "debutant") {
      score += 1;
    }
    if (ex.categories.includes("cardio") && ex.niveau === "avance") {
      score -= 1;
    }
  }

  return Math.max(0, score);
}
