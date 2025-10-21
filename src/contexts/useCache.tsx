// src/contexts/useCache.tsx
import React, { useRef, type ReactNode } from "react";
import { CacheContext } from "./CacheContext";

interface CacheData {
  [key: string]: {
    data: any;
    timestamp: number;
    expiresIn: number; // Cache expiration in milliseconds
  };
}

export interface CacheContextType {
  get: (key: string) => any;
  set: (key: string, data: any, expiresIn?: number) => void;
  clear: (key?: string) => void;
  has: (key: string) => boolean;
}

export const CacheProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const cacheRef = useRef<CacheData>({});

  const get = (key: string): any => {
    const item = cacheRef.current[key];
    if (!item) return null;

    // Check if cache has expired
    if (Date.now() - item.timestamp > item.expiresIn) {
      delete cacheRef.current[key];
      return null;
    }

    return item.data;
  };

  const set = (key: string, data: any, expiresIn: number = 5 * 60 * 1000) => {
    // 5 minutes default
    cacheRef.current[key] = {
      data,
      timestamp: Date.now(),
      expiresIn,
    };
  };

  const clear = (key?: string) => {
    if (key) {
      delete cacheRef.current[key];
    } else {
      cacheRef.current = {};
    }
  };

  const has = (key: string): boolean => {
    const item = cacheRef.current[key];
    if (!item) return false;

    if (Date.now() - item.timestamp > item.expiresIn) {
      delete cacheRef.current[key];
      return false;
    }

    return true;
  };

  return (
    <CacheContext.Provider value={{ get, set, clear, has }}>
      {children}
    </CacheContext.Provider>
  );
};
