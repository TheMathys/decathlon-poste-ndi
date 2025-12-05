import React, { useMemo } from "react";
import type { WeeklyProgram } from "../../types/index.js";
import { ProgrammedExerciseCard } from "./ProgrammedExerciseCard";
import { ProgramStatsCard } from "./ProgramStatsCard";
import {
  calculateProgramStats,
  formatStatsForDisplay,
} from "../../services/programming/calculateStats";
import { Button } from "../shared/ui/Button";

interface WeeklyProgramViewProps {
  program: WeeklyProgram;
  onStartTrainingForDay?: (dayOfWeek: number) => void;
}

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export const WeeklyProgramView: React.FC<WeeklyProgramViewProps> = ({
  program,
  onStartTrainingForDay,
}) => {
  const stats = useMemo(() => formatStatsForDisplay(calculateProgramStats(program)), [program]);

  // Grouper les exercices par jour
  const exercisesByDay = useMemo(() => {
    const grouped = new Map<number, typeof program.exercises>();

    program.exercises.forEach((exercise) => {
      if (!grouped.has(exercise.dayOfWeek)) {
        grouped.set(exercise.dayOfWeek, []);
      }
      grouped.get(exercise.dayOfWeek)!.push(exercise);
    });

    // Trier par ordre dans chaque jour
    grouped.forEach((exercises) => {
      exercises.sort((a, b) => a.order - b.order);
    });

    return grouped;
  }, [program]);

  return (
    <div className="space-y-8">
      <ProgramStatsCard stats={stats} program={program} />

      <div className="space-y-6">
        {Array.from(exercisesByDay.entries())
          .sort(([dayA], [dayB]) => dayA - dayB)
          .map(([dayOfWeek, exercises]) => (
            <div
              key={dayOfWeek}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-blue-200">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  {dayOfWeek + 1}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{DAYS[dayOfWeek]}</h3>
                  <p className="text-sm text-gray-600">
                    {exercises.length} exercice{exercises.length > 1 ? "s" : ""} • ~
                    {Math.ceil(
                      exercises.reduce((total, ex) => {
                        const { sets, reps, restSeconds } = ex.sets;
                        const repsNum = typeof reps === "string" ? parseInt(reps) || 0 : reps;
                        const timePerRep = typeof reps === "string" ? parseInt(reps) || 30 : 2;
                        const exerciseTime =
                          sets *
                          (typeof reps === "string" ? parseInt(reps) || 30 : repsNum * timePerRep);
                        const restTime = (sets - 1) * restSeconds;
                        return total + exerciseTime + restTime;
                      }, 480) / 60
                    )}{" "}
                    min
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {exercises.map((exercise) => (
                  <ProgrammedExerciseCard key={exercise.id} exercise={exercise} />
                ))}
              </div>

              {onStartTrainingForDay && exercises.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => onStartTrainingForDay(dayOfWeek)}
                    className="w-full"
                    icon={
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
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
                    }
                  >
                    Démarrer l'entraînement du {DAYS[dayOfWeek]}
                  </Button>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};
