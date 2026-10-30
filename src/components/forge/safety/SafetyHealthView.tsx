import React from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, HeartPulse, Info, Anchor } from 'lucide-react';

export const SafetyHealthView: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl forge-card border border-orange-500/20 space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-red-600 to-orange-600 text-slate-950">
            <ShieldAlert className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-400">
            ARMOR &amp; INTEGRITY • 安全規範
          </span>
        </div>
        <h1 className="text-2xl font-display font-black text-white">
          Safety Protocols &amp; Joint Longevity
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
          The iron sharpens iron only when connective tissues remain undamaged. Discipline begins with impeccable technique and verified home equipment safety.
        </p>
      </div>

      {/* Safety Mandates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Mandate 1: Doorway Pull-up Bar Verification */}
        <div className="p-6 rounded-3xl forge-card border border-white/10 space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-600/20 text-orange-400 border border-orange-500/30">
              <Anchor className="w-4 h-4" />
            </div>
            <h2 className="text-base font-display font-bold text-white">
              Home Pull-up Bar Pre-Flight Check
            </h2>
          </div>

          <ul className="space-y-2.5 text-xs font-mono text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <span><strong>The Hang Test:</strong> Never jump directly into dynamic pull-ups. Step onto a stool and transfer full bodyweight into a static dead hang for 5 seconds to test bar grip.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <span><strong>Doorframe Trim Inspection:</strong> Ensure the upper molding can sustain downward shear force without cracking or flexing.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <span><strong>Telescopic Pressure Bars:</strong> If using a twist-to-tighten doorway bar, verify rotational tension every 7 days.</span>
            </li>
          </ul>
        </div>

        {/* Mandate 2: Chair & Parallette Stability */}
        <div className="p-6 rounded-3xl forge-card border border-white/10 space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h2 className="text-base font-display font-bold text-white">
              Chair &amp; Elevation Surface Check
            </h2>
          </div>

          <ul className="space-y-2.5 text-xs font-mono text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Non-Slip Grounding:</strong> Place chairs against a wall or on a rubber mat when performing Bulgarian split squats or chair dips to prevent kick-out.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>No Rolling Wheels:</strong> Never use swivel or wheeled office chairs for elevated feet push-ups or core tucks.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>2m x 2m Clear Perimeter:</strong> Clear water bottles, chargers, and hard furniture corners from your training radius.</span>
            </li>
          </ul>
        </div>

        {/* Mandate 3: Connective Tissue Before Ego */}
        <div className="p-6 rounded-3xl forge-card border border-white/10 space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-600/20 text-sky-400 border border-sky-500/30">
              <HeartPulse className="w-4 h-4" />
            </div>
            <h2 className="text-base font-display font-bold text-white">
              Tendon &amp; Joint Adaptation Rates
            </h2>
          </div>

          <p className="text-xs font-mono text-slate-300 leading-relaxed">
            Muscles adapt to stress in 2–4 weeks; tendons and ligaments take 6–12 months due to low vascularization. When advancing calisthenics levers (archer push-ups, dips, handstands), master the eccentric (lowering) phase for 4+ weeks before attempting explosive variations.
          </p>
        </div>

        {/* Mandate 4: Pain vs. Effort Discrimination */}
        <div className="p-6 rounded-3xl forge-card border border-white/10 space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h2 className="text-base font-display font-bold text-white">
              Sharp Pain vs. Muscular Burn
            </h2>
          </div>

          <p className="text-xs font-mono text-slate-300 leading-relaxed">
            Muscular burn (lactic buildup) in the center of the muscle belly is productive. <strong>Sharp, pinching, or stabbing pain inside a joint capsule (rotator cuff, patella, elbow tendon) is an immediate STOP signal.</strong> Substitute with an easier regression immediately.
          </p>
        </div>

      </div>

      {/* Non-Medical Advisory Callout */}
      <div className="p-6 rounded-3xl bg-black/60 border border-white/10 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          <Info className="w-4 h-4 text-slate-400" />
          <span>Health &amp; Exercise Disclaimer</span>
        </div>
        <p className="text-xs font-mono text-slate-500 leading-relaxed">
          Kata &amp; Forge are digital tracking tools designed for structured habit formation and fitness progression. They do not constitute formal medical or physical therapy advice. Always consult a qualified physician or healthcare provider before beginning any strenuous physical exercise program, especially if you have pre-existing cardiovascular, musculoskeletal, or joint conditions.
        </p>
      </div>

    </div>
  );
};
