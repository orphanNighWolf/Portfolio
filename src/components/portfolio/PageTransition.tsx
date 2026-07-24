import { motion } from "motion/react";
import { useMotion } from "../../lib/motion-context";

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const { motionEnabled } = useMotion();

  if (!motionEnabled) {
    return <div className="w-full">{children}</div>;
  }

  const variants = {
    hidden: { opacity: 0, y: 16, scale: 0.99 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -12, scale: 0.99 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      transition={{
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1], // ease-enter cubic bezier
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
export default PageTransition;
