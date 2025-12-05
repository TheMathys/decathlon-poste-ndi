import type { ScoredExercise, SportProfile } from "../types/index.js";

export function exportProgramToJSON(
  suggestions: ScoredExercise[],
  profile: SportProfile | null
): string {
  const program = {
    profile,
    exercises: suggestions,
    generatedAt: new Date().toISOString(),
    version: "1.0",
  };

  return JSON.stringify(program, null, 2);
}

export function downloadProgramAsJSON(
  suggestions: ScoredExercise[],
  profile: SportProfile | null
): void {
  const json = exportProgramToJSON(suggestions, profile);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `programme-sportif-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function formatProgramAsText(
  suggestions: ScoredExercise[],
  profile: SportProfile | null
): string {
  const lines: string[] = [];

  lines.push("=".repeat(60));
  lines.push("PROGRAMME SPORTIF PERSONNALISÉ");
  lines.push("=".repeat(60));
  lines.push("");
  lines.push(
    `Généré le : ${new Date().toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}`
  );
  lines.push("");

  if (profile) {
    lines.push("VOTRE PROFIL");
    lines.push("-".repeat(60));
    if (profile.identite.niveau_de_base) {
      lines.push(`Niveau : ${profile.identite.niveau_de_base}`);
    }
    if (profile.identite.age) {
      lines.push(`Âge : ${profile.identite.age} ans`);
    }
    if (profile.objectifs.length > 0) {
      lines.push(`Objectifs : ${profile.objectifs.join(", ")}`);
    }
    lines.push("");
  }

  lines.push("EXERCICES RECOMMANDÉS");
  lines.push("-".repeat(60));
  lines.push("");

  suggestions.forEach((exercise, index) => {
    lines.push(`${index + 1}. ${exercise.name.toUpperCase()}`);
    lines.push(`   Niveau : ${exercise.niveau}`);
    lines.push(`   Score de pertinence : ${exercise.score}`);
    lines.push(`   Description : ${exercise.description}`);
    lines.push(
      `   Muscles sollicités : ${exercise.description.match(/Muscles sollicités[^.]*\./)?.[0] || "Non spécifié"}`
    );
    lines.push("");
  });

  lines.push("=".repeat(60));
  lines.push("Bon entraînement !");

  return lines.join("\n");
}

export function downloadProgramAsText(
  suggestions: ScoredExercise[],
  profile: SportProfile | null
): void {
  const text = formatProgramAsText(suggestions, profile);
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `programme-sportif-${new Date().toISOString().split("T")[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generateShareLink(
  suggestions: ScoredExercise[],
  profile: SportProfile | null
): string {
  const data = {
    profile,
    exerciseIds: suggestions.map((ex) => ex.id),
    timestamp: Date.now(),
  };

  const encoded = btoa(JSON.stringify(data));
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?share=${encoded}`;
}

export async function copyShareLinkToClipboard(
  suggestions: ScoredExercise[],
  profile: SportProfile | null
): Promise<boolean> {
  try {
    const link = generateShareLink(suggestions, profile);
    await navigator.clipboard.writeText(link);
    return true;
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error("Erreur lors de la copie:", err);
    }
    return false;
  }
}
