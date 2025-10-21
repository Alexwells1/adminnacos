import { useContext } from "react";
import { CacheContext } from "./CacheContext";

export const useCache = () => {
  const context = useContext(CacheContext);
  if (context === undefined) {
    throw new Error("useCache must be used within a CacheProvider");
  }
  return context;
};
