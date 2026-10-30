import React, { useState } from 'react';
import { useKataStore } from '../../store/useKataStore';
import { getPastDays, formatDateDisplay, getDayShortName, getDayOfWeekIndex } from '../../utils/dates';
import { TrendingUp, Sparkles } from 'lucide-react';

export const CompletionsChart: React.FC = () => {
  const { dayLogs, selectedDate, setSelectedDate } = useKataStore();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const past14Days = getPastDays(14);
  const data = past14Days.map(dateStr => ({
    date: dateStr,
    count: dayLogs[dateStr]?.completedHabitIds.length || 0,
    isCurrent: dateStr === selectedDate
  }));

  const maxVal = Math.max(...data.map(d => d.count), 8);
  const chartHeight = 160;
  const chartWidth = 720;
  const paddingX = 40;
  const paddingY = 25;

  const points = data.map((d, index) => {
    const x = paddingX + (index / (data.length - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - (d.count / maxVal) * (chartHeight - paddingY * 2);
    return { x, y, ...d };
  });

  // Generate smooth SVG curve path using Catmull-Rom or cubic bezier
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;

  return (
    <div className="rounded-3xl glass-card p-6 border border-white/5 space-y-4 relative overflow-hidden">
      {/* Background Japanese Watermark */}
      <div className="absolute right-4 top-2 text-7xl font-display font-black text-white/[0.015] select-none pointer-events-none">
        軌跡
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
              14-Day Completion History • 軌跡
            </h2>
            <p className="text-xs text-slate-400">
              Track your daily consistency over the past 2 weeks
            </p>
          </div>
        </div>

        {/* Quick Average */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Avg: <strong className="text-white font-mono">{(data.reduce((a, b) => a + b.count, 0) / data.length).toFixed(1)}</strong>/day</span>
          </div>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-44 overflow-visible"
        >
          <defs>
            <linearGradient id="areaGlowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.32" />
              <stop offset="60%" stopColor="#00f2fe" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#00f2fe" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f2fe" />
              <stop offset="60%" stopColor="#00e5a3" />
              <stop offset="100%" stopColor="#ff6b8b" />
            </linearGradient>
            <filter id="neonBlur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          <line
            x1={paddingX}
            y1={chartHeight - paddingY}
            x2={chartWidth - paddingX}
            y2={chartHeight - paddingY}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={chartHeight / 2}
            x2={chartWidth - paddingX}
            y2={chartHeight / 2}
            stroke="rgba(255, 255, 255, 0.04)"
            strokeDasharray="4 4"
          />

          {/* Area Fill */}
          <path d={areaD} fill="url(#areaGlowGrad)" />

          {/* Neon Line */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#neonBlur)"
          />

          {/* Interactive Data Dots */}
          {points.map((pt, i) => {
            const isHovered = hoveredIndex === i;
            const isSelected = pt.date === selectedDate;

            return (
              <g
                key={pt.date}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setSelectedDate(pt.date)}
              >
                {/* Active selection vertical line */}
                {isSelected && (
                  <line
                    x1={pt.x}
                    y1={paddingY}
                    x2={pt.x}
                    y2={chartHeight - paddingY}
                    stroke="#00f2fe"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                    opacity="0.6"
                  />
                )}

                {/* Outer Glow Circle */}
                {(isHovered || isSelected) && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="10"
                    fill="rgba(0, 242, 254, 0.25)"
                    className="animate-ping"
                  />
                )}

                {/* Main Dot */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered || isSelected ? '6' : '4'}
                  fill="#0a0d14"
                  stroke={isSelected ? '#00f2fe' : '#00e5a3'}
                  strokeWidth="2.5"
                />

                {/* Day Labels below chart */}
                <text
                  x={pt.x}
                  y={chartHeight - 6}
                  textAnchor="middle"
                  fontSize="9.5"
                  fill={isSelected ? '#00f2fe' : '#94a3b8'}
                  fontWeight={isSelected ? '700' : '500'}
                  fontFamily="'JetBrains Mono', monospace"
                >
                  {pt.date.split('-')[2]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover / Active Day Details Card */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <div
            className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl bg-slate-900/95 border border-cyan-400/40 text-xs shadow-xl pointer-events-none flex items-center gap-3 animate-pop z-20"
          >
            <span className="text-cyan-300 font-semibold">
              {formatDateDisplay(points[hoveredIndex].date)}
            </span>
            <span className="font-mono text-white font-bold bg-cyan-500/20 px-2 py-0.5 rounded">
              {points[hoveredIndex].count} habits cleared
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
