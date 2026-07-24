import { useMemo } from "react";

interface DataPoint {
  label: string;
  value: number;
}

interface BloombergChartProps {
  data: DataPoint[];
  variant?: "ai" | "analytics" | "finance";
  title?: string;
  subtitle?: string;
  height?: number;
}

export default function BloombergChart({
  data,
  variant = "analytics",
  title = "TELEMETRY_LOGS",
  subtitle = "REALTIME_FEED",
  height = 200,
}: BloombergChartProps) {
  // Map variant to accent color properties
  const variantColors = {
    ai: {
      line: "stroke-accent-ai",
      area: "fill-accent-ai/5",
      point: "text-accent-ai",
    },
    analytics: {
      line: "stroke-accent-analytics",
      area: "fill-accent-analytics/5",
      point: "text-accent-analytics",
    },
    finance: {
      line: "stroke-accent-finance",
      area: "fill-accent-finance/5",
      point: "text-accent-finance",
    },
  };

  const colors = variantColors[variant];

  // Boundaries calculation
  const values = data.map((d) => d.value);
  const maxValue = useMemo(() => (values.length ? Math.max(...values) * 1.15 : 100), [values]);
  const minValue = useMemo(() => (values.length ? Math.min(...values) * 0.85 : 0), [values]);
  const valueRange = maxValue - minValue || 1;

  const width = 500;
  const chartHeight = height - 40;

  // Compute SVG coordinates
  const points = useMemo(() => {
    if (!data.length) return [];
    const stepX = (width - 60) / (data.length - 1 || 1);
    
    return data.map((dp, idx) => {
      const x = 50 + idx * stepX;
      const pct = (dp.value - minValue) / valueRange;
      const y = chartHeight - 10 - pct * (chartHeight - 30);
      return { x, y, val: dp.value, label: dp.label };
    });
  }, [data, minValue, valueRange, chartHeight]);

  const pathD = useMemo(() => {
    if (!points.length) return "";
    return points.reduce((acc: string, p: { x: number; y: number }, idx: number) => {
      return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, "");
  }, [points]);

  const areaD = useMemo(() => {
    if (!points.length) return "";
    const first = points[0];
    const last = points[points.length - 1];
    return `${pathD} L ${last.x} ${chartHeight - 10} L ${first.x} ${chartHeight - 10} Z`;
  }, [points, pathD, chartHeight]);

  // Restrained gridline positions (Y levels)
  const gridLevels = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="bg-bg-surface border border-border rounded-xl p-5 shadow-lg select-none font-mono">
      {/* Chart Header Info */}
      <div className="flex justify-between items-start border-b border-divider pb-3 mb-4 text-xs">
        <div className="space-y-0.5">
          <span className="text-[10px] text-text-primary font-bold uppercase tracking-wider">// {title}</span>
          <p className="text-[9px] text-text-muted uppercase tracking-widest">{subtitle}</p>
        </div>
        <div className="text-[10px] text-text-secondary font-bold uppercase tracking-wide flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full bg-current ${colors.point}`} />
          STATUS: INGESTING
        </div>
      </div>

      {/* SVG Canvas */}
      <div style={{ height: `${height}px` }} className="w-full relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          {/* Horizontal Gridlines */}
          {gridLevels.map((lvl, idx) => {
            const y = chartHeight - 10 - lvl * (chartHeight - 30);
            const val = minValue + lvl * valueRange;
            return (
              <g key={idx} className="opacity-20 text-text-muted">
                <line x1="45" y1={y} x2={width - 10} y2={y} stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" />
                <text x="5" y={y + 3} className="text-[8px] fill-current font-semibold font-mono">
                  {val.toFixed(0)}
                </text>
              </g>
            );
          })}

          {/* Area under curve */}
          {areaD && <path d={areaD} className={colors.area} />}

          {/* Core Trendline */}
          {pathD && (
            <path d={pathD} fill="none" className={colors.line} strokeWidth="1.5" strokeLinecap="round" />
          )}

          {/* Coordinate Points */}
          {points &&
            points.map((p, idx) => (
              <g key={idx} className="group">
                <circle cx={p.x} cy={p.y} r="3" className={`fill-bg-surface stroke-current ${colors.point}`} strokeWidth="1.5" />
                
                {/* Horizontal Tick Labels */}
                {idx % Math.max(1, Math.round(points.length / 5)) === 0 && (
                  <text x={p.x} y={height - 5} textAnchor="middle" className="text-[8px] fill-text-muted font-semibold">
                    {p.label}
                  </text>
                )}
              </g>
            ))}
        </svg>
      </div>
    </div>
  );
}
