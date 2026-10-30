export interface MotivationQuote {
  id: string;
  text: string;
  author: string;
  tag: string;
  kanji: string;
}

export const HEAVY_MOTIVATION_QUOTES: MotivationQuote[] = [
  {
    id: 'fly',
    text: '“What if I fall? Bitch, what if you fly?”',
    author: 'Unapologetic Grit',
    tag: 'FEARLESS',
    kanji: '飛翔'
  },
  {
    id: 'comfort',
    text: '“Comfort is a slow death. Step into the arena and bleed for your craft.”',
    author: 'Warrior Mindset',
    tag: 'NO RETREAT',
    kanji: '闘魂'
  },
  {
    id: 'graveyard',
    text: '“The graveyard is full of people who had ‘potential’. Get off your ass and do the work.”',
    author: 'Iron Law',
    tag: 'DISCIPLINE',
    kanji: '覚醒'
  },
  {
    id: 'average',
    text: '“They want you to stay average because your potential makes them uncomfortable. Keep going.”',
    author: 'Relentless Focus',
    tag: 'DOMINANCE',
    kanji: '覇王'
  },
  {
    id: 'monument',
    text: '“They laughed at your blueprint; make them choke on the monument.”',
    author: 'The Architect',
    tag: 'BUILD',
    kanji: '築城'
  },
  {
    id: 'weakness',
    text: '“When you feel like quitting, remember why you hated being weak in the first place.”',
    author: 'Anime Protagonist Creed',
    tag: 'NEVER AGAIN',
    kanji: '不撓不屈'
  },
  {
    id: 'standard',
    text: '“You don’t need more motivation. You need a standard you refuse to drop below.”',
    author: 'Discipline Over Emotion',
    tag: 'STANDARD',
    kanji: '規律'
  },
  {
    id: 'obsession',
    text: '“Obsession beats talent every damn day of the week. Lock in.”',
    author: 'The Relentless',
    tag: 'LOCK IN',
    kanji: '執念'
  },
  {
    id: 'shoulders',
    text: '“Stop asking for a lighter burden. Build broader, unyielding shoulders.”',
    author: 'Forge of Steel',
    tag: 'STRENGTH',
    kanji: '剛毅'
  },
  {
    id: 'rent',
    text: '“Success isn’t owned. It’s leased, and the damn rent is due every single day.”',
    author: 'Daily Grind',
    tag: 'DAILY RENT',
    kanji: '継続'
  },
  {
    id: 'excuses',
    text: '“Your excuses sound best to the person making them. Kill them with ruthless execution.”',
    author: 'Cold Reality',
    tag: 'ZERO EXCUSES',
    kanji: '断行'
  },
  {
    id: 'master',
    text: '“Every master was once a disaster who refused to lay down their blade.”',
    author: 'Way of the Blade',
    tag: 'MASTERY',
    kanji: '達人'
  },
  {
    id: 'blade',
    text: '“Self-pity is a luxury for the defeated. Pick up your blade and strike back.”',
    author: 'Ronin Code',
    tag: 'RESILIENCE',
    kanji: '斬撃'
  },
  {
    id: 'mood',
    text: '“The world doesn’t give a damn about your mood. It only bends to your discipline.”',
    author: 'Raw Truth',
    tag: 'MIND OVER MOOD',
    kanji: '克己'
  },
  {
    id: 'future',
    text: '“Act like the person you want to become until you look back at who you used to be.”',
    author: 'Transformation',
    tag: 'EVOLVE',
    kanji: '進化'
  },
  {
    id: 'loud',
    text: '“Make your discipline so deafening that your doubts can’t even hear themselves speak.”',
    author: 'Unstoppable',
    tag: 'FOCUS',
    kanji: '極限'
  },
  {
    id: 'save-you',
    text: '“Nobody is coming to save you. Your daily habits are your only weapon.”',
    author: 'Survival Protocol',
    tag: 'AUTONOMY',
    kanji: '独立'
  },
  {
    id: 'diamond',
    text: '“Iron sharpens iron. Intense pressure turns carbon into diamonds. What are you forged of?”',
    author: 'The Forge',
    tag: 'PRESSURE',
    kanji: '鍛錬'
  },
  {
    id: 'one-day',
    text: '“One day or Day One. You decide right now.”',
    author: 'The Mandate',
    tag: 'DECIDE',
    kanji: '決意'
  },
  {
    id: 'silence',
    text: '“They doubt you because they can’t fathom doing it themselves. Prove them wrong in dead silence.”',
    author: 'Shadow Warrior',
    tag: 'STEALTH POWER',
    kanji: '黙考'
  }
];

// Deterministic daily quote based on date string (YYYY-MM-DD)
export const getDailyQuote = (dateStr?: string): MotivationQuote => {
  if (!dateStr) {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    dateStr = `${y}-${m}-${d}`;
  }

  // Hash date string to choose an index
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }

  const index = Math.abs(hash) % HEAVY_MOTIVATION_QUOTES.length;
  return HEAVY_MOTIVATION_QUOTES[index];
};

export const getRandomQuote = (currentId?: string): MotivationQuote => {
  const pool = currentId 
    ? HEAVY_MOTIVATION_QUOTES.filter(q => q.id !== currentId) 
    : HEAVY_MOTIVATION_QUOTES;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
};
