export const getTodayStr = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDateDisplay = (dateStr: string): string => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
  const monthName = date.toLocaleDateString('en-US', { month: 'short' });
  return `${weekday}, ${monthName} ${d}`;
};

export const formatKanjiDate = (dateStr: string): string => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return `${m}月${d}日`;
};

export const getDaysInMonth = (year: number, monthIndex: number): string[] => {
  const days: string[] = [];
  const date = new Date(year, monthIndex, 1);
  while (date.getMonth() === monthIndex) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    days.push(`${y}-${m}-${d}`);
    date.setDate(date.getDate() + 1);
  }
  return days;
};

export const getPastDays = (count: number, referenceDateStr?: string): string[] => {
  const days: string[] = [];
  const ref = referenceDateStr ? new Date(referenceDateStr) : new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(ref);
    d.setDate(d.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    days.push(`${y}-${m}-${day}`);
  }
  return days;
};

export const isWeekend = (dateStr: string): boolean => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const day = new Date(y, m - 1, d).getDay();
  return day === 0 || day === 6; // Sun or Sat
};

export const getDayOfWeekIndex = (dateStr: string): number => {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).getDay();
};

export const getDayShortName = (dayIndex: number): string => {
  const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return names[dayIndex] || '';
};

export const getDayKanji = (dayIndex: number): string => {
  const kanji = ['日', '月', '火', '水', '木', '金', '土'];
  return kanji[dayIndex] || '';
};
