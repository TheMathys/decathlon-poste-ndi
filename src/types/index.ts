export type QuestionType = "single_choice" | "multiple_choice" | "number" | "text" | "boolean";

export interface QuestionOption {
  label: string;
  value: string;
}

export interface Question {
  id: string;
  question: string;
  type: QuestionType;
  options?: QuestionOption[];
  store_as: string;
  required: boolean;
  min?: number;
  max?: number;
  placeholder?: string;
  show_if?: {
    question: string;
    contains: string;
  };
}

export interface QCMData {
  qcm: Question[];
}

export interface Identite {
  niveau_de_base: "debutant" | "intermediaire" | "avance" | null;
  age: number | null;
}

export interface Habitudes {
  frequence_par_semaine: "0" | "1" | "2_3" | "4_plus" | null;
  sports_pratiques: string[];
}

export interface SanteContraintes {
  douleurs_actuelles: string[];
  limitations_mobilite: string[];
}

export interface Preferences {
  type_exercice_prefere: string[];
}

export interface ConsentementLegal {
  acceptance_disclaimer: boolean;
}

export interface SportProfile {
  identite: Identite;
  habitudes: Habitudes;
  objectifs: string[];
  sante_contraintes: SanteContraintes;
  materiel_disponible: string[];
  preferences: Preferences;
  consentement_legal: ConsentementLegal;
}

export type Niveau = "debutant" | "intermediaire" | "avance";

export interface Exercise {
  id: string;
  name: string;
  categories: string[];
  objectifs_cibles: string[];
  materiel: string[];
  niveau: Niveau;
  contre_indications: string[];
  description: string;
}

export interface ScoredExercise extends Exercise {
  score: number;
}

export interface ExtractedNeeds {
  niveau: "debutant" | "intermediaire" | "avance" | null;
  age: number | null;
  objectifs: string[];
  douleurs: string[];
  limitations: string[];
  materiel: string[];
  preferences: string[];
  sports: string[];
  frequence: "0" | "1" | "2_3" | "4_plus";
}

export interface DecathlonProduct {
  id: string;
  name: string;
  price: string;
  image: string;
  link: string;
  category: string;
  description?: string;
  productId: string;
  exerciseCategories?: string[];
  exerciseIds?: string[];
}

export interface BasketItem {
  id: string;
  quantity: number;
}

export interface DecathlonBasket {
  externalWebsite: string;
  items: BasketItem[];
}

// Programme structuré avec séries et répétitions
export interface ExerciseSet {
  sets: number;
  reps: number | string; // peut être "30s" pour les exercices isométriques
  restSeconds: number;
}

export interface ProgrammedExercise extends ScoredExercise {
  sets: ExerciseSet;
  dayOfWeek: number; // 0 = lundi, 6 = dimanche
  order: number; // ordre dans la séance
}

export interface WeeklyProgram {
  exercises: ProgrammedExercise[];
  totalDuration: number; // en minutes
  daysPerWeek: number;
}

// Statistiques du programme
export interface ProgramStats {
  totalExercises: number;
  totalDuration: number;
  exercisesByCategory: Record<string, number>;
  exercisesByDay: Record<number, number>;
  averageDifficulty: number;
  equipmentNeeded: string[];
}

// Session d'entraînement en cours
export type SessionState = "idle" | "warmup" | "exercise" | "rest" | "completed";

export interface TrainingSession {
  currentExerciseIndex: number;
  currentSet: number;
  state: SessionState;
  timeRemaining: number; // en secondes
  totalTime: number;
  completedExercises: string[];
}
