'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import NavItem from './NavItem';
import { getCurrentUser, signOut } from '@/lib/auth';
import { prefetchPageData } from '@/lib/prefetch';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    checkUser();
  }, [pathname]);

  const checkUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    setLoading(false);

    // Prefetch data for logged-in users
    if (currentUser && !pathname.startsWith('/auth')) {
      // Prefetch in background (non-blocking)
      prefetchPageData(currentUser.id).catch(() => {
        // Silently fail - not critical for functionality
      });
    }

    // Redirect to login if not authenticated and not on auth pages
    if (!currentUser && !pathname.startsWith('/auth')) {
      router.push('/auth/login');
    }
  };

  const handleLogout = async () => {
    await signOut();
    setUser(null);
    router.push('/auth/login');
    router.refresh();
  };

  // Don't show navigation on auth pages
  if (pathname.startsWith('/auth') || loading || !user) {
    return null;
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-amber-50 border-b border-amber-200 flex items-center justify-between px-4 z-50">
        <h1 className="text-lg font-semibold text-neutral-900">Inner Compass</h1>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 hover:bg-amber-100 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 mt-16"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <nav className={`hidden md:flex fixed left-0 top-0 h-screen bg-amber-50 border-r border-amber-200 p-6 flex-col transition-all duration-300 ${
        isExpanded ? 'w-64' : 'w-24'
      }`}>
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mb-8 p-2 hover:bg-amber-100 rounded-lg transition-colors text-neutral-700 self-end"
          title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isExpanded ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            )}
          </svg>
        </button>

        {/* Branding */}
        <div className={`mb-12 transition-all ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>
          <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">
            Inner Compass
          </h1>
          <p className="text-sm text-neutral-500 mt-2">Personal Growth</p>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 space-y-1 overflow-y-auto nav-scroll">
          <NavItem href="/" icon="📝" label="Day Journal" isExpanded={isExpanded} />
          <NavItem href="/guided-reflections" icon="🌿" label="Reflections" isExpanded={isExpanded} />
          <NavItem href="/vision-board" icon="🌠" label="Vision Board" isExpanded={isExpanded} />
          <NavItem href="/identity" icon="🧑" label="Identity" isExpanded={isExpanded} />
          <NavItem href="/future-letters" icon="✉️" label="Future Letters" isExpanded={isExpanded} />
          <NavItem href="/goals" icon="🎯" label="Goals" isExpanded={isExpanded} />
          <NavItem href="/insights" icon="📊" label="Insights" isExpanded={isExpanded} />
          <NavItem href="/settings" icon="⚙️" label="Settings" isExpanded={isExpanded} />
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`mt-8 w-full px-4 py-2.5 text-left text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all duration-200 ease-out flex items-center gap-3 font-medium text-sm hover:-translate-y-0.5 hover:shadow-md hover:shadow-neutral-200/80 hover:scale-[1.02] ${
            !isExpanded && 'justify-center'
          }`}
          title="Logout"
        >
          <span>↪️</span>
          {isExpanded && <span>Logout</span>}
        </button>
      </nav>

      {/* Mobile Sidebar Menu */}
      <div className={`md:hidden fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-amber-50 border-r border-amber-200 p-6 flex flex-col z-40 transform transition-transform duration-300 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Navigation Items */}
        <div className="flex-1 space-y-1 overflow-y-auto nav-scroll">
          <NavItem href="/" icon="📝" label="Day Journal" isExpanded={true} />
          <NavItem href="/guided-reflections" icon="🌿" label="Reflections" isExpanded={true} />
          <NavItem href="/vision-board" icon="🌠" label="Vision Board" isExpanded={true} />
          <NavItem href="/identity" icon="🧑" label="Identity" isExpanded={true} />
          <NavItem href="/future-letters" icon="✉️" label="Future Letters" isExpanded={true} />
          <NavItem href="/goals" icon="🎯" label="Goals" isExpanded={true} />
          <NavItem href="/insights" icon="📊" label="Insights" isExpanded={true} />
          <NavItem href="/settings" icon="⚙️" label="Settings" isExpanded={true} />
        </div>

        {/* Logout Button */}
        <button
          onClick={() => {
            handleLogout();
            setIsMobileOpen(false);
          }}
          className="mt-8 w-full px-4 py-2.5 text-left text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all duration-200 flex items-center gap-3 font-medium text-sm"
          title="Logout"
        >
          <span>↪️</span>
          <span>Logout</span>
        </button>
      </div>

      {/* Desktop Spacer */}
      <div className={`hidden md:block transition-all duration-300 ${isExpanded ? 'w-64' : 'w-24'}`} />
    </>
  );
}
