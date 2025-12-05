import React from "react";
import type { WeeklyProgram } from "../../types/index.js";
import {
  calculateProgramStats,
  formatStatsForDisplay,
} from "../../services/programming/calculateStats";

interface ProgramComparisonProps {
  programA: WeeklyProgram;
  programB: WeeklyProgram;
  labelA?: string;
  labelB?: string;
}

export const ProgramComparison: React.FC<ProgramComparisonProps> = ({
  programA,
  programB,
  labelA = "Programme précédent",
  labelB = "Nouveau programme",
}) => {
  const statsA = formatStatsForDisplay(calculateProgramStats(programA));
  const statsB = formatStatsForDisplay(calculateProgramStats(programB));

  const comparisonItems = [
    {
      label: "Nombre d'exercices",
      valueA: statsA.totalExercises,
      valueB: statsB.totalExercises,
      unit: "",
    },
    {
      label: "Durée totale",
      valueA: statsA.totalDuration,
      valueB: statsB.totalDuration,
      unit: " min/semaine",
    },
    {
      label: "Jours par semaine",
      valueA: programA.daysPerWeek,
      valueB: programB.daysPerWeek,
      unit: " jours",
    },
    {
      label: "Niveau moyen",
      valueA: statsA.averageDifficulty,
      valueB: statsB.averageDifficulty,
      unit: "",
      format: (val: number) => val.toFixed(1),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Comparaison des programmes
      </h3>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-sm font-semibold text-gray-600 mb-2">{labelA}</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-semibold text-gray-600 mb-2">Différence</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-semibold text-gray-600 mb-2">{labelB}</div>
        </div>
      </div>

      <div className="space-y-4">
        {comparisonItems.map((item, index) => {
          const diff = item.valueB - item.valueA;
          const diffPercent = item.valueA > 0 ? ((diff / item.valueA) * 100).toFixed(0) : "0";
          const formatValue = item.format || ((val: number | string) => val.toString());

          return (
            <div
              key={index}
              className="grid grid-cols-3 gap-4 items-center p-3 bg-gray-50 rounded-lg"
            >
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {formatValue(item.valueA)}
                  {item.unit}
                </div>
              </div>
              <div className="text-center">
                <div
                  className={`text-sm font-semibold ${
                    diff > 0 ? "text-green-600" : diff < 0 ? "text-red-600" : "text-gray-600"
                  }`}
                >
                  {diff > 0 ? "+" : ""}
                  {formatValue(diff)}
                  {item.unit} ({diffPercent}%)
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-indigo-600">
                  {formatValue(item.valueB)}
                  {item.unit}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparaison des catégories */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Répartition par catégorie</h4>
        <div className="space-y-3">
          {Object.keys({ ...statsA.exercisesByCategory, ...statsB.exercisesByCategory }).map(
            (category) => {
              const countA = statsA.exercisesByCategory[category] || 0;
              const countB = statsB.exercisesByCategory[category] || 0;
              const diff = countB - countA;

              return (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm capitalize text-gray-700 w-32">
                    {category.replace(/_/g, " ")}
                  </span>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: `${Math.min((countA / Math.max(statsA.totalExercises, 1)) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <div className="text-xs text-gray-600 w-12 text-center">{countA}</div>
                  </div>
                  <div className="text-xs font-semibold text-gray-600 w-12 text-center">
                    {diff > 0 ? "+" : ""}
                    {diff}
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="text-xs text-gray-600 w-12 text-center">{countB}</div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{
                          width: `${Math.min((countB / Math.max(statsB.totalExercises, 1)) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};
