'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import PageTransition from '@/components/ui/PageTransition';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { getCurrentUser } from '@/lib/auth';
import {
  getYearHighlights,
  createYearHighlight,
  updateYearHighlight,
  deleteYearHighlight,
} from '@/lib/db';
import type { HighlightCategory, YearHighlight } from '@/entities/YearHighlight';

const categoryPalette: Record<HighlightCategory, { chip: string; glow: string; icon: string }> = {
  Career: { chip: '#F59E0B', glow: 'rgba(245, 158, 11, 0.18)', icon: '💼' },
  Relationships: { chip: '#EF4444', glow: 'rgba(239, 68, 68, 0.18)', icon: '💞' },
  Health: { chip: '#10B981', glow: 'rgba(16, 185, 129, 0.18)', icon: '🌿' },
  Travel: { chip: '#06B6D4', glow: 'rgba(6, 182, 212, 0.18)', icon: '✈️' },
  Learning: { chip: '#3B82F6', glow: 'rgba(59, 130, 246, 0.18)', icon: '📚' },
  Finance: { chip: '#84CC16', glow: 'rgba(132, 204, 22, 0.18)', icon: '💰' },
  'Personal Growth': { chip: '#A855F7', glow: 'rgba(168, 85, 247, 0.18)', icon: '🧠' },
  Milestone: { chip: '#E11D48', glow: 'rgba(225, 29, 72, 0.18)', icon: '🏆' },
  Other: { chip: '#78716C', glow: 'rgba(120, 113, 108, 0.18)', icon: '✨' },
};

const categories = Object.keys(categoryPalette) as HighlightCategory[];
const burstIcons = ['✨', '🌟', '💫', '🎉', '🪄', '⭐'];

type CelebrationParticle = {
  id: string;
  icon: string;
  x: number;
  y: number;
  rotate: number;
  size: number;
};

const getTodayInputValue = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export default function YearHighlightsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [highlights, setHighlights] = useState<YearHighlight[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editing, setEditing] = useState<YearHighlight | null>(null);
  const [error, setError] = useState('');
  const [particles, setParticles] = useState<CelebrationParticle[]>([]);
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);

  useEffect(() => {
    initializePage();
  }, []);

  useEffect(() => {
    if (user) {
      loadHighlights(user.id, selectedYear);
    }
  }, [selectedYear, user]);

  const initializePage = async () => {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }

    setUser(currentUser);
    await loadHighlights(currentUser.id, selectedYear);
    setLoading(false);
  };

  const loadHighlights = async (userId: string, year: number) => {
    const data = await getYearHighlights(userId, year);
    setHighlights(data);
  };

  const handleCreate = async (payload: CreateHighlightInput): Promise<boolean> => {
    if (!user) return false;

    setError('');
    const created = await createYearHighlight(user.id, payload);
    if (!created) {
      setError('Could not save your highlight. Please try again.');
      return false;
    }

    setHighlights((prev) => {
      const next = [...prev, created];
      return next.sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
    });
    setNewlyAddedId(created.id);

    const newParticles = Array.from({ length: 18 }, (_, index) => {
      const spreadX = (Math.random() - 0.5) * 70;
      const spreadY = -20 - Math.random() * 40;
      return {
        id: `${Date.now()}-${index}`,
        icon: burstIcons[Math.floor(Math.random() * burstIcons.length)],
        x: spreadX,
        y: spreadY,
        rotate: Math.floor(Math.random() * 220) - 110,
        size: 20 + Math.floor(Math.random() * 18),
      };
    });
    setParticles(newParticles);

    setTimeout(() => setParticles([]), 1300);
    setTimeout(() => setNewlyAddedId(null), 1500);
    return true;
  };

  const handleUpdate = async (id: string, updates: Partial<YearHighlight>): Promise<boolean> => {
    const success = await updateYearHighlight(id, updates);
    if (!success) {
      setError('Could not update this highlight. Please try again.');
      return false;
    }

    setHighlights((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, ...updates } : item))
        .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
    );
    setEditing(null);
    return true;
  };

  const handleDelete = async (id: string) => {
    const success = await deleteYearHighlight(id);
    if (!success) {
      setError('Could not delete this highlight. Please try again.');
      return;
    }

    setHighlights((prev) => prev.filter((item) => item.id !== id));
  };

  const yearOptions = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: 7 }, (_, index) => current - 3 + index);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading your year highlights...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <UserNotRegisteredError />;
  }

  return (
    <PageTransition>
      <AnimatePresence>
        {particles.length > 0 && (
          <div className="pointer-events-none fixed inset-0 z-[70] overflow-hidden">
            {particles.map((particle) => (
              <motion.span
                key={particle.id}
                initial={{
                  opacity: 0,
                  scale: 0.4,
                  x: '50vw',
                  y: '55vh',
                  rotate: 0,
                }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  scale: [0.4, 1.15, 1, 0.6],
                  x: `calc(50vw + ${particle.x}vw)`,
                  y: `calc(55vh + ${particle.y}vh)`,
                  rotate: particle.rotate,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="absolute"
                style={{ fontSize: `${particle.size}px` }}
              >
                {particle.icon}
              </motion.span>
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-stone-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl p-6 sm:p-8 mb-8"
            style={{
              background: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.45), transparent 35%), linear-gradient(130deg, #E8DCC4 0%, #F5F1E8 35%, #E5D2B8 100%)',
              border: '2px solid rgba(212, 165, 116, 0.5)',
              boxShadow: '0 20px 45px rgba(107, 127, 94, 0.16)',
            }}
          >
            <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-amber-200/30 blur-2xl" />
            <div className="absolute right-12 bottom-4 text-4xl opacity-40">✨</div>
            <h1 className="text-3xl sm:text-4xl font-semibold mb-2">Year Highlights</h1>
            <p className="text-neutral-700 text-sm sm:text-base max-w-2xl">
              Capture defining moments of your year and revisit them like a personal constellation of growth.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-6">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="input-field !w-auto"
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <button onClick={() => setShowCreateModal(true)} className="btn-primary">
                + Add Highlight
              </button>
            </div>
          </motion.div>

          {error && (
            <div className="mb-6 rounded-xl px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {highlights.length === 0 ? (
            <div className="card text-center py-16">
              <div className="text-6xl mb-4">🌠</div>
              <h2 className="text-xl font-semibold text-neutral-800 mb-2">No highlights yet for {selectedYear}</h2>
              <p className="text-neutral-600 mb-6">Add your first defining event and start your memory constellation.</p>
              <button onClick={() => setShowCreateModal(true)} className="btn-primary">
                Add Your First Highlight
              </button>
            </div>
          ) : (
            <div className="relative">
              <div
                className="absolute left-5 sm:left-1/2 sm:-translate-x-1/2 top-0 bottom-0 w-1 rounded-full"
                style={{
                  background: 'linear-gradient(180deg, rgba(184,92,56,0.15), rgba(107,127,94,0.4), rgba(184,92,56,0.15))',
                }}
              />

              <div className="space-y-7">
                {highlights.map((highlight, index) => {
                  const palette = categoryPalette[highlight.category];
                  const leftAligned = index % 2 === 0;

                  return (
                    <motion.div
                      key={highlight.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={
                        newlyAddedId === highlight.id
                          ? { opacity: 1, y: 0, scale: [1, 1.03, 1] }
                          : { opacity: 1, y: 0 }
                      }
                      transition={{
                        duration: 0.35,
                        delay: index * 0.04,
                        scale: { duration: 0.6, ease: 'easeOut' },
                      }}
                      className={`relative flex sm:items-center ${leftAligned ? 'sm:justify-start' : 'sm:justify-end'}`}
                    >
                      <div className="absolute left-3 sm:left-1/2 sm:-translate-x-1/2 w-5 h-5 rounded-full border-4 border-stone-50"
                        style={{ backgroundColor: palette.chip }}
                      />

                      <div
                        className={`ml-12 sm:ml-0 w-full sm:w-[46%] rounded-2xl p-5 border-2 ${leftAligned ? 'sm:mr-[54%]' : 'sm:ml-[54%]'}`}
                        style={{
                          background: `linear-gradient(145deg, #FDF9F1 0%, ${palette.glow} 100%)`,
                          borderColor: `${palette.chip}70`,
                          boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                        }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-neutral-500 mb-1">
                              {format(new Date(highlight.event_date), 'MMMM d, yyyy')}
                            </p>
                            <h3 className="text-xl font-semibold text-neutral-800">
                              {highlight.icon} {highlight.title}
                            </h3>
                          </div>
                          <span
                            className="px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                            style={{ backgroundColor: palette.chip }}
                          >
                            {highlight.category}
                          </span>
                        </div>

                        <p className="text-neutral-700 mt-3 whitespace-pre-wrap">{highlight.description}</p>

                        <div className="flex items-center justify-between mt-4">
                          <div className="text-sm text-neutral-600">{'⭐'.repeat(highlight.impact_score)}</div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditing(highlight)}
                              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/80 border border-neutral-300 hover:bg-white"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(highlight.id)}
                              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <HighlightModal
          year={selectedYear}
          defaultDate={getTodayInputValue()}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreate}
        />
      )}

      {editing && (
        <HighlightModal
          year={selectedYear}
          defaultDate={getTodayInputValue()}
          editing={editing}
          onClose={() => setEditing(null)}
          onSubmit={(payload) => handleUpdate(editing.id, payload)}
        />
      )}
    </PageTransition>
  );
}

type CreateHighlightInput = Omit<YearHighlight, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

function HighlightModal({
  year,
  defaultDate,
  editing,
  onClose,
  onSubmit,
}: {
  year: number;
  defaultDate: string;
  editing?: YearHighlight;
  onClose: () => void;
  onSubmit: (payload: CreateHighlightInput) => Promise<boolean>;
}) {
  const [title, setTitle] = useState(editing?.title ?? '');
  const [description, setDescription] = useState(editing?.description ?? '');
  const [eventDate, setEventDate] = useState(
    editing?.event_date ?? defaultDate
  );
  const [category, setCategory] = useState<HighlightCategory>(editing?.category ?? 'Milestone');
  const [impactScore, setImpactScore] = useState(editing?.impact_score ?? 4);
  const [icon, setIcon] = useState(editing?.icon ?? categoryPalette[editing?.category ?? 'Milestone'].icon);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !description.trim() || !eventDate) return;

    setSaving(true);

    const selectedDate = new Date(eventDate);
    const success = await onSubmit({
      year: selectedDate.getFullYear(),
      title: title.trim(),
      description: description.trim(),
      event_date: eventDate,
      category,
      impact_score: impactScore,
      icon: icon.trim() || categoryPalette[category].icon,
    });

    setSaving(false);

    if (success) {
      onClose();
    }
  };

  const autoFillIcon = (selectedCategory: HighlightCategory) => {
    setCategory(selectedCategory);
    if (!editing || !icon.trim()) {
      setIcon(categoryPalette[selectedCategory].icon);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6">
          {editing ? 'Edit Highlight' : 'Add New Highlight'}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Event Title</label>
            <input
              type="text"
              className="input-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Promotion, first solo trip, marathon finish..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">What happened?</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea-calm"
              rows={6}
              placeholder="Describe this moment and why it mattered to you..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Date</label>
              <input
                type="date"
                className="input-field"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Category</label>
              <select
                className="input-field"
                value={category}
                onChange={(e) => autoFillIcon(e.target.value as HighlightCategory)}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Icon (emoji)</label>
              <input
                type="text"
                className="input-field"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                maxLength={3}
                placeholder="✨"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-neutral-700">Impact Score</label>
                <span className="text-sm font-semibold text-amber-700">{impactScore}/5</span>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                <input
                  type="range"
                  className="w-full accent-amber-600"
                  min={1}
                  max={5}
                  step={1}
                  value={impactScore}
                  onChange={(e) => setImpactScore(Number(e.target.value))}
                />
                <div className="mt-2 flex justify-between text-[11px] text-amber-700/80">
                  <span>Small</span>
                  <span>Meaningful</span>
                  <span>Life-changing</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-secondary flex-1" disabled={saving}>
            Cancel
          </button>
          <button onClick={handleSave} className="btn-primary flex-1" disabled={saving}>
            {saving ? 'Saving...' : editing ? 'Update Highlight' : 'Save Highlight'}
          </button>
        </div>
      </div>
    </div>
  );
}
