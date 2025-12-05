import { useState, useCallback } from "react";
import type { SportProfile } from "../types/index.js";

type FormValue = string | number | boolean | string[] | null;

function getNestedValue(obj: Record<string, unknown>, path: string): FormValue {
  const keys = path.split(".");
  let value: unknown = obj;
  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return null;
    }
  }
  return value as FormValue;
}

function setNestedValue(
  obj: Record<string, unknown>,
  path: string,
  value: FormValue
): Record<string, unknown> {
  const keys = path.split(".");
  const newObj = { ...obj };
  let current: Record<string, unknown> = newObj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== "object" || current[key] === null) {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }

  current[keys[keys.length - 1]] = value;
  return newObj;
}

export function useProfileForm(initialProfile: SportProfile) {
  const [profile, setProfile] = useState<SportProfile>(initialProfile);

  const getValue = useCallback(
    (path: string): FormValue => {
      return getNestedValue(profile as unknown as Record<string, unknown>, path);
    },
    [profile]
  );

  const setValue = useCallback((path: string, value: FormValue) => {
    setProfile((prev) => setNestedValue(prev as unknown as Record<string, unknown>, path, value) as unknown as SportProfile);
  }, []);

  const resetProfile = useCallback((newProfile: SportProfile) => {
    setProfile(newProfile);
  }, []);

  return {
    profile,
    getValue,
    setValue,
    resetProfile,
  };
}
