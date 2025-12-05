import React from "react";
import type { WeeklyProgram } from "../../types/index.js";

interface DaySelectorProps {
  program: WeeklyProgram;
  selectedDay: number | null;
  onSelectDay: (day: number) => void;
  onStartTraining: () => void;
}

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export const DaySelector: React.FC<DaySelectorProps> = ({
  program,
  selectedDay,
  onSelectDay,
  onStartTraining,
}) => {
  // Grouper les exercices par jour
  const exercisesByDay = React.useMemo(() => {
    const grouped = new Map<number, typeof program.exercises>();

    program.exercises.forEach((exercise) => {
      if (!grouped.has(exercise.dayOfWeek)) {
        grouped.set(exercise.dayOfWeek, []);
      }
      grouped.get(exercise.dayOfWeek)!.push(exercise);
    });

    return grouped;
  }, [program]);

  const getCurrentDayOfWeek = () => {
    const today = new Date().getDay();
    // Convertir dimanche (0) à 6, lundi (1) à 0, etc.
    return today === 0 ? 6 : today - 1;
  };

  const currentDay = getCurrentDayOfWeek();
  const selectedDayExercises = selectedDay !== null ? exercisesByDay.get(selectedDay) || [] : [];

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 border-2 border-blue-200">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Session d'entraînement guidée</h3>
        <p className="text-gray-600">
          Choisissez un jour pour commencer votre séance d'entraînement personnalisée
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {Array.from(exercisesByDay.entries())
          .sort(([dayA], [dayB]) => dayA - dayB)
          .map(([dayOfWeek, exercises]) => {
            const isToday = dayOfWeek === currentDay;
            const isSelected = selectedDay === dayOfWeek;
            const exerciseCount = exercises.length;
            const hasExercises = exerciseCount > 0;

            return (
              <button
                key={dayOfWeek}
                onClick={() => hasExercises && onSelectDay(dayOfWeek)}
                disabled={!hasExercises}
                className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                  !hasExercises
                    ? "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                    : isSelected
                      ? "border-blue-600 bg-blue-50 shadow-md scale-105"
                      : isToday
                        ? "border-orange-300 bg-orange-50 hover:border-orange-400"
                        : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                {isToday && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Aujourd'hui
                  </span>
                )}
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-600 mb-1">{DAYS[dayOfWeek]}</div>
                  <div
                    className={`text-2xl font-bold mb-1 ${hasExercises ? "text-gray-900" : "text-gray-400"}`}
                  >
                    {exerciseCount}
                  </div>
                  <div className={`text-xs ${hasExercises ? "text-gray-500" : "text-gray-400"}`}>
                    {hasExercises ? `exercice${exerciseCount > 1 ? "s" : ""}` : "Aucun exercice"}
                  </div>
                </div>
              </button>
            );
          })}
      </div>

      {selectedDay !== null && selectedDayExercises.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-blue-900">Programme du {DAYS[selectedDay]}</h4>
            <span className="text-sm text-blue-700 bg-blue-100 px-3 py-1 rounded-full font-semibold">
              {selectedDayExercises.length} exercice{selectedDayExercises.length > 1 ? "s" : ""}
            </span>
          </div>
          <div className="space-y-2">
            {selectedDayExercises.map((exercise, index) => (
              <div key={exercise.id} className="flex items-center gap-2 text-sm text-blue-800">
                <span className="font-bold text-blue-600">{index + 1}.</span>
                <span>{exercise.name}</span>
                <span className="text-blue-600">
                  ({exercise.sets.sets} série{exercise.sets.sets > 1 ? "s" : ""} ×{" "}
                  {typeof exercise.sets.reps === "string"
                    ? exercise.sets.reps
                    : `${exercise.sets.reps} rép${exercise.sets.reps > 1 ? "s" : ""}`}
                  )
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onStartTraining}
        disabled={selectedDay === null || selectedDayExercises.length === 0}
        className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all duration-200 ${
          selectedDay !== null && selectedDayExercises.length > 0
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        {selectedDay !== null && selectedDayExercises.length > 0 ? (
          <>
            <span className="mr-2">🏋️</span>
            Démarrer l'entraînement du {DAYS[selectedDay]}
          </>
        ) : (
          "Sélectionnez un jour pour commencer"
        )}
      </button>
    </div>
  );
};
