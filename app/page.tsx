'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { format, addDays, subDays } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/ui/PageTransition';
import JournalSection from '@/components/journal/JournalSection';
import MoodSelector from '@/components/journal/MoodSelector';
import TextArea from '@/components/journal/TextArea';
import ChecklistItem from '@/components/journal/ChecklistItem';
import CalendarPicker from '@/components/CalendarPicker';
import { getCurrentUser } from '@/lib/auth';
import {
  getJournalEntry,
  createJournalEntry,
  updateJournalEntry,
} from '@/lib/db';
import type { JournalEntry } from '@/entities/JournalEntry';
import type { ChecklistItem as ChecklistItemType } from '@/entities/JournalEntry';
import type { UserProfile } from '@/entities/UserProfile';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

const dailyQuotes = [
  // Core 30 quotes (self motivation, belief, love, worth, career, nature, bravery, confidence, healing, hard/smart work, soul)
  "Your only limit is your mind.",
  "You are worthy of every good thing you dream about.",
  "Progress is built on imperfect steps taken consistently.",
  "Self-belief turns effort into momentum.",
  "You are allowed to take up space and shine.",
  "Confidence grows when you keep the promises you make to yourself.",
  "Bravery is choosing growth over comfort, one small step at a time.",
  "Your soul’s beauty is felt when your actions match your values.",
  "Hard work builds muscle; smart work builds leverage—use both.",
  "You don’t need approval to pursue what lights you up.",
  "Healing is progress, not perfection—celebrate the tiny wins.",
  "Rest is productive when it restores your purpose.",
  "You are allowed to start over as many times as you need.",
  "Let your curiosity lead; courage will catch up.",
  "Small disciplined actions compound into a life you’re proud of.",
  "Nature whispers that growth happens quietly and steadily—so can you.",
  "Your career is a garden; plant skills, water relationships, prune distractions.",
  "Self-love is the engine; self-discipline is the steering.",
  "Your worth isn’t measured by productivity but by presence.",
  "Dare to do the hard thing; it shrinks when you face it.",
  "Confidence is earned by showing up when no one is watching.",
  "Smart work is asking better questions before taking action.",
  "The beauty you see in nature is a mirror of what lives in you.",
  "Choose challenge over comfort; that’s where the story gets good.",
  "Your voice matters more than the noise around you.",
  "Self-worth is non-negotiable—guard it like treasure.",
  "Consistency beats intensity when you’re building anything that lasts.",
  "Let go of timelines; hold on to direction.",
  "Every skill was once a struggle someone decided to keep practicing.",
  "Your heart knows the way—your habits make the path.",

  // Repeat the same 30 in a shuffled order for next month
  "Smart work is asking better questions before taking action.",
  "You are allowed to take up space and shine.",
  "Let your curiosity lead; courage will catch up.",
  "Your voice matters more than the noise around you.",
  "Hard work builds muscle; smart work builds leverage—use both.",
  "Nature whispers that growth happens quietly and steadily—so can you.",
  "Self-belief turns effort into momentum.",
  "Your heart knows the way—your habits make the path.",
  "Confidence is earned by showing up when no one is watching.",
  "Healing is progress, not perfection—celebrate the tiny wins.",
  "Your career is a garden; plant skills, water relationships, prune distractions.",
  "Consistency beats intensity when you’re building anything that lasts.",
  "You are worthy of every good thing you dream about.",
  "Rest is productive when it restores your purpose.",
  "The beauty you see in nature is a mirror of what lives in you.",
  "Dare to do the hard thing; it shrinks when you face it.",
  "Self-love is the engine; self-discipline is the steering.",
  "Choose challenge over comfort; that’s where the story gets good.",
  "You don’t need approval to pursue what lights you up.",
  "Bravery is choosing growth over comfort, one small step at a time.",
  "Your worth isn’t measured by productivity but by presence.",
  "Let go of timelines; hold on to direction.",
  "Your soul’s beauty is felt when your actions match your values.",
  "Progress is built on imperfect steps taken consistently.",
  "Self-worth is non-negotiable—guard it like treasure.",
  "Small disciplined actions compound into a life you’re proud of.",
  "Every skill was once a struggle someone decided to keep practicing.",
  "Confidence grows when you keep the promises you make to yourself.",
  "Your only limit is your mind.",
  "Let your curiosity lead; courage will catch up.",
];

export default function HomePage() {
  const router = useRouter();
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [checklistFilter, setChecklistFilter] = useState('');

  useEffect(() => {
    initializePage();
  }, []);

  useEffect(() => {
    if (user) {
      loadEntry();
    }
  }, [currentDate, user]);

  const initializePage = async () => {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }
    
    // Ensure profile exists
    const { getUserProfile, updateUserProfile } = await import('@/lib/db');
    const { supabase } = await import('@/lib/supabaseClient');
    
    let userProfile = await getUserProfile(currentUser.id);
    if (!userProfile) {
      // Create profile if it doesn't exist
      await supabase.from('profiles').insert({
        user_id: currentUser.id,
        email: currentUser.email,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      userProfile = await getUserProfile(currentUser.id);
    }
    
    setUser(currentUser);
    setProfile(userProfile);
    setLoading(false);
  };

  const loadEntry = async () => {
    if (!user) return;

    const dateStr = format(currentDate, 'yyyy-MM-dd');
    let journalEntry = await getJournalEntry(user.id, dateStr);

    if (!journalEntry) {
      journalEntry = await createJournalEntry(user.id, dateStr);
    }

    setEntry(journalEntry);
  };

  const autoSave = useCallback(
    (updates: Partial<JournalEntry>) => {
      if (!entry) return;

      // Clear existing timer
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }

      // Set new timer for debounced save
      const timer = setTimeout(async () => {
        await updateJournalEntry(entry.id, updates);
      }, 800);

      setAutoSaveTimer(timer);
    },
    [entry, autoSaveTimer]
  );

  const handleMoodChange = (mood: string, color: string) => {
    if (!entry) return;
    const updatedEntry = { ...entry, mood, mood_color: color };
    setEntry(updatedEntry);
    autoSave({ mood, mood_color: color });
  };

  const handleFieldChange = (field: keyof JournalEntry, value: string) => {
    if (!entry) return;
    const updatedEntry = { ...entry, [field]: value };
    setEntry(updatedEntry);
    autoSave({ [field]: value });
  };

  const handleChecklistToggle = (itemId: string) => {
    if (!entry) return;
    const updatedItems = entry.checklist_items.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    const updatedEntry = { ...entry, checklist_items: updatedItems };
    setEntry(updatedEntry);
    updateJournalEntry(entry.id, { checklist_items: updatedItems });
  };

  const handleChecklistUpdate = (itemId: string, text: string) => {
    if (!entry) return;
    const updatedItems = entry.checklist_items.map((item) =>
      item.id === itemId ? { ...item, text } : item
    );
    const updatedEntry = { ...entry, checklist_items: updatedItems };
    setEntry(updatedEntry);
    updateJournalEntry(entry.id, { checklist_items: updatedItems });
  };

  const handleChecklistDelete = (itemId: string) => {
    if (!entry) return;
    const updatedItems = entry.checklist_items.filter((item) => item.id !== itemId);
    const updatedEntry = { ...entry, checklist_items: updatedItems };
    setEntry(updatedEntry);
    updateJournalEntry(entry.id, { checklist_items: updatedItems });
  };

  const handleAddChecklistItem = () => {
    if (!entry || !newChecklistItem.trim()) return;

    const newItem: ChecklistItemType = {
      id: Date.now().toString(),
      text: newChecklistItem.trim(),
      completed: false,
      created_at: new Date().toISOString(),
    };

    const updatedItems = [...entry.checklist_items, newItem];
    const updatedEntry = { ...entry, checklist_items: updatedItems };
    setEntry(updatedEntry);
    setNewChecklistItem('');
    updateJournalEntry(entry.id, { checklist_items: updatedItems });
  };

  const changeDate = (days: number) => {
    setCurrentDate((prev) => (days > 0 ? addDays(prev, days) : subDays(prev, Math.abs(days))));
  };

  const selectDate = (date: Date) => {
    setCurrentDate(date);
  };

  const openDatePicker = () => {
    setShowCalendar(true);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getDailyQuote = () => {
    const dayOfYear = Math.floor((currentDate.getTime() - new Date(currentDate.getFullYear(), 0, 0).getTime()) / 86400000);
    return dailyQuotes[dayOfYear % dailyQuotes.length];
  };

  const getDisplayName = () => {
    if (profile?.nickname) return profile.nickname;
    return user?.email?.split('@')[0] || 'there';
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading your journal...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <UserNotRegisteredError />;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-stone-50 w-full">
        <div className="w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-8 md:py-10">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-neutral-900 mb-2 tracking-tight">
                {getGreeting()}, {getDisplayName()}
              </h1>
              <p className="text-neutral-600 italic text-xs sm:text-sm lg:text-base">"{getDailyQuote()}"</p>
            </div>

            {/* Date Navigation */}
            <div className="card mb-6 sm:mb-8" style={{ position: 'relative', zIndex: 25 }}>
              <div className="flex items-center justify-between gap-2 sm:gap-4 mb-4" style={{ position: 'relative' }}>
                <button
                  onClick={() => changeDate(-1)}
                  className="p-2 rounded-xl transition-all duration-200"
                  style={{
                    color: 'var(--boho-olive)',
                    background: 'rgba(139, 157, 131, 0.1)',
                    cursor: 'pointer',
                    position: 'relative',
                    zIndex: 26
                  }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button 
                  onClick={openDatePicker}
                  className="text-center px-2 sm:px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 sm:gap-3"
                  style={{
                    background: 'rgba(232, 220, 196, 0.5)',
                    cursor: 'pointer',
                    position: 'relative',
                    zIndex: 26
                  }}
                >
                  <div>
                    <p className="text-base sm:text-lg font-semibold" style={{ 
                      fontFamily: 'Playfair Display, serif',
                      color: 'var(--boho-rust)'
                    }}>
                      {format(currentDate, 'EEEE, MMMM d')}
                    </p>
                  </div>
                  <svg className="w-5 sm:w-6 h-5 sm:h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--boho-terracotta)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h14M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>

                <button
                  onClick={() => changeDate(1)}
                  className="p-2 rounded-xl transition-all duration-200"
                  style={{
                    color: 'var(--boho-olive)',
                    background: 'rgba(139, 157, 131, 0.1)',
                    cursor: 'pointer',
                    position: 'relative',
                    zIndex: 26
                  }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Date Picker - styled as button */}
              <input
                ref={dateInputRef}
                type="date"
                value={format(currentDate, 'yyyy-MM-dd')}
                onChange={(e) => selectDate(new Date(e.target.value))}
                onClick={(e) => e.currentTarget.showPicker?.()}
                className="absolute opacity-0 w-0 h-0"
                aria-hidden="true"
              />

              {/* Custom Calendar Picker Modal */}
              {showCalendar && (
                <CalendarPicker
                  date={currentDate}
                  onChange={selectDate}
                  onClose={() => setShowCalendar(false)}
                />
              )}
            </div>

            {/* Mood Selector */}
            <JournalSection title="How are you feeling?" icon="😊">
              <MoodSelector
                value={entry?.mood || null}
                color={entry?.mood_color || null}
                onChange={handleMoodChange}
              />
            </JournalSection>

              {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6">
              {/* Left Column */}
              <div className="space-y-4 sm:space-y-6">
                <JournalSection title="Today's Checklist" icon="✅">
                  {/* Checklist Items Container */}
                  <div className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl min-h-fit max-h-64 sm:max-h-80 md:max-h-96 overflow-hidden" style={{ width: '100%', maxWidth: '100%', background: 'rgba(232, 220, 196, 0.3)', border: '2px solid var(--boho-sand)', position: 'relative', zIndex: 12 }}>
                    {/* Items List with Scroll */}
                    <div className="overflow-y-auto pr-2 space-y-2" style={{ position: 'relative', zIndex: 13 }}>
                      {entry && entry.checklist_items.length > 0 ? (
                        entry.checklist_items.map((item, index) => (
                          <ChecklistItem
                            key={item.id}
                            item={item}
                            index={index + 1}
                            onToggle={handleChecklistToggle}
                            onDelete={handleChecklistDelete}
                            onUpdate={handleChecklistUpdate}
                          />
                        ))
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-neutral-400 text-sm">No tasks yet. Add one to get started!</p>
                        </div>
                    )}
                  </div>

                  {/* Add New Task Section */}
                  <div className="border-t border-neutral-200 pt-3 sm:pt-4" style={{ position: 'relative', zIndex: 15 }}>
                    <div className="flex gap-2 w-full">
                      <input
                        type="text"
                        value={newChecklistItem}
                        onChange={(e) => setNewChecklistItem(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddChecklistItem();
                          }
                        }}
                        placeholder="Add a new task..."
                        className="flex-1 min-w-0 px-3 py-2 sm:px-4 sm:py-3 rounded-xl focus:outline-none focus:ring-2 font-medium transition-all handwritten"
                        style={{
                          background: 'rgba(255, 255, 255, 0.9)',
                          border: '2px solid var(--boho-sand)',
                          color: 'var(--boho-rust)',
                          position: 'relative',
                          zIndex: 15,
                          fontSize: '1.35rem',
                          lineHeight: '1.6'
                        }}
                      />
                      <button 
                        onClick={handleAddChecklistItem}
                        className="btn-primary flex-shrink-0 px-4 py-2 sm:px-6 sm:py-3"
                        style={{
                          position: 'relative',
                          zIndex: 15
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </JournalSection>

                <JournalSection title="Daily Recap" icon="📖">
                  <TextArea
                    value={entry?.daily_recap || ''}
                    onChange={(value) => handleFieldChange('daily_recap', value)}
                    placeholder="What happened today? What stood out to you?"
                  />
                </JournalSection>

                <JournalSection title="Gratitude" icon="🙏">
                  <TextArea
                    value={entry?.gratitude || ''}
                    onChange={(value) => handleFieldChange('gratitude', value)}
                    placeholder="What are you grateful for today?"
                  />
                </JournalSection>
              </div>

              {/* Right Column */}
              <div className="space-y-4 sm:space-y-6">
                <JournalSection title="Current Goals & Desires" icon="✨">
                  <TextArea
                    value={entry?.goals_desires || ''}
                    onChange={(value) => handleFieldChange('goals_desires', value)}
                    placeholder="What are you working towards? What do you desire?"
                  />
                </JournalSection>

                <JournalSection title="What You Learnt Today?" icon="💡">
                  <TextArea
                    value={entry?.learnings || ''}
                    onChange={(value) => handleFieldChange('learnings', value)}
                    placeholder="What did you learn today? Any insights or discoveries?"
                  />
                </JournalSection>
              </div>
            </div>

          {/* Auto-save indicator */}
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-500">
              ✓ All changes are automatically saved
            </p>
          </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
