import React, { useMemo, useState, useEffect } from 'react';
import { useKataStore } from '../../store/useKataStore';

export const SakuraEffect: React.FC = () => {
  const sakuraEnabled = useKataStore(state => state.settings.sakuraEnabled);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Generate lightweight particle set (6 on mobile, 12 on desktop for buttery 60/120fps)
  const petals = useMemo(() => {
    const count = isMobile ? 6 : 12;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${(i * (100 / count) + 3) % 96}%`,
      animationDuration: `${14 + (i % 5) * 3}s`,
      animationDelay: `${(i * 1.8) % 7}s`,
      width: `${8 + (i % 3) * 3}px`,
      height: `${12 + (i % 3) * 4}px`,
      opacity: 0.2 + (i % 3) * 0.1,
    }));
  }, [isMobile]);

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
