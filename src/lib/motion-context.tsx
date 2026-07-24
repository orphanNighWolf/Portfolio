import React, { createContext, useContext, useState, useEffect } from "react";

interface MotionContextType {
  motionEnabled: boolean;
  setMotionEnabled: (val: boolean) => void;
}

const MotionContext = createContext<MotionContextType | undefined>(undefined);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [motionEnabled, setMotionEnabled] = useState(true);

  // Read preferences or sync if needed
  useEffect(() => {
    const saved = localStorage.getItem("motion-enabled");
    if (saved !== null) {
      setMotionEnabled(saved === "true");
    } else {
      // Check system prefers-reduced-motion
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setMotionEnabled(!mediaQuery.matches);
    }
  }, []);

  const handleSetMotionEnabled = (val: boolean) => {
    setMotionEnabled(val);
    localStorage.setItem("motion-enabled", String(val));
  };

  return (
    <MotionContext.Provider value={{ motionEnabled, setMotionEnabled: handleSetMotionEnabled }}>
      {children}
    </MotionContext.Provider>
  );
}

export function useMotion() {
  const context = useContext(MotionContext);
  if (!context) {
    throw new Error("useMotion must be used within a MotionProvider");
  }
  return context;
}
