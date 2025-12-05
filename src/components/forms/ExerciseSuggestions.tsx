import React, { useState, useMemo } from "react";
import ExerciseCard from "../exercises/ExerciseCard";
import type { ScoredExercise, SportProfile } from "../../types/index.js";
import { Button } from "../shared/ui/Button";
import { ProgramHeader } from "./ProgramHeader";
import { ExportButtons } from "./ExportButtons";
import { WeeklyProgramView } from "../program/WeeklyProgramView";
import { TrainingSession } from "../training/TrainingSession";
import { DaySelector } from "../training/DaySelector";
import { createWeeklyProgram } from "../../services/programming/createProgram";

interface ExerciseSuggestionsProps {
  suggestions: ScoredExercise[];
  onBack: () => void;
  profile: SportProfile | null;
}

type ViewMode = "list" | "program" | "training";

const ExerciseSuggestions: React.FC<ExerciseSuggestionsProps> = ({
  suggestions,
  onBack,
  profile,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [showTraining, setShowTraining] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const weeklyProgram = useMemo(() => {
    if (!profile) return null;
    return createWeeklyProgram(suggestions, profile);
  }, [suggestions, profile]);

  const backIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 19l-7-7m0 0l7-7m-7 7h18"
      />
    </svg>
  );

  if (showTraining && weeklyProgram && selectedDay !== null) {
    // Filtrer les exercices du jour sélectionné
    const dayExercises = weeklyProgram.exercises
      .filter((ex) => ex.dayOfWeek === selectedDay)
      .sort((a, b) => a.order - b.order);

    return (
      <TrainingSession
        exercises={dayExercises}
        onComplete={() => {
          setShowTraining(false);
          setSelectedDay(null);
        }}
        onCancel={() => {
          setShowTraining(false);
          setSelectedDay(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <ProgramHeader exerciseCount={suggestions.length} />
        
        {/* Onglets de navigation */}
        <div className="mb-6 bg-white rounded-lg shadow-md p-1 flex gap-2">
          <button
            onClick={() => setViewMode("list")}
            className={`flex-1 px-4 py-2 rounded-md font-semibold transition-all ${
              viewMode === "list"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Liste
          </button>
          <button
            onClick={() => setViewMode("program")}
            className={`flex-1 px-4 py-2 rounded-md font-semibold transition-all ${
              viewMode === "program"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Programme hebdomadaire
          </button>
        </div>

        <ExportButtons suggestions={suggestions} profile={profile} />

        {/* Sélecteur de jour et session d'entraînement */}
        {weeklyProgram && viewMode === "program" && (
          <div className="mb-6">
            <DaySelector
              program={weeklyProgram}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
              onStartTraining={() => {
                if (selectedDay !== null) {
                  setShowTraining(true);
                }
              }}
            />
          </div>
        )}

        {/* Contenu selon le mode */}
        {viewMode === "list" && (
          <div className="space-y-6 mb-8">
            {suggestions.map((exercise, index) => (
              <ExerciseCard
                key={exercise.id || index}
                exercise={exercise}
                profile={profile}
                index={index}
              />
            ))}
          </div>
        )}

        {viewMode === "program" && weeklyProgram && (
          <div className="mb-8">
            <WeeklyProgramView
              program={weeklyProgram}
              onStartTrainingForDay={(dayOfWeek) => {
                setSelectedDay(dayOfWeek);
                setShowTraining(true);
              }}
            />
          </div>
        )}

        <div className="text-center">
          <Button
            variant="gray"
            size="lg"
            onClick={onBack}
            icon={backIcon}
            className="mx-auto"
            aria-label="Retour au formulaire pour modifier le profil"
          >
            Modifier mon profil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseSuggestions;
