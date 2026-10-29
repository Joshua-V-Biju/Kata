import confetti from 'canvas-confetti';

// Celebratory anime confetti bursts
export const fireCheckmarkConfetti = (x = 0.5, y = 0.5) => {
  confetti({
    particleCount: 28,
    spread: 60,
    origin: { x, y },
    colors: ['#00f2fe', '#ff6b8b', '#00e5a3', '#ffb300', '#f472b6'],
    ticks: 120,
    gravity: 1.2,
    scalar: 0.8,
    shapes: ['circle', 'square'],
    disableForReducedMotion: true,
  });
};

export const fireLevelUpConfetti = () => {
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  const interval: ReturnType<typeof setInterval> = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#00f2fe', '#4facfe', '#00e5a3', '#ffd700'],
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#ff6b8b', '#f472b6', '#a855f7', '#ffb300'],
    });
  }, 250);
};

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
