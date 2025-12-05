import { useEffect } from "react";
import type { SportProfile } from "../types/index.js";
import { saveProfileToLocalStorage, getProfileFromLocalStorage } from "../utils/localStorage";

export function useProfilePersistence(profile: SportProfile, _defaultProfile: SportProfile): void {
  useEffect(() => {
    saveProfileToLocalStorage(profile);
  }, [profile]);
}

export function useInitialProfile(defaultProfile: SportProfile): SportProfile {
  const saved = getProfileFromLocalStorage();
  return saved || defaultProfile;
}
