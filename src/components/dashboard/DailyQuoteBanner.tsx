import React from 'react';
import { useKataStore } from '../../store/useKataStore';
import { soundEngine } from '../../utils/sound';
import { Flame, Sparkles, Shuffle, ExternalLink, Quote } from 'lucide-react';

export const DailyQuoteBanner: React.FC = () => {
  const { currentQuote, openDailyQuoteModal, rollNewQuote } = useKataStore();

  if (!currentQuote) return null;

  const handleShuffle = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playCheckmark();
    rollNewQuote();
  };

  return (
    <div
      onClick={openDailyQuoteModal}
      className="group relative overflow-hidden rounded-2xl glass-card p-4 sm:p-5 border border-rose-500/20 hover:border-rose-500/50 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-rose-500/10"
      title="Click to expand today's Iron Mandate"
    >
      {/* Background Anime Kanwa Watermark */}
      <div className="absolute right-3 -bottom-4 text-6xl font-display font-black text-rose-500/[0.04] select-none pointer-events-none">
        {currentQuote.kanji || '鉄則'}
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Left: Flame Icon & Quote Content */}
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-rose-500/20 to-amber-500/20 border border-rose-500/30 text-rose-400 shrink-0 mt-0.5 sm:mt-0">
            <Flame className="w-4 h-4 fill-rose-400 animate-pulse" />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400">
                DAILY IRON MANDATE
              </span>
              <span className="text-[10px] font-mono text-slate-500">•</span>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300">
                {currentQuote.tag}
              </span>
            </div>

            <p className="text-sm font-display font-bold text-slate-100 group-hover:text-white transition-colors leading-snug line-clamp-2">
              {currentQuote.text}
            </p>
          </div>
        </div>

        {/* Right: Quick Shuffle & Expand Controls */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center pt-1 sm:pt-0">
          <button
            type="button"
            onClick={handleShuffle}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-white/5 transition"
            title="Roll next quote"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>

          <span className="text-xs text-rose-400 font-mono font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            <span>Expand</span>
            <ExternalLink className="w-3 h-3" />
          </span>
        </div>

      </div>
    </div>
  );
};
