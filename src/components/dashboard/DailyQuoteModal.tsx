import React from 'react';
import { useKataStore } from '../../store/useKataStore';
import { soundEngine } from '../../utils/sound';
import { fireCheckmarkConfetti } from '../../utils/confetti';
import { Flame, Sparkles, Shuffle, Copy, X, Swords } from 'lucide-react';

export const DailyQuoteModal: React.FC = () => {
  const {
    showDailyQuoteModal,
    currentQuote,
    closeDailyQuoteModal,
    rollNewQuote,
    addToast
  } = useKataStore();

  if (!showDailyQuoteModal || !currentQuote) return null;

  const handleLockIn = () => {
    soundEngine.playCombo();
    fireCheckmarkConfetti();
    closeDailyQuoteModal(true);
    addToast('Iron Mandate Locked In', 'Discipline mode active. Attack your daily trials.', 'success');
  };

  const handleShuffle = () => {
    soundEngine.playCheckmark();
    rollNewQuote();
  };

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(`${currentQuote.text} — ${currentQuote.author}`);
      soundEngine.playCheckmark();
      addToast('Quote Copied', 'Mandate copied to clipboard.', 'info');
    } catch (e) {
      addToast('Notice', 'Could not copy to clipboard.', 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      {/* Outer Glow Halo */}
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0d121c] border-2 border-rose-500/40 shadow-[0_0_50px_rgba(244,63,94,0.25)] overflow-hidden">
        
        {/* Japanese Background Watermark */}
        <div className="absolute -right-4 -bottom-6 text-9xl font-display font-black text-white/[0.03] select-none pointer-events-none leading-none">
          {currentQuote.kanji || '鉄則'}
        </div>

        {/* Ambient Top Glow Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 via-amber-500 to-cyan-400" />

        <div className="p-6 sm:p-8 space-y-6 relative z-10">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold tracking-wider uppercase">
              <Flame className="w-3.5 h-3.5 text-rose-400 fill-rose-400 animate-pulse" />
              <span>DAILY IRON MANDATE • 今日の鉄則</span>
            </div>

            <button
              onClick={() => closeDailyQuoteModal(true)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
              title="Close for today"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quote Body */}
          <div className="space-y-4 pt-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold tracking-widest">
                {currentQuote.tag}
              </span>
              <span className="font-display font-black text-slate-400 text-xs">
                {currentQuote.kanji}
              </span>
            </div>

            <blockquote className="text-xl sm:text-2xl md:text-3xl font-display font-black text-white leading-snug tracking-tight drop-shadow-md">
              {currentQuote.text}
            </blockquote>

            <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
              <span className="w-6 h-px bg-rose-500/60" />
              <span className="font-semibold text-slate-300">{currentQuote.author}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-3">
            <button
              onClick={handleLockIn}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-display font-black text-sm uppercase tracking-wider shadow-lg shadow-rose-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Swords className="w-4 h-4 stroke-[2.5]" />
              <span>LOCK IN &amp; CONQUER • 覚悟</span>
            </button>

            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={handleShuffle}
                className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 text-xs font-mono flex items-center justify-center gap-2 transition hover:text-cyan-300 hover:border-cyan-500/30 cursor-pointer"
                title="Roll another heavy motivation quote"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Shuffle Quote</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 text-xs font-mono flex items-center justify-center gap-2 transition hover:text-white cursor-pointer"
                title="Copy quote"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
