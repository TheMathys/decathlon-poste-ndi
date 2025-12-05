import { useState, useEffect, lazy, Suspense } from "react";
import "./App.css";

import { recommendExercises } from "./services/recommendations/recommend.ts";
import exercisesData from "./data/exercices.json";
import Formulaire from "./components/forms/Formulaire.tsx";
import type { SportProfile, ScoredExercise, Exercise } from "./types/index.js";
import { ErrorBoundary } from "./components/shared/ErrorBoundary";
import { APP_CONFIG } from "./config/constants";

const ExerciseSuggestions = lazy(() => import("./components/forms/ExerciseSuggestions.tsx"));

const exercises = exercisesData as Exercise[];

type AppStep = "form" | "loading" | "suggestions" | "error";

function App() {
  const [step, setStep] = useState<AppStep>("form");
  const [suggestions, setSuggestions] = useState<ScoredExercise[]>([]);
  const [profile, setProfile] = useState<SportProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const shareData = urlParams.get("share");

    if (shareData) {
      try {
        const decoded = atob(shareData);
        const data = JSON.parse(decoded);

        if (
          data &&
          typeof data === "object" &&
          Array.isArray(data.exerciseIds) &&
          data.exerciseIds.length > 0 &&
          data.profile
        ) {
          const restoredExercises: ScoredExercise[] = data.exerciseIds
            .filter((id: unknown): id is string => typeof id === "string")
            .map((id: string) => exercises.find((ex: Exercise) => ex.id === id))
            .filter((ex: Exercise | undefined): ex is Exercise => ex !== undefined)
            .map((ex: Exercise) => ({ ...ex, score: 0 }) as ScoredExercise);

          if (restoredExercises.length > 0) {
            setProfile(data.profile as SportProfile);
            setSuggestions(restoredExercises);
            setStep("suggestions");
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.warn("Impossible de restaurer depuis le lien de partage:", err);
        }
      }
    }
  }, []);

  const handleFormSubmit = async (profileData: SportProfile) => {
    try {
      setError(null);
      setStep("loading");

      await new Promise((resolve) => setTimeout(resolve, APP_CONFIG.LOADING_DELAY_MS));

      const recommended = recommendExercises(profileData, exercises);

      if (recommended.length === 0) {
        setError(
          "Aucun exercice ne correspond à votre profil. Essayez de modifier vos réponses pour obtenir des recommandations."
        );
        setStep("error");
        return;
      }

      setSuggestions(recommended);
      setProfile(profileData);
      setStep("suggestions");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la génération de votre programme.";
      setError(errorMessage);
      setStep("error");
    }
  };

  const handleBack = () => {
    setStep("form");
    setError(null);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {step === "form" && (
          <div className="py-8 px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  CTO de Votre Santé Posturale
                </h1>
                <p className="text-lg text-gray-600">
                  Répondez au questionnaire pour recevoir des exercices personnalisés
                </p>
              </div>
              <Formulaire onSubmit={handleFormSubmit} />
            </div>
          </div>
        )}

        {step === "loading" && (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Génération de votre programme...
              </h2>
              <p className="text-gray-600">Analyse de votre profil en cours</p>
            </div>
          </div>
        )}

        {step === "error" && (
          <div className="min-h-screen flex items-center justify-center py-8 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 border-2 border-red-200">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Oups, quelque chose s'est mal passé
                </h2>
                <p className="text-gray-700 mb-6">{error || "Une erreur est survenue."}</p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleBack}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                  >
                    Retour au formulaire
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === "suggestions" && (
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-gray-600">Chargement...</p>
                </div>
              </div>
            }
          >
            <ExerciseSuggestions suggestions={suggestions} onBack={handleBack} profile={profile} />
          </Suspense>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
