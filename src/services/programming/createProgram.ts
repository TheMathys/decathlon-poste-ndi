import type {
  ScoredExercise,
  SportProfile,
  WeeklyProgram,
  ProgrammedExercise,
  ExerciseSet,
  Niveau,
} from "../../types/index.js";

/**
 * Calcule les séries et répétitions selon le niveau et la fréquence
 */
function calculateSetsAndReps(
  exercise: ScoredExercise,
  niveau: Niveau,
  frequence: "0" | "1" | "2_3" | "4_plus",
  age: number | null
): ExerciseSet {
  const isIsometric =
    exercise.name.toLowerCase().includes("plank") ||
    exercise.name.toLowerCase().includes("wall sit") ||
    exercise.name.toLowerCase().includes("hollow") ||
    exercise.name.toLowerCase().includes("gainage");

  // Exercices isométriques (temps de maintien)
  if (isIsometric) {
    let duration = 30; // secondes par défaut
    if (niveau === "debutant") duration = 20;
    else if (niveau === "intermediaire") duration = 45;
    else if (niveau === "avance") duration = 60;

    // Ajustement selon l'âge
    if (age && age > 50) duration = Math.max(15, duration - 10);

    return {
      sets: frequence === "0" ? 2 : frequence === "1" ? 3 : 4,
      reps: `${duration}s`,
      restSeconds: 30,
    };
  }

  // Exercices dynamiques (répétitions)
  let sets = 2;
  let reps = 8;
  let rest = 45;

  if (niveau === "debutant") {
    sets = frequence === "0" ? 2 : 3;
    reps = 8;
    rest = 60;
  } else if (niveau === "intermediaire") {
    sets = frequence === "0" ? 3 : frequence === "1" ? 3 : 4;
    reps = 12;
    rest = 45;
  } else if (niveau === "avance") {
    sets = frequence === "0" ? 3 : frequence === "1" ? 4 : 5;
    reps = 15;
    rest = 30;
  }

  // Ajustement selon l'âge
  if (age && age > 50) {
    sets = Math.max(2, sets - 1);
    reps = Math.max(6, reps - 2);
    rest = rest + 15;
  }

  // Ajustement pour exercices cardio
  if (exercise.categories.includes("cardio")) {
    reps = 20;
    rest = 30;
  }

  return { sets, reps, restSeconds: rest };
}

/**
 * Répartit les exercices sur la semaine selon la fréquence
 */
function distributeExercises(
  exercises: ScoredExercise[],
  frequence: "0" | "1" | "2_3" | "4_plus"
): Map<number, ScoredExercise[]> {
  const distribution = new Map<number, ScoredExercise[]>();

  let daysPerWeek = 2;
  if (frequence === "1") daysPerWeek = 3;
  else if (frequence === "2_3") daysPerWeek = 4;
  else if (frequence === "4_plus") daysPerWeek = 5;

  // Répartition équilibrée
  const days: number[] = [];
  if (daysPerWeek >= 2) days.push(0, 3); // Lundi, Jeudi
  if (daysPerWeek >= 3) days.push(1); // Mardi
  if (daysPerWeek >= 4) days.push(4); // Vendredi
  if (daysPerWeek >= 5) days.push(2); // Mercredi

  exercises.forEach((exercise, index) => {
    const dayIndex = index % days.length;
    const day = days[dayIndex];

    if (!distribution.has(day)) {
      distribution.set(day, []);
    }
    distribution.get(day)!.push(exercise);
  });

  return distribution;
}

/**
 * Calcule la durée totale d'une séance en minutes
 */
function calculateSessionDuration(exercises: ProgrammedExercise[]): number {
  let totalSeconds = 0;

  exercises.forEach((exercise, index) => {
    const { sets, reps, restSeconds } = exercise.sets;

    // Temps d'exécution estimé par répétition (2 secondes pour dynamique, temps pour isométrique)
    const timePerRep =
      typeof exercise.sets.reps === "string" ? parseInt(exercise.sets.reps) || 30 : 2;

    const exerciseTime =
      sets * (typeof reps === "string" ? parseInt(reps) || 30 : reps * timePerRep);
    const restTime = (sets - 1) * restSeconds; // Pas de repos après la dernière série

    totalSeconds += exerciseTime + restTime;

    // Transition entre exercices (30 secondes sauf le dernier)
    if (index < exercises.length - 1) {
      totalSeconds += 30;
    }
  });

  // Échauffement (5 min) + retour au calme (3 min)
  totalSeconds += 480;

  return Math.ceil(totalSeconds / 60);
}

/**
 * Crée un programme hebdomadaire structuré à partir des exercices recommandés
 */
export function createWeeklyProgram(
  exercises: ScoredExercise[],
  profile: SportProfile
): WeeklyProgram {
  const niveau = profile.identite.niveau_de_base || "debutant";
  const frequence = profile.habitudes.frequence_par_semaine || "0";
  const age = profile.identite.age;

  const distribution = distributeExercises(exercises, frequence);
  const programmedExercises: ProgrammedExercise[] = [];

  distribution.forEach((dayExercises, dayOfWeek) => {
    dayExercises.forEach((exercise, order) => {
      const sets = calculateSetsAndReps(exercise, niveau, frequence, age);

      programmedExercises.push({
        ...exercise,
        sets,
        dayOfWeek,
        order,
      });
    });
  });

  // Calculer la durée totale
  const sessions = Array.from(distribution.values());
  const totalDuration = sessions.reduce((total, sessionExercises) => {
    const sessionProgrammed = sessionExercises.map((ex, order) => {
      const sets = calculateSetsAndReps(ex, niveau, frequence, age);
      return { ...ex, sets, dayOfWeek: 0, order };
    });
    return total + calculateSessionDuration(sessionProgrammed);
  }, 0);

  return {
    exercises: programmedExercises,
    totalDuration,
    daysPerWeek: distribution.size,
  };
}
