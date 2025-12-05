import React from "react";
import type { ProgrammedExercise } from "../../types/index.js";

interface ProgrammedExerciseCardProps {
  exercise: ProgrammedExercise;
}

export const ProgrammedExerciseCard: React.FC<ProgrammedExerciseCardProps> = ({ exercise }) => {
  const { sets, reps, restSeconds } = exercise.sets;
  const isIsometric = typeof reps === "string";

  return (
    <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h4 className="font-bold text-lg text-gray-900 mb-1">{exercise.name}</h4>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {exercise.description.split(".")[0]}.
          </p>

          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span className="text-sm font-semibold text-gray-700">
                {sets} série{sets > 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <span className="text-sm font-semibold text-gray-700">
                {isIsometric ? reps : `${reps} rép${reps > 1 ? "s" : ""}`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-semibold text-gray-700">{restSeconds}s repos</span>
            </div>
          </div>
        </div>

        <div className="px-3 py-1 bg-blue-100 rounded-full">
          <span className="text-xs font-semibold text-blue-800 uppercase">{exercise.niveau}</span>
        </div>
      </div>
    </div>
  );
};
