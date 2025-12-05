import type { SportProfile, ExtractedNeeds } from "../../types/index.js";

export function extractNeeds(profile: SportProfile): ExtractedNeeds {
  const douleurs = (profile.sante_contraintes?.douleurs_actuelles || []).filter(
    (d: string) => d !== "aucune"
  );
  const limitations = (profile.sante_contraintes?.limitations_mobilite || []).filter(
    (l: string) => l !== "aucune"
  );
  const materiel = (profile.materiel_disponible || []).filter((m: string) => m !== "aucun");
  const sports = (profile.habitudes?.sports_pratiques || []).filter((s: string) => s !== "aucun");
  const frequence = profile.habitudes?.frequence_par_semaine || "0";

  return {
    niveau: profile.identite?.niveau_de_base || null,
    age: profile.identite?.age || null,
    objectifs: profile.objectifs || [],
    douleurs,
    limitations,
    materiel,
    preferences: profile.preferences?.type_exercice_prefere || [],
    sports,
    frequence: frequence as "0" | "1" | "2_3" | "4_plus",
  };
}
