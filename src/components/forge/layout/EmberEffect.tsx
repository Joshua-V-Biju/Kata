import React, { useMemo, useState, useEffect } from 'react';

export const EmberEffect: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const embers = useMemo(() => {
    const count = isMobile ? 8 : 16;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${(i * (100 / count) + (i % 3) * 2.5) % 96}%`,
      animationDuration: `${5 + (i % 4) * 1.5}s`,
      animationDelay: `${(i % 5) * 0.8}s`,
      size: `${3 + (i % 3) * 2}px`,
      opacity: 0.25 + (i % 3) * 0.15
    }));
  }, [isMobile]);

  return (
    <div className="fixed inset-0 pointer-events-none z-1 overflow-hidden">
      {embers.map(e => (
        <div
          key={e.id}
          className="forge-ember"
          style={{
            left: e.left,
            bottom: '-10px',
            width: e.size,
            height: e.size,
            animationDuration: e.animationDuration,
            animationDelay: e.animationDelay,
            opacity: e.opacity
          }}
        />
      ))}
    </div>
  );
};
