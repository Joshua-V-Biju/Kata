import React, { useMemo } from 'react';

export const EmberEffect: React.FC = () => {
  const embers = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: `${(i * 4.2 + (i % 3) * 2.5) % 100}%`,
      animationDuration: `${4 + (i % 5) * 1.5}s`,
      animationDelay: `${(i % 7) * 0.7}s`,
      size: `${3 + (i % 4) * 2}px`,
      opacity: 0.3 + (i % 4) * 0.15
    }));
  }, []);

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
