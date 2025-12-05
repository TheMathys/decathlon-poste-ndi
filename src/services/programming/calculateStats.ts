import type { WeeklyProgram, ProgramStats } from "../../types/index.js";

/**
 * Calcule les statistiques d'un programme hebdomadaire
 */
export function calculateProgramStats(
  program: WeeklyProgram
): ProgramStats & { daysPerWeek: number } {
  const stats: ProgramStats & { daysPerWeek: number } = {
    totalExercises: program.exercises.length,
    totalDuration: program.totalDuration,
    exercisesByCategory: {},
    exercisesByDay: {},
    averageDifficulty: 0,
    equipmentNeeded: [],
    daysPerWeek: program.daysPerWeek,
  };

  const difficultyMap = { debutant: 1, intermediaire: 2, avance: 3 };
  let totalDifficulty = 0;
  const equipmentSet = new Set<string>();

  program.exercises.forEach((exercise) => {
    // Catégories
    exercise.categories.forEach((cat) => {
      stats.exercisesByCategory[cat] = (stats.exercisesByCategory[cat] || 0) + 1;
    });

    // Jours
    stats.exercisesByDay[exercise.dayOfWeek] = (stats.exercisesByDay[exercise.dayOfWeek] || 0) + 1;

    // Difficulté moyenne
    totalDifficulty += difficultyMap[exercise.niveau];

    // Matériel
    exercise.materiel.forEach((mat) => equipmentSet.add(mat));
  });

  stats.averageDifficulty = totalDifficulty / program.exercises.length;
  stats.equipmentNeeded = Array.from(equipmentSet);

  return stats;
}

/**
 * Formate les statistiques pour l'affichage
 */
export function formatStatsForDisplay(stats: ProgramStats) {
  return {
    ...stats,
    formattedDuration: `${Math.floor(stats.totalDuration / 60)}h${stats.totalDuration % 60}min`,
    difficultyLabel:
      stats.averageDifficulty < 1.5
        ? "Débutant"
        : stats.averageDifficulty < 2.5
          ? "Intermédiaire"
          : "Avancé",
  };
}
