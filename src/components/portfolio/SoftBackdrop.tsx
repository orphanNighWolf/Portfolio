import { useMotion } from "../../lib/motion-context";

export function SoftBackdrop() {
  const { motionEnabled } = useMotion();

  return (
    <div className="fixed inset-0 z-[-10] overflow-hidden pointer-events-none bg-bg-base">
      {/* Masked Paper Grid Background */}
      <div 
        className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)] bg-[size:32px_32px]"
        style={{
          maskImage: "radial-gradient(ellipse at 50% 50%, black 60%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 50%, black 60%, transparent 100%)"
        }}
      />

      {/* Decorative Pastel Radial Blobs */}
      <div className="absolute inset-0">
        {/* Blob 1: Terracotta Tint / Warm Pink */}
        <div 
          className={`absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-accent-terracotta/10 blur-[120px] transition-transform duration-[8000ms] ${
            motionEnabled ? "animate-pulse" : ""
          }`}
          style={{
            animationDuration: "12s"
          }}
        />

        {/* Blob 2: Analyst Green / Soft Emerald */}
        <div 
          className={`absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-accent-analyst/5 blur-[100px] transition-transform duration-[10000ms] ${
            motionEnabled ? "animate-pulse" : ""
          }`}
          style={{
            animationDuration: "16s",
            animationDelay: "2s"
          }}
        />

        {/* Blob 3: Scientist Violet */}
        <div 
          className={`absolute top-[40%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-accent-scientist/5 blur-[90px] transition-transform duration-[9000ms] ${
            motionEnabled ? "animate-pulse" : ""
          }`}
          style={{
            animationDuration: "14s",
            animationDelay: "1s"
          }}
        />

        {/* Blob 4: Engineer Blue */}
        <div 
          className={`absolute bottom-[20%] left-[10%] w-[35vw] h-[35vw] rounded-full bg-accent-engineer/5 blur-[90px] transition-transform duration-[9000ms] ${
            motionEnabled ? "animate-pulse" : ""
          }`}
          style={{
            animationDuration: "15s",
            animationDelay: "3s"
          }}
        />
      </div>
    </div>
  );
}
export default SoftBackdrop;
