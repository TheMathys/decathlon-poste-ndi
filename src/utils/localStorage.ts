import type { SportProfile } from "../types/index.js";

const PROFILE_STORAGE_KEY = "decathlon_sport_profile";
const PROFILE_VERSION = "1.0";

interface StoredProfile {
  version: string;
  profile: SportProfile;
  timestamp: number;
}

export function saveProfileToLocalStorage(profile: SportProfile): void {
  try {
    const storedData: StoredProfile = {
      version: PROFILE_VERSION,
      profile,
      timestamp: Date.now(),
    };
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(storedData));
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("Impossible de sauvegarder le profil dans localStorage:", error);
    }
  }
}

export function getProfileFromLocalStorage(): SportProfile | null {
  try {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const storedData: StoredProfile = JSON.parse(stored);

    if (storedData.version !== PROFILE_VERSION) {
      if (import.meta.env.DEV) {
        console.warn("Version du profil différente, réinitialisation");
      }
      return null;
    }

    const maxAge = 30 * 24 * 60 * 60 * 1000;
    if (Date.now() - storedData.timestamp > maxAge) {
      if (import.meta.env.DEV) {
        console.log("Profil trop ancien, réinitialisation");
      }
      clearProfileFromLocalStorage();
      return null;
    }

    return storedData.profile;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("Impossible de récupérer le profil depuis localStorage:", error);
    }
    return null;
  }
}

export function clearProfileFromLocalStorage(): void {
  try {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("Impossible de supprimer le profil du localStorage:", error);
    }
  }
}
export function hasStoredProfile(): boolean {
  return getProfileFromLocalStorage() !== null;
}

