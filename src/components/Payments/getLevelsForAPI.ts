// src/components/Payments/getLevelsForAPI.ts
/**
 * Converts filter level values to API-compatible level parameters
 * Handles special case where "200" includes both "200" and "200 D.E"
 */
export const getLevelsForAPI = (filterLevel: string): string | string[] => {
  if (filterLevel === "all") {
    return "all";
  }

  // Special handling for "200" - include both regular 200 and 200 D.E
  if (filterLevel === "200") {
    return ["200", "200 D.E"];
  }

  // For specific levels like "200 D.E", "100", "300", "400" - return as single value
  return filterLevel;
};
