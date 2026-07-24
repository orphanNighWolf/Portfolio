import { useSyncExternalStore, useEffect } from "react";

type MotionOverride = "on" | "off" | "system";

const LOCAL_STORAGE_KEY = "aniket:reduced-motion";
const CUSTOM_EVENT_NAME = "aniket:reduced-motion-change";

// Helper to check if OS prefers reduced motion
function getOSPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Helper to check if reduced motion is active
export function getIsReducedMotionActive(): boolean {
  if (typeof window === "undefined") return false;
  const override = localStorage.getItem(LOCAL_STORAGE_KEY) as MotionOverride || "system";
  if (override === "on") return true;
  if (override === "off") return false;
  return getOSPrefersReducedMotion();
}

// Subscribe function for useSyncExternalStore
function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  
  window.addEventListener(CUSTOM_EVENT_NAME, callback);
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  
  return () => {
    window.removeEventListener(CUSTOM_EVENT_NAME, callback);
    mediaQuery.removeEventListener("change", callback);
  };
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    getIsReducedMotionActive,
    () => false // server fallback
  );
}

export function useReducedMotionOverride() {
  const getOverride = (): MotionOverride => {
    if (typeof window === "undefined") return "system";
    return (localStorage.getItem(LOCAL_STORAGE_KEY) as MotionOverride) || "system";
  };

  const setOverride = (val: MotionOverride) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(LOCAL_STORAGE_KEY, val);
    
    // Broadcast event
    window.dispatchEvent(new Event(CUSTOM_EVENT_NAME));
    
    // Update HTML attribute
    const active = val === "on" ? true : val === "off" ? false : getOSPrefersReducedMotion();
    document.documentElement.setAttribute("data-reduced-motion", active ? "on" : "off");
  };

  // Sync to HTML element on mount and when OS preference changes
  useEffect(() => {
    const handleSync = () => {
      const active = getIsReducedMotionActive();
      document.documentElement.setAttribute("data-reduced-motion", active ? "on" : "off");
    };

    handleSync();
    
    window.addEventListener(CUSTOM_EVENT_NAME, handleSync);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    mediaQuery.addEventListener("change", handleSync);
    
    return () => {
      window.removeEventListener(CUSTOM_EVENT_NAME, handleSync);
      mediaQuery.removeEventListener("change", handleSync);
    };
  }, []);

  return [getOverride(), setOverride] as const;
}
