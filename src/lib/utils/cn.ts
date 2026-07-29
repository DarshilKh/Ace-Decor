/**
 * lib/utils/cn.ts — Tailwind CSS Class Merging Utility
 *
 * Combines clsx (conditional classes) and tailwind-merge (conflict resolution).
 * Used throughout all components as `cn("base-class", condition && "optional-class")`.
 *
 * prettier-plugin-tailwindcss is configured with `tailwindFunctions: ["cn"]`
 * in .prettierrc so class strings inside cn() are automatically sorted.
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
