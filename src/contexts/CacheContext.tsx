import { createContext } from "react";
import type { CacheContextType } from "./useCache";

export const CacheContext = createContext<CacheContextType | undefined>(
  undefined
);
