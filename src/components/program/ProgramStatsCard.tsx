import React from "react";
import { formatStatsForDisplay } from "../../services/programming/calculateStats";
import type { WeeklyProgram } from "../../types/index.js";

interface ProgramStatsCardProps {
  stats: ReturnType<typeof formatStatsForDisplay>;
  program: WeeklyProgram;
}

export const ProgramStatsCard: React.FC<ProgramStatsCardProps> = ({ stats, program }) => {
  const categoryEntries = Object.entries(stats.exercisesByCategory).slice(0, 5);

  return (
    <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl shadow-xl p-6 text-white">
      <h2 className="text-2xl font-bold mb-6">Statistiques de votre programme</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="text-3xl font-bold mb-1">{stats.totalExercises}</div>
          <div className="text-sm text-blue-100">Exercices</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="text-3xl font-bold mb-1">{stats.totalDuration}</div>
          <div className="text-sm text-blue-100">Minutes/semaine</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="text-3xl font-bold mb-1">{program.daysPerWeek}</div>
          <div className="text-sm text-blue-100">Jours/semaine</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="text-lg font-bold mb-1">{stats.difficultyLabel}</div>
          <div className="text-sm text-blue-100">Niveau moyen</div>
        </div>
      </div>

      {categoryEntries.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide">
            Répartition par catégorie
          </h3>
          <div className="space-y-2">
            {categoryEntries.map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm capitalize">{category.replace(/_/g, " ")}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all"
                      style={{ width: `${(count / stats.totalExercises) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
