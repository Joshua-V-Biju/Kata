import React, { useState } from 'react';
import { Sparkles, MessageCircle } from 'lucide-react';

interface AnimeMascotProps {
  completionRate: number; // 0 to 1
  streak: number;
}

export const AnimeMascot: React.FC<AnimeMascotProps> = ({ completionRate, streak }) => {
  const [showQuote, setShowQuote] = useState(false);

  // Motivational anime quotes depending on performance
  const getDialogue = () => {
    if (completionRate >= 1) {
      return '“Transcendent! All trials conquered today. You are unbreakable!”';
    }
    if (completionRate >= 0.75) {
      return `“${streak}-day streak energy! Keep pushing, the summit is right ahead!”`;
    }
    if (completionRate >= 0.4) {
      return '“Strong momentum! Channel your breath and finish your sprint!”';
    }
    if (completionRate > 0) {
      return '“First habit down! Discipline is forged one single strike at a time.”';
    }
    return '“Ready for today’s training, Master? Let’s draw the blade!”';
  };

  // Determine visual mode
  let auraColor = 'rgba(56, 189, 248, 0.2)';
  let auraGlow = 'drop-shadow(0 0 12px rgba(56, 189, 248, 0.4))';
  let moodTag = 'Meditation • 瞑想';
  let badgeColor = 'text-blue-400 bg-blue-500/10 border-blue-500/20';

  if (completionRate >= 1) {
    auraColor = 'rgba(255, 107, 139, 0.35)';
    auraGlow = 'drop-shadow(0 0 20px rgba(255, 107, 139, 0.7)) drop-shadow(0 0 35px rgba(0, 242, 254, 0.5))';
    moodTag = 'Transcendent • 神域';
    badgeColor = 'text-pink-400 bg-pink-500/10 border-pink-500/30';
  } else if (completionRate >= 0.75) {
    auraColor = 'rgba(0, 229, 163, 0.3)';
    auraGlow = 'drop-shadow(0 0 16px rgba(0, 229, 163, 0.6))';
    moodTag = 'Blazing Spirit • 気迫';
    badgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  } else if (completionRate >= 0.4) {
    auraColor = 'rgba(255, 179, 0, 0.3)';
    auraGlow = 'drop-shadow(0 0 14px rgba(255, 179, 0, 0.5))';
    moodTag = 'Focused • 集中';
    badgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  }

  return (
    <div className="relative flex flex-col items-center">
      {/* Interactive dialogue bubble */}
      {showQuote && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 p-2 rounded-xl bg-slate-900/95 border border-cyan-400/40 shadow-xl text-center z-30 animate-pop">
          <p className="text-[11px] font-medium text-cyan-200 italic leading-snug">{getDialogue()}</p>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-r border-b border-cyan-400/40 rotate-45" />
        </div>
      )}

      {/* Mascot Avatar Container */}
      <div
        onClick={() => setShowQuote(!showQuote)}
        className="relative group cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95"
        title="Click to interact with your Kata companion"
      >
        {/* Pulsing Aura Ring */}
        <div
          className="absolute -inset-3 rounded-full animate-pulse-slow pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${auraColor} 0%, transparent 70%)`,
          }}
        />

        {/* Mascot Face & Headgear SVG */}
        <svg
          viewBox="0 0 120 120"
          className="w-20 h-20 relative z-10 transition-all duration-300"
          style={{ filter: auraGlow }}
        >
          <defs>
            <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#00f2fe" />
              <stop offset="100%" stop-color="#6366f1" />
            </linearGradient>
            <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#ffedd5" />
              <stop offset="100%" stop-color="#fed7aa" />
            </linearGradient>
            <linearGradient id="headbandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#ff6b8b" />
              <stop offset="100%" stop-color="#f43f5e" />
            </linearGradient>
          </defs>

          {/* Halo / Crown if 100% */}
          {completionRate >= 1 && (
            <ellipse cx="60" cy="20" rx="34" ry="7" fill="none" stroke="#ffd700" stroke-width="3" stroke-dasharray="6 4" className="animate-spin origin-center" />
          )}

          {/* Head base */}
          <rect x="28" y="35" width="64" height="64" rx="30" fill="url(#skinGrad)" />

          {/* Anime Fox / Cat Ears / Cyber Antennae */}
          <polygon points="32,40 18,12 44,28" fill="#1e293b" />
          <polygon points="30,36 22,18 40,28" fill="#ff6b8b" />

          <polygon points="88,40 102,12 76,28" fill="#1e293b" />
          <polygon points="90,36 98,18 80,28" fill="#ff6b8b" />

          {/* Spiky Anime Hair */}
          <path
            d="M24 45 Q 16 30, 36 24 Q 48 10, 60 22 Q 72 8, 84 24 Q 104 30, 96 45 Q 85 36, 75 42 Q 60 30, 45 42 Z"
            fill="url(#hairGrad)"
          />

          {/* Shinobi Headband */}
          <rect x="25" y="44" width="70" height="14" rx="4" fill="url(#headbandGrad)" />
          {/* Metal plate with kanji */}
          <rect x="44" y="47" width="32" height="8" rx="2" fill="#0f172a" stroke="#cbd5e1" stroke-width="0.8" />
          <text x="60" y="53.5" font-size="6" font-family="'Zen Maru Gothic', sans-serif" font-weight="900" fill="#00f2fe" text-anchor="middle">
            型
          </text>

          {/* Blush marks */}
          <ellipse cx="38" cy="74" rx="4" ry="2" fill="#f43f5e" opacity="0.4" />
          <ellipse cx="82" cy="74" rx="4" ry="2" fill="#f43f5e" opacity="0.4" />

          {/* Eyes depending on state */}
          {completionRate === 0 ? (
            // Sleeping / Meditating peaceful eyes
            <g stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" fill="none">
              <path d="M42 66 Q 48 71, 54 66" />
              <path d="M66 66 Q 72 71, 78 66" />
            </g>
          ) : completionRate >= 0.75 ? (
            // Big sparkling determined anime eyes
            <g>
              <ellipse cx="48" cy="67" rx="6" ry="7" fill="#0f172a" />
              <ellipse cx="72" cy="67" rx="6" ry="7" fill="#0f172a" />
              <circle cx="46" cy="64" r="2.5" fill="#ffffff" />
              <circle cx="70" cy="64" r="2.5" fill="#ffffff" />
              <circle cx="50" cy="70" r="1.2" fill="#00f2fe" />
              <circle cx="74" cy="70" r="1.2" fill="#00f2fe" />
            </g>
          ) : (
            // Focused eyes
            <g stroke="#0f172a" stroke-width="2.2" stroke-linecap="round" fill="none">
              <path d="M42 67 L53 66" />
              <ellipse cx="48" cy="69" rx="3.5" ry="3.5" fill="#0f172a" />
              <circle cx="47" cy="68" r="1.2" fill="#fff" />

              <path d="M67 66 L78 67" />
              <ellipse cx="72" cy="69" rx="3.5" ry="3.5" fill="#0f172a" />
              <circle cx="71" cy="68" r="1.2" fill="#fff" />
            </g>
          )}

          {/* Mouth */}
          {completionRate >= 0.5 ? (
            <path d="M54 80 Q 60 85, 66 80" stroke="#1e293b" stroke-width="2" stroke-linecap="round" fill="none" />
          ) : (
            <ellipse cx="60" cy="80" rx="2" ry="1.5" fill="#1e293b" />
          )}
        </svg>

        {/* Small interaction bubble badge */}
        <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-slate-900 border border-cyan-400/50 text-cyan-300 shadow">
          <MessageCircle className="w-3 h-3" />
        </div>
      </div>

      {/* Mood Title Pill */}
      <span className={`mt-2 px-2.5 py-0.5 rounded-full border text-[10px] font-display font-bold tracking-wide uppercase ${badgeColor}`}>
        {moodTag}
      </span>
    </div>
  );
};
