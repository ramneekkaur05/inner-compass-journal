'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface NavItemProps {
  href: string;
  icon: ReactNode;
  label: string;
  isExpanded: boolean;
}

export default function NavItem({ href, icon, label, isExpanded }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`
        group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ease-out text-sm font-medium
        ${
          isActive
            ? 'bg-brand-100 text-brand-700 border-l-2 border-brand-600'
            : 'text-neutral-600 hover:bg-rose-200 hover:text-neutral-900 hover:-translate-y-0.5 hover:shadow-md hover:shadow-rose-100/80 hover:scale-[1.02]'
        }
        ${isExpanded ? 'w-full' : 'justify-center w-12'}
      `}
      title={label}
    >
      <span className="text-base flex-shrink-0">{icon}</span>
      {isExpanded && <span className="truncate">{label}</span>}
    </Link>
  );
}
