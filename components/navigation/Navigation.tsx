'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="md:hidden fixed top-0 left-0 right-0 h-16 z-50"
        style={{
          background: 'linear-gradient(135deg, rgba(245, 241, 232, 0.95) 0%, rgba(232, 220, 196, 0.95) 100%)',
          backdropFilter: 'blur(10px)',
          borderBottom: '2px solid var(--boho-sand)',
          boxShadow: '0 4px 20px rgba(139, 157, 131, 0.15)'
        }}
      >
        <div className="flex items-center justify-between px-4 h-full">
          <motion.h1 
            className="text-lg font-semibold"
            style={{ 
              fontFamily: 'Playfair Display, serif',
              color: 'var(--boho-rust)',
              textShadow: '0 2px 4px rgba(184, 92, 56, 0.1)'
            }}
            whileHover={{ scale: 1.05 }}
          >
            ✺ Inner Compass
          </motion.h1>
          <motion.button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 rounded-xl transition-all duration-300"
            style={{
              background: isMobileOpen ? 'var(--boho-terracotta)' : 'transparent',
              color: isMobileOpen ? 'white' : 'var(--boho-rust)'
            }}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        </div>
      </motion.div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 bg-black/50 z-40 mt-16"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.nav 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 80 }}
        className={`hidden md:flex fixed left-0 top-0 h-screen p-6 flex-col transition-all duration-300 ${
          isExpanded ? 'w-64' : 'w-24'
        }`}
        style={{
          background: 'linear-gradient(180deg, rgba(245, 241, 232, 0.95) 0%, rgba(232, 220, 196, 0.95) 100%)',
          backdropFilter: 'blur(10px)',
          borderRight: '2px solid var(--boho-sand)',
          boxShadow: '4px 0 20px rgba(139, 157, 131, 0.15)'
        }}
      >
        {/* Toggle Button */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mb-8 p-2 rounded-xl transition-all duration-300 self-end"
          style={{
            background: 'rgba(139, 157, 131, 0.1)',
            color: 'var(--boho-olive)'
          }}
          whileHover={{ 
            scale: 1.1, 
            background: 'var(--boho-sage)',
            color: 'white'
          }}
          whileTap={{ scale: 0.95 }}
          title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <motion.svg 
            className="w-5 h-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            animate={{ rotate: isExpanded ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </motion.svg>
        </motion.button>

        {/* Branding */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-12"
            >
              <h1 className="text-2xl font-semibold tracking-tight" style={{ 
                fontFamily: 'Playfair Display, serif',
                color: 'var(--boho-rust)',
                textShadow: '0 2px 4px rgba(184, 92, 56, 0.1)'
              }}>
                ✺ Inner Compass
              </h1>
              <p className="text-sm mt-2 handwritten" style={{ color: 'var(--boho-olive)' }}>
                Personal Growth
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Items */}
        <div className="flex-1 space-y-1 overflow-y-auto nav-scroll">
          <NavItem href="/" icon="📝" label="Daily Review" isExpanded={isExpanded} />
          <NavItem href="/thoughts" icon="💭" label="Thoughts" isExpanded={isExpanded} />
          <NavItem href="/guided-reflections" icon="🌿" label="Reflections" isExpanded={isExpanded} />
          <NavItem href="/vision-board" icon="🌠" label="Vision Board" isExpanded={isExpanded} />
          <NavItem href="/future-letters" icon="✉️" label="Future Letters" isExpanded={isExpanded} />
          <NavItem href="/goals" icon="🎯" label="Goals" isExpanded={isExpanded} />
          <NavItem href="/insights" icon="📊" label="Insights" isExpanded={isExpanded} />
          <NavItem href="/settings" icon="⚙️" label="Settings" isExpanded={isExpanded} />
        </div>

        {/* Logout Button */}
        <motion.button
          onClick={handleLogout}
          className={`mt-8 w-full px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-3 font-medium text-sm ${
            !isExpanded && 'justify-center'
          }`}
          style={{
            background: 'linear-gradient(135deg, rgba(139, 157, 131, 0.2), rgba(107, 127, 94, 0.2))',
            color: 'var(--boho-rust)',
            fontFamily: 'Playfair Display, serif'
          }}
          whileHover={{ 
            scale: 1.02,
            y: -2,
            background: 'linear-gradient(135deg, var(--boho-sage), var(--boho-olive))',
            color: 'white'
          }}
          whileTap={{ scale: 0.98 }}
          title="Logout"
        >
          <span>↪️</span>
          {isExpanded && <span>Logout</span>}
        </motion.button>
      </motion.nav>

      {/* Mobile Sidebar Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="md:hidden fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 p-6 flex flex-col z-40"
            style={{
              background: 'linear-gradient(180deg, rgba(245, 241, 232, 0.98) 0%, rgba(232, 220, 196, 0.98) 100%)',
              backdropFilter: 'blur(10px)',
              borderRight: '2px solid var(--boho-sand)',
              boxShadow: '4px 0 20px rgba(139, 157, 131, 0.15)'
            }}
          >
            {/* Navigation Items */}
            <div className="flex-1 space-y-1 overflow-y-auto nav-scroll">
              <NavItem href="/" icon="📝" label="Daily Review" isExpanded={true} />
              <NavItem href="/thoughts" icon="💭" label="Thoughts" isExpanded={true} />
              <NavItem href="/guided-reflections" icon="🌿" label="Reflections" isExpanded={true} />
              <NavItem href="/vision-board" icon="🌠" label="Vision Board" isExpanded={true} />
              <NavItem href="/future-letters" icon="✉️" label="Future Letters" isExpanded={true} />
              <NavItem href="/goals" icon="🎯" label="Goals" isExpanded={true} />
              <NavItem href="/insights" icon="📊" label="Insights" isExpanded={true} />
              <NavItem href="/settings" icon="⚙️" label="Settings" isExpanded={true} />
            </div>

            {/* Logout Button */}
            <motion.button
              onClick={() => {
                handleLogout();
                setIsMobileOpen(false);
              }}
              className="mt-8 w-full px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-3 font-medium text-sm"
              style={{
                background: 'linear-gradient(135deg, rgba(139, 157, 131, 0.2), rgba(107, 127, 94, 0.2))',
                color: 'var(--boho-rust)',
                fontFamily: 'Playfair Display, serif'
              }}
              whileHover={{ 
                scale: 1.02,
                background: 'linear-gradient(135deg, var(--boho-sage), var(--boho-olive))',
                color: 'white'
              }}
              whileTap={{ scale: 0.98 }}
              title="Logout"
            >
              <span>↪️</span>
              <span>Logout</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Spacer */}
      <div className={`hidden md:block transition-all duration-300 ${isExpanded ? 'w-64' : 'w-24'}`} />
    </>
  );
}
