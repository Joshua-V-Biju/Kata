import React from 'react';
import * as Icons from 'lucide-react';

interface IconRendererProps {
  name: string;
  className?: string;
  size?: number;
}

export const IconRenderer: React.FC<IconRendererProps> = ({ name, className = '', size = 20 }) => {
  // Lucide icons lookup
  const LucideIcon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string; size?: number }>>)[name];

  if (LucideIcon) {
    return <LucideIcon className={className} size={size} />;
  }

  // Graceful fallback icon
  return <Icons.Sparkles className={className} size={size} />;
};
