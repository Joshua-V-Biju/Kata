import React, { useMemo } from 'react';
import { useKataStore } from '../../store/useKataStore';

export const SakuraEffect: React.FC = () => {
  const sakuraEnabled = useKataStore(state => state.settings.sakuraEnabled);

  // Generate fixed random particle positions once to avoid re-renders
  const petals = useMemo(() => {
    return Array.from({ length: 16 }).map((_, i) => ({
      id: i,
      left: `${(i * 6.2 + 3) % 100}%`,
      animationDuration: `${12 + (i % 6) * 3}s`,
      animationDelay: `${(i * 1.7) % 8}s`,
      width: `${8 + (i % 3) * 4}px`,
      height: `${12 + (i % 3) * 6}px`,
      opacity: 0.25 + (i % 4) * 0.1,
    }));
  }, []);

  if (!sakuraEnabled) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map(p => (
        <div
          key={p.id}
          className="petal"
          style={{
            left: p.left,
            top: '-20px',
            width: p.width,
            height: p.height,
            opacity: p.opacity,
            animationDuration: p.animationDuration,
            animationDelay: p.animationDelay,
          }}
        />
      ))}
    </div>
  );
};
