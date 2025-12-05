import type { Exercise } from "../../types/index.js";

export function hasContraIndication(
  exercise: Exercise,
  douleurs: string[],
  limitations: string[]
): boolean {
  const ci = exercise.contre_indications || [];
  return [...douleurs, ...limitations].some((item) => ci.includes(item));
}
