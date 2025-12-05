import React, { useState, useEffect, useCallback } from "react";
import type { ProgrammedExercise, TrainingSession as TrainingSessionType } from "../../types/index.js";
import { Button } from "../shared/ui/Button";

interface TrainingSessionProps {
  exercises: ProgrammedExercise[];
  onComplete: () => void;
  onCancel: () => void;
}

const COACH_MESSAGES = {
  warmup: ["Échauffez-vous bien !", "Préparez votre corps à l'effort", "Respirez profondément"],
  exercise: ["Allez-y !", "Vous pouvez le faire !", "Concentrez-vous sur la forme", "Excellent travail !"],
  rest: ["Reposez-vous bien", "Profitez de cette pause", "Respirez calmement", "Préparez-vous pour la suite"],
  completed: ["Félicitations !", "Vous avez terminé !", "Excellent travail aujourd'hui !"],
};

export const TrainingSession: React.FC<TrainingSessionProps> = ({ exercises, onComplete, onCancel }) => {
  const [session, setSession] = useState<TrainingSessionType>({
    currentExerciseIndex: 0,
    currentSet: 1,
    state: "warmup",
    timeRemaining: 300, // 5 minutes d'échauffement
    totalTime: 0,
    completedExercises: [],
  });

  const [isPaused, setIsPaused] = useState(false);
  const [coachMessage, setCoachMessage] = useState("Prêt à commencer ?");

  const currentExercise = exercises[session.currentExerciseIndex];

  const handleTimeUp = useCallback((prev: TrainingSessionType): TrainingSessionType => {
    if (prev.state === "warmup") {
      // Passer au premier exercice
      const firstExercise = exercises[0];
      if (!firstExercise) return prev;
      
      const reps = firstExercise.sets.reps;
      const timeForReps = typeof reps === "string" ? parseInt(reps) || 30 : reps * 2;
      
      setCoachMessage(COACH_MESSAGES.exercise[Math.floor(Math.random() * COACH_MESSAGES.exercise.length)]);
      
      return {
        ...prev,
        state: "exercise",
        currentExerciseIndex: 0,
        currentSet: 1,
        timeRemaining: timeForReps,
      };
    } else if (prev.state === "exercise") {
      const currentEx = exercises[prev.currentExerciseIndex];
      if (!currentEx) return prev;
      
      const isLastSetForCurrent = prev.currentSet >= currentEx.sets.sets;
      const isLastExerciseForCurrent = prev.currentExerciseIndex >= exercises.length - 1;
      
      // Passer au repos ou à la série suivante
      if (isLastSetForCurrent && isLastExerciseForCurrent) {
        // Dernier exercice terminé
        setCoachMessage(COACH_MESSAGES.completed[Math.floor(Math.random() * COACH_MESSAGES.completed.length)]);
        return {
          ...prev,
          state: "completed",
          timeRemaining: 0,
          completedExercises: [...prev.completedExercises, currentEx.id],
        };
      } else if (isLastSetForCurrent) {
        // Passer à l'exercice suivant
        const nextExercise = exercises[prev.currentExerciseIndex + 1];
        if (!nextExercise) return prev;
        
        const reps = nextExercise.sets.reps;
        const timeForReps = typeof reps === "string" ? parseInt(reps) || 30 : reps * 2;
        
        setCoachMessage(COACH_MESSAGES.exercise[Math.floor(Math.random() * COACH_MESSAGES.exercise.length)]);
        
        return {
          ...prev,
          currentExerciseIndex: prev.currentExerciseIndex + 1,
          currentSet: 1,
          timeRemaining: timeForReps,
          completedExercises: [...prev.completedExercises, currentEx.id],
        };
      } else {
        // Repos entre séries
        setCoachMessage(COACH_MESSAGES.rest[Math.floor(Math.random() * COACH_MESSAGES.rest.length)]);
        return {
          ...prev,
          state: "rest",
          currentSet: prev.currentSet + 1,
          timeRemaining: currentEx.sets.restSeconds,
        };
      }
    } else if (prev.state === "rest") {
      // Reprendre l'exercice
      const currentEx = exercises[prev.currentExerciseIndex];
      if (!currentEx) return prev;
      
      const reps = currentEx.sets.reps;
      const timeForReps = typeof reps === "string" ? parseInt(reps) || 30 : reps * 2;
      
      setCoachMessage(COACH_MESSAGES.exercise[Math.floor(Math.random() * COACH_MESSAGES.exercise.length)]);
      
      return {
        ...prev,
        state: "exercise",
        timeRemaining: timeForReps,
      };
    }

    return prev;
  }, [exercises]);

  useEffect(() => {
    if (isPaused || session.state === "completed") return;

    const interval = setInterval(() => {
      setSession((prev) => {
        if (prev.timeRemaining <= 1) {
          return handleTimeUp(prev);
        }
        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
          totalTime: prev.totalTime + 1,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, session.state, handleTimeUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSkip = () => {
    setSession((prev) => handleTimeUp(prev));
  };

  if (session.state === "completed") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-4">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-xl p-8 text-center">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{coachMessage}</h2>
          <p className="text-gray-600 mb-6">
            Vous avez terminé tous les exercices en {formatTime(session.totalTime)} !
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="primary" onClick={onComplete} size="lg">
              Retour au programme
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Session d'entraînement</h2>
            <Button variant="gray" onClick={onCancel} size="sm">
              Quitter
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-sm text-gray-600 mb-1">Progression</div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
                  style={{
                    width: `${((session.currentExerciseIndex * currentExercise?.sets.sets + session.currentSet) / (exercises.length * (currentExercise?.sets.sets || 1))) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {session.currentExerciseIndex + 1} / {exercises.length}
              </div>
              <div className="text-sm text-gray-600">Exercices</div>
            </div>
          </div>
        </div>

        {/* Timer principal */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-6 text-center">
          <div className="mb-4">
            <div className="text-6xl font-bold text-gray-900 mb-2">
              {formatTime(session.timeRemaining)}
            </div>
            <div className="text-lg text-gray-600 capitalize">{session.state}</div>
          </div>

          {currentExercise && (
            <div className="mt-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{currentExercise.name}</h3>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div>
                  <div className="text-3xl font-bold text-blue-600">{session.currentSet}</div>
                  <div className="text-sm text-gray-600">Série</div>
                </div>
                <div className="w-px h-12 bg-gray-300" />
                <div>
                  <div className="text-3xl font-bold text-green-600">
                    {typeof currentExercise.sets.reps === "string"
                      ? currentExercise.sets.reps
                      : currentExercise.sets.reps}
                  </div>
                  <div className="text-sm text-gray-600">Répétitions</div>
                </div>
              </div>
            </div>
          )}

          {/* Message du coach */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-lg font-semibold text-blue-900">{coachMessage}</p>
          </div>
        </div>

        {/* Contrôles */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex gap-4 justify-center">
            <Button
              variant={isPaused ? "primary" : "gray"}
              onClick={() => setIsPaused(!isPaused)}
              size="lg"
            >
              {isPaused ? "Reprendre" : "Pause"}
            </Button>
            <Button variant="primary" onClick={handleSkip} size="lg">
              Passer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
