'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageTransition from '@/components/ui/PageTransition';
import { getCurrentUser } from '@/lib/auth';
import {
  getGuidedReflections,
  createGuidedReflection,
  updateGuidedReflection,
} from '@/lib/db';
import type { GuidedReflection, ReflectionTheme } from '@/entities/GuidedReflection';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { format } from 'date-fns';

const themes: { theme: ReflectionTheme; prompt: string; icon: string }[] = [
  {
    theme: 'Release',
    prompt: 'What are you ready to let go of? What no longer serves you?',
    icon: '🍃',
  },
  {
    theme: 'Forgiveness',
    prompt: 'Who or what do you need to forgive? How can you extend compassion?',
    icon: '💜',
  },
  {
    theme: 'Deep Gratitude',
    prompt: 'What are you deeply grateful for? Why does it matter to you?',
    icon: '🙏',
  },
  {
    theme: 'Dreams',
    prompt: 'What are your biggest dreams? What would your ideal life look like?',
    icon: '✨',
  },
  {
    theme: 'Facing Fears',
    prompt: 'What fears are holding you back? What would you do if you weren\'t afraid?',
    icon: '🦁',
  },
  {
    theme: 'Growth',
    prompt: 'How have you grown recently? What lessons have you learned?',
    icon: '🌱',
  },
];

export default function GuidedReflectionsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reflections, setReflections] = useState<GuidedReflection[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<typeof themes[0] | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    initializePage();
  }, []);

  const initializePage = async () => {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }
    setUser(currentUser);
    loadReflections(currentUser.id);
    setLoading(false);
  };

  const loadReflections = async (userId: string) => {
    const guidedReflections = await getGuidedReflections(userId);
    setReflections(guidedReflections);
  };

  const handleEditStart = (reflection: GuidedReflection) => {
    setEditingId(reflection.id);
    setEditText(reflection.reflection);
  };

  const handleEditSave = async (id: string) => {
    await updateGuidedReflection(id, { reflection: editText });
    setReflections(reflections.map(r => 
      r.id === id ? { ...r, reflection: editText } : r
    ));
    setEditingId(null);
    setEditText('');
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditText('');
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading reflections...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <UserNotRegisteredError />;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-stone-50">
        <div className="max-w-5xl mx-auto px-8 py-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-neutral-900 mb-2 tracking-tight">
              Guided Reflections
            </h1>
            <p className="text-neutral-600 text-base">Deep introspection with guided prompts</p>
          </div>

          {/* Theme Selection */}
          {!selectedTheme && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {themes.map((theme) => (
                <button
                  key={theme.theme}
                  onClick={() => setSelectedTheme(theme)}
                  className="card text-left hover:scale-105 transition-transform"
                >
                  <span className="text-4xl mb-3 block">{theme.icon}</span>
                  <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                    {theme.theme}
                  </h3>
                  <p className="text-neutral-600 text-sm">{theme.prompt}</p>
                </button>
              ))}
            </div>
          )}

          {/* Reflection Form */}
          {selectedTheme && (
            <div className="mb-8">
              <ReflectionForm
                theme={selectedTheme}
                userId={user.id}
                onSave={(reflection) => {
                  setReflections([reflection, ...reflections]);
                  setSelectedTheme(null);
                }}
                onCancel={() => setSelectedTheme(null)}
              />
            </div>
          )}

          {/* History View inline */}
          <div className="mt-8 space-y-6">
            <h2 className="text-xl font-semibold text-neutral-800">Your Reflections</h2>
            {reflections.map((reflection) => (
              <div key={reflection.id} className="card" style={{ background: 'linear-gradient(135deg, #F5F1E8 0%, #E8DCC4 100%)', borderColor: '#D4A574' }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-800">
                      {reflection.theme}
                    </h3>
                    <p className="text-sm text-neutral-500">
                      {format(new Date(reflection.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {themes.find((t) => t.theme === reflection.theme)?.icon}
                    </span>
                    {editingId !== reflection.id && (
                      <button
                        onClick={() => handleEditStart(reflection)}
                        className="p-2 text-neutral-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                        title="Edit reflection"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-neutral-700 italic mb-3 text-sm">{reflection.prompt}</p>
                
                {editingId === reflection.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-indigo-50 border border-indigo-200 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-300 transition-colors resize-none handwritten"
                      style={{ fontSize: '1.35rem', lineHeight: '1.8' }}
                      rows={8}
                      placeholder="Write your reflection..."
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={handleEditCancel}
                        className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleEditSave(reflection.id)}
                        className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-neutral-800 whitespace-pre-wrap handwritten" style={{ fontSize: '1.35rem', lineHeight: '1.8' }}>{reflection.reflection}</p>
                )}
              </div>
            ))}

            {reflections.length === 0 && (
              <div className="text-center py-16">
                <p className="text-neutral-500 text-lg">
                  No reflections yet. Start your first guided reflection!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

function ReflectionForm({
  theme,
  userId,
  onSave,
  onCancel,
}: {
  theme: typeof themes[0];
  userId: string;
  onSave: (reflection: GuidedReflection) => void;
  onCancel: () => void;
}) {
  const [reflection, setReflection] = useState('');
  const [saving, setSaving] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [savedReflection, setSavedReflection] = useState<GuidedReflection | null>(null);

  const handleSave = async () => {
    if (!reflection.trim()) return;

    setSaving(true);

    if (savedReflection) {
      // Update existing
      await updateGuidedReflection(savedReflection.id, { reflection });
    } else {
      // Create new
      const newReflection = await createGuidedReflection(userId, {
        theme: theme.theme,
        prompt: theme.prompt,
        reflection,
      });

      if (newReflection) {
        setSavedReflection(newReflection);
        onSave(newReflection);
      }
    }

    setSaving(false);
  };

  const autoSave = () => {
    if (!reflection.trim() || !savedReflection) return;

    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    const timer = setTimeout(async () => {
      await updateGuidedReflection(savedReflection.id, { reflection });
    }, 1000);

    setAutoSaveTimer(timer);
  };

  useEffect(() => {
    if (savedReflection) {
      autoSave();
    }
  }, [reflection]);

  return (
    <div className="card">
      <button
        onClick={onCancel}
        className="mb-4 text-neutral-600 hover:text-neutral-800 flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to themes
      </button>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{theme.icon}</span>
          <h2 className="text-2xl font-bold text-neutral-800">{theme.theme}</h2>
        </div>
        <p className="text-lg text-neutral-700 italic">{theme.prompt}</p>
      </div>

      <textarea
        value={reflection}
        onChange={(e) => setReflection(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none transition-all bg-white/50 backdrop-blur-sm resize-none"
        rows={12}
        placeholder="Start writing your reflection..."
      />

      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-neutral-500">
          {savedReflection ? '✓ Auto-saving...' : 'Start writing to save'}
        </p>
        <div className="flex gap-3">
          <button 
            onClick={onCancel} 
            className="btn-secondary"
          >
            Cancel
          </button>
          <button onClick={handleSave} className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : savedReflection ? 'Done' : 'Save Reflection'}
          </button>
        </div>
      </div>
    </div>
  );
}
