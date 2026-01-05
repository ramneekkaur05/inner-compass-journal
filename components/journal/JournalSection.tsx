'use client';

import { ReactNode } from 'react';

interface JournalSectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}

export default function JournalSection({ title, icon, children }: JournalSectionProps) {
  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        {icon && <span className="text-lg">{icon}</span>}
        <h2 className="text-base font-semibold text-neutral-900 tracking-tight">{title}</h2>
      </div>
      <div>
        {children}
      </div>
    </div>
  );
}
