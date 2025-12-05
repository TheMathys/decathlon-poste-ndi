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

    if (dayExercises.length === 0) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
          <div className="max-w-2xl w-full bg-white rounded-xl shadow-xl p-8 text-center">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Aucun exercice pour ce jour</h2>
            <p className="text-gray-600 mb-6">
              Il n'y a pas d'exercices programmés pour ce jour. Veuillez sélectionner un autre jour.
            </p>
            <Button
              variant="primary"
              onClick={() => {
                setShowTraining(false);
                setSelectedDay(null);
              }}
              size="lg"
            >
              Retour au programme
            </Button>
          </div>
        </div>
      );
    }

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
