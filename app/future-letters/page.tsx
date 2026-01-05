'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import PageTransition from '@/components/ui/PageTransition';
import { getCurrentUser } from '@/lib/auth';
import {
  getFutureLetters,
  createFutureLetter,
  updateFutureLetter,
  deleteFutureLetter,
} from '@/lib/db';
import type { FutureLetter } from '@/entities/FutureLetter';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

export default function FutureLettersPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [letters, setLetters] = useState<FutureLetter[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<FutureLetter | null>(null);

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
    loadLetters(currentUser.id);
    setLoading(false);
  };

  const loadLetters = async (userId: string) => {
    const futureLetters = await getFutureLetters(userId);
    setLetters(futureLetters);
  };

  const handleCreateLetter = async (title: string, content: string, unlockDate: string) => {
    if (!user) return;

    const newLetter = await createFutureLetter(user.id, {
      title,
      content,
      unlock_date: unlockDate,
      is_locked: true,
    });

    if (newLetter) {
      setLetters([newLetter, ...letters]);
      setShowCreateModal(false);
    }
  };

  const handleDeleteLetter = async (letterId: string) => {
    const success = await deleteFutureLetter(letterId);
    if (success) {
      setLetters(letters.filter((l) => l.id !== letterId));
      setSelectedLetter(null);
    }
  };

  const isUnlocked = (letter: FutureLetter) => {
    return isPast(new Date(letter.unlock_date));
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading your letters...</p>
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
            <h1 className="text-3xl font-semibold text-neutral-900 mb-2 tracking-tight">Future Letters</h1>
            <p className="text-neutral-600 text-base">Write letters to your future self</p>
          </div>

          {/* Create Button */}
          <button onClick={() => setShowCreateModal(true)} className="mb-8 btn-primary">
            + Write New Letter
          </button>

          {/* Letters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {letters.map((letter) => {
              const unlocked = isUnlocked(letter);
              
              return (
                <div
                  key={letter.id}
                  onClick={() => setSelectedLetter(letter)}
                  className={`card cursor-pointer relative ${
                    unlocked ? 'hover:shadow-xl' : 'opacity-75'
                  }`}
                >
                  {/* Lock Icon */}
                  <div className="absolute top-4 right-4">
                    {unlocked ? (
                      <span className="text-2xl">🔓</span>
                    ) : (
                      <span className="text-2xl">🔒</span>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold text-neutral-800 mb-2 pr-8">
                    {letter.title}
                  </h3>

                  <div className="text-sm text-neutral-600 mb-4">
                    <p>Opens: {format(new Date(letter.unlock_date), 'MMM d, yyyy')}</p>
                    {!unlocked && (
                      <p className="text-purple-600 font-medium mt-1">
                        {formatDistanceToNow(new Date(letter.unlock_date), { addSuffix: true })}
                      </p>
                    )}
                  </div>

                  {unlocked ? (
                    <p className="text-neutral-700 line-clamp-3">{letter.content}</p>
                  ) : (
                    <p className="text-neutral-400 italic">Letter is locked until unlock date</p>
                  )}
                </div>
              );
            })}
          </div>

          {letters.length === 0 && (
            <div className="text-center py-16">
              <p className="text-neutral-500 text-lg">
                No letters yet. Write a message to your future self!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateLetterModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateLetter}
        />
      )}

      {/* Read Modal */}
      {selectedLetter && (
        <ReadLetterModal
          letter={selectedLetter}
          onClose={() => setSelectedLetter(null)}
          onDelete={handleDeleteLetter}
          isUnlocked={isUnlocked(selectedLetter)}
        />
      )}
    </PageTransition>
  );
}

function CreateLetterModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (title: string, content: string, unlockDate: string) => void;
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [unlockDate, setUnlockDate] = useState('');

  const handleSubmit = () => {
    if (!title.trim() || !content.trim() || !unlockDate) return;
    onCreate(title, content, unlockDate);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6">Write to Your Future Self</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Letter Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="A message to my future self..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Unlock Date</label>
            <input
              type="date"
              value={unlockDate}
              onChange={(e) => setUnlockDate(e.target.value)}
              className="input-field"
              min={format(new Date(), 'yyyy-MM-dd')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Your Letter</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="textarea-calm"
              placeholder="Dear Future Me,..."
              rows={12}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button onClick={handleSubmit} className="btn-primary flex-1">
            Save Letter
          </button>
        </div>
      </div>
    </div>
  );
}

function ReadLetterModal({
  letter,
  onClose,
  onDelete,
  isUnlocked,
}: {
  letter: FutureLetter;
  onClose: () => void;
  onDelete: (id: string) => void;
  isUnlocked: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-neutral-800">{letter.title}</h2>
            <p className="text-sm text-neutral-600 mt-1">
              {isUnlocked ? 'Unlocked' : 'Locked'} • Opens {format(new Date(letter.unlock_date), 'MMM d, yyyy')}
            </p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          {isUnlocked ? (
            <div className="prose max-w-none">
              <p className="text-neutral-700 whitespace-pre-wrap">{letter.content}</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">🔒</span>
              <p className="text-neutral-600 text-lg mb-2">This letter is locked</p>
              <p className="text-neutral-500">
                Opens {formatDistanceToNow(new Date(letter.unlock_date), { addSuffix: true })}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">
            Close
          </button>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this letter?')) {
                onDelete(letter.id);
              }
            }}
            className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
