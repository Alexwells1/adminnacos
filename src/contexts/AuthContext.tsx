import { createContext } from "react";
import type { AuthContextType } from "./useAuthcont";

// Create the context with a default value

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
