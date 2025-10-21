// Helper function to get levels for API (to be used in the parent component)

export const getLevelsForAPI = (levelFilter: string): string | string[] => {
  if (levelFilter === "all") return "all";
  if (levelFilter === "200") return ["200", "200 D.E"];
  return levelFilter;
};
