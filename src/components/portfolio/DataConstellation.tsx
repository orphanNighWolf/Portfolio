import { useEffect, useRef, useState } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  label?: string;
  isSignal: boolean;
}

export function DataConstellation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 450;
    let height = 450;

    // Set high-DPI scaling
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const signalLabels = ["SQL", "Python", "dbt", "Airflow", "Snowflake", "Pandas", "BigQuery", "Spark"];
    const nodes: Node[] = [];

    // Initialize 25 nodes
    for (let i = 0; i < 25; i++) {
      const isSignal = i < signalLabels.length;
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: isSignal ? 5 : 3,
        label: isSignal ? signalLabels[i] : undefined,
        isSignal,
      });
    }

    const mouse = mouseRef.current;
    const proximityRadius = 85;
    const cursorRadius = 100;
    const repulsionStrength = 0.8;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Physics update & node repulsion
      nodes.forEach((node) => {
        // Drift position
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off walls
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Mouse repulsion force
        if (mouse.x !== null && mouse.y !== null) {
          const dx = node.x - mouse.x;
          const dy = node.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < cursorRadius && distance > 0) {
            const force = (cursorRadius - distance) / cursorRadius;
            const pushX = (dx / distance) * force * repulsionStrength;
            const pushY = (dy / distance) * force * repulsionStrength;

            node.x += pushX;
            node.y += pushY;
          }
        }
      });

      // 2. Draw connections (edges)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < proximityRadius) {
            const alpha = (1 - distance / proximityRadius) * 0.15;
            ctx.strokeStyle = `rgba(23, 23, 23, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      // 3. Draw mouse cursor links
      if (mouse.x !== null && mouse.y !== null) {
        nodes.forEach((node) => {
          const dx = node.x - mouse.x!;
          const dy = node.y - mouse.y!;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < cursorRadius) {
            const alpha = (1 - distance / cursorRadius) * 0.18;
            ctx.strokeStyle = `rgba(194, 89, 63, ${alpha})`; // Terracotta accent lines for cursor
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(mouse.x!, mouse.y!);
            ctx.lineTo(node.x, node.y);
            ctx.stroke();
          }
        });
      }

      // 4. Draw nodes and labels
      nodes.forEach((node) => {
        if (node.isSignal) {
          // Glow Halo
          ctx.strokeStyle = "rgba(194, 89, 63, 0.15)";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(node.x, node.y, 10, 0, Math.PI * 2);
          ctx.stroke();

          // Signal Core Dot
          ctx.fillStyle = "#C2593F"; // Terracotta
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          ctx.fill();

          // Label text
          if (node.label) {
            ctx.font = "500 9px 'IBM Plex Mono', monospace";
            ctx.fillStyle = "#171717"; // Ink label
            ctx.fillText(node.label, node.x + 10, node.y + 3);
          }
        } else {
          // Regular Node Dot
          ctx.fillStyle = "rgba(23, 23, 23, 0.4)";
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Event listeners
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      // Calculate mouse position inside scaled canvas bounds
      mouse.x = ((e.clientX - rect.left) / rect.width) * width;
      mouse.y = ((e.clientY - rect.top) / rect.height) * height;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full aspect-square max-w-[450px] mx-auto flex items-center justify-center bg-transparent relative">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block cursor-pointer select-none bg-transparent"
        style={{ maxWidth: "450px", maxHeight: "450px" }}
      />
    </div>
  );
}
export default DataConstellation;
