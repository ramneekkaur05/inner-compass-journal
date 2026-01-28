'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/ui/PageTransition';
import { getCurrentUser } from '@/lib/auth';
import { getThoughts, createThought, updateThought, deleteThought } from '@/lib/db';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { format } from 'date-fns';

const philosophyQuotes = [
  {
    text: "The unexamined life is not worth living.",
    author: "Socrates"
  },
  {
    text: "Thinking is the talking of the soul with itself.",
    author: "Plato"
  },
  {
    text: "I think, therefore I am.",
    author: "René Descartes"
  },
  {
    text: "The mind is everything. What you think, you become.",
    author: "Buddha"
  },
  {
    text: "All that we are is the result of what we have thought.",
    author: "Buddha"
  },
  {
    text: "Thought is the blossom; language is the bud; action is the fruit.",
    author: "Ralph Waldo Emerson"
  },
  {
    text: "We are dying from overthinking. We are slowly killing ourselves by drowning in our own thoughts.",
    author: "Warsan Shire"
  },
  {
    text: "The greatest ideas are the simplest things.",
    author: "William Boyd"
  },
  {
    text: "In the mind, there is no judgement between events. It just perceives events as they are.",
    author: "Ramaji"
  },
  {
    text: "Knowing yourself is the beginning of all wisdom.",
    author: "Aristotle"
  },
  {
    text: "The mind is a universe and if we explore it fully, we may find that we can create universes.",
    author: "Henry Reed"
  },
  {
    text: "An unwritten life is not worth examining.",
    author: "Socrates"
  },
  {
    text: "Thoughts are the shadows of our feelings.",
    author: "Virginia Woolf"
  },
  {
    text: "The true sign of intelligence is not knowledge but imagination.",
    author: "Albert Einstein"
  },
  {
    text: "Writing is the painting of the voice.",
    author: "Voltaire"
  }
];

export default function ThoughtsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [thoughts, setThoughts] = useState<any[]>([]);
  const [currentThought, setCurrentThought] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  const [isWriting, setIsWriting] = useState(false);
  const [openLetterId, setOpenLetterId] = useState<string | null>(null);
  const [editingThoughtId, setEditingThoughtId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [isFoldingPage, setIsFoldingPage] = useState(false);
  const [dailyQuote, setDailyQuote] = useState(philosophyQuotes[0]);

  useEffect(() => {
    initializePage();
    // Set a random quote when the page loads
    const randomIndex = Math.floor(Math.random() * philosophyQuotes.length);
    setDailyQuote(philosophyQuotes[randomIndex]);
  }, []);

  const initializePage = async () => {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }
    setUser(currentUser);
    loadThoughts(currentUser.id);
    setLoading(false);
  };

  const loadThoughts = async (userId: string) => {
    const userThoughts = await getThoughts(userId);
    setThoughts(userThoughts);
  };

  const handleSave = async () => {
    if (!user || !currentThought.trim()) {
      console.log('Save blocked: user or thought empty');
      return;
    }

    try {
      const newThought = await createThought(user.id, currentTitle.trim() || 'Untitled Thought', currentThought.trim());
      if (newThought) {
        setThoughts([newThought, ...thoughts]);
        setCurrentThought('');
        setCurrentTitle('');
        setIsWriting(false);
      } else {
        console.error('Failed to create thought - no data returned');
      }
    } catch (error) {
      console.error('Error saving thought:', error);
    }
  };

  const handleDelete = async (id: string) => {
    const success = await deleteThought(id);
    if (success) {
      setThoughts(thoughts.filter(t => t.id !== id));
      setOpenLetterId(null);
    }
  };

  const handleUpdate = async (id: string, title: string, content: string) => {
    console.log('=== UPDATE THOUGHT ===');
    console.log('ID:', id);
    console.log('Title:', title);
    console.log('Content:', content);
    
    const success = await updateThought(id, title, content);
    console.log('UpdateThought result:', success);
    
    if (success) {
      setThoughts(thoughts.map(t => 
        t.id === id ? { ...t, title, content, updated_at: new Date().toISOString() } : t
      ));
      return true;
    }
    return false;
  };

  const handleStartEdit = (thoughtId: string, title: string, content: string) => {
    setEditingThoughtId(thoughtId);
    setEditTitle(title);
    setEditContent(content);
    setOpenLetterId(null);
  };

  const handleSaveEdit = async () => {
    console.log('=== SAVE EDIT CLICKED ===');
    console.log('editingThoughtId:', editingThoughtId);
    console.log('editTitle:', editTitle);
    console.log('editContent:', editContent);
    
    if (!editingThoughtId || !editContent.trim()) {
      console.log('Blocked: missing id or empty content');
      return;
    }

    setIsFoldingPage(true);

    const success = await handleUpdate(editingThoughtId, editTitle.trim() || 'Untitled Thought', editContent.trim());
    console.log('Update success:', success);
    
    if (success) {
      // Wait for folding animation to complete before closing (now 0.15s total)
      setTimeout(() => {
        setEditingThoughtId(null);
        setEditTitle('');
        setEditContent('');
        setIsFoldingPage(false);
      }, 150);
    }
  };

  const handleCancelEdit = () => {
    setEditingThoughtId(null);
    setEditContent('');
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading thoughts...</p>
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
            <h1 className="text-3xl font-semibold text-neutral-900 mb-2 tracking-tight font-playfair">
              💭 Thoughts & Ideas
            </h1>
            <p className="text-neutral-600 text-base">A space for your wandering thoughts</p>
          </div>

          {/* Daily Philosophy Quote */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 p-6 rounded-2xl text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(212, 165, 116, 0.1) 0%, rgba(232, 220, 196, 0.15) 100%)',
              border: '2px solid var(--boho-sand)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <p className="text-lg font-playfair text-neutral-800 italic mb-3" style={{ lineHeight: '1.8' }}>
              "{dailyQuote.text}"
            </p>
            <p className="text-sm font-semibold text-neutral-600">
              — {dailyQuote.author}
            </p>
          </motion.div>

          {/* Writing Section */}
          {!isWriting ? (
            <motion.button
              onClick={() => setIsWriting(true)}
              className="btn-primary mb-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ✍️ Write a New Thought
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="card relative overflow-hidden" style={{ 
                background: 'linear-gradient(135deg, #FFF9E6 0%, #F5F1E8 100%)',
                borderColor: '#D4A574'
              }}>
                {/* Title Input */}
                <input
                  type="text"
                  value={currentTitle}
                  onChange={(e) => setCurrentTitle(e.target.value)}
                  placeholder="Give your thought a title..."
                  className="w-full bg-transparent border-none outline-none resize-none relative z-10 text-neutral-800 focus:outline-none focus:ring-0 text-lg font-semibold mb-4 font-playfair"
                  style={{
                    fontSize: '1.4rem',
                    fontWeight: '600'
                  }}
                />
                
                <div className="border-b border-neutral-300 mb-4"></div>

                {/* Notebook lines background */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(transparent, transparent 39px, #E8DCC4 39px, #E8DCC4 40px)',
                    backgroundSize: '100% 40px',
                    opacity: 0.5
                  }}
                />
                
                {/* Red margin line */}
                <div 
                  className="absolute top-0 bottom-0 left-16 w-0.5 bg-red-300 pointer-events-none"
                  style={{ opacity: 0.4 }}
                />

                <textarea
                  value={currentThought}
                  onChange={(e) => setCurrentThought(e.target.value)}
                  className="w-full bg-transparent border-none outline-none resize-none relative z-10 handwritten text-neutral-800 focus:outline-none focus:ring-0"
                  style={{ 
                    fontSize: '1.6rem', 
                    lineHeight: '2.5rem',
                    minHeight: '400px',
                    paddingLeft: '80px',
                    paddingTop: '10px',
                    boxShadow: 'none'
                  }}
                  placeholder="Let your thoughts flow..."
                />

                <div className="flex gap-3 justify-end mt-4 relative z-20" style={{ pointerEvents: 'auto' }}>
                  <button
                    onClick={() => {
                      setIsWriting(false);
                      setCurrentThought('');
                    }}
                    className="btn-secondary"
                    style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="btn-primary"
                    disabled={!currentThought.trim()}
                    style={{ cursor: !currentThought.trim() ? 'not-allowed' : 'pointer', pointerEvents: 'auto' }}
                  >
                    💾 Save Thought
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Edit Section */}
          {editingThoughtId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isFoldingPage ? { 
                opacity: 0, 
                y: 100,
                scale: 0.95,
                rotateX: -20
              } : { opacity: 1, y: 0 }}
              transition={isFoldingPage ? { duration: 0.15, ease: "easeIn" } : undefined}
              className="mb-8"
              style={{ transformPerspective: '1000px', transformOrigin: 'center top' }}
            >
              <div className="card relative overflow-hidden" style={{ 
                background: 'linear-gradient(135deg, #FFF9E6 0%, #F5F1E8 100%)',
                borderColor: '#D4A574'
              }}>
                {/* Folding effect divs - Top and Bottom halves */}
                {isFoldingPage && (
                  <>
                    {/* Top half - folds down */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-b from-stone-100 to-transparent pointer-events-none"
                      initial={{ rotateX: 0, transformPerspective: 1000 }}
                      animate={{ rotateX: 90, transformPerspective: 1000 }}
                      transition={{ duration: 0.1, ease: "easeIn" }}
                      style={{ 
                        transformOrigin: 'center center',
                        zIndex: 50,
                        height: '50%'
                      }}
                    />
                    {/* Bottom half - folds up */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-stone-100 to-transparent pointer-events-none"
                      initial={{ rotateX: 0, transformPerspective: 1000 }}
                      animate={{ rotateX: -90, transformPerspective: 1000 }}
                      transition={{ duration: 0.1, ease: "easeIn" }}
                      style={{ 
                        transformOrigin: 'center center',
                        zIndex: 50,
                        top: '50%',
                        height: '50%'
                      }}
                    />
                  </>
                )}

                <h2 className="text-xl font-semibold text-neutral-800 font-playfair mb-4">Edit Your Thought</h2>
                
                {/* Title Input */}
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Edit your title..."
                  className="w-full bg-transparent border-none outline-none resize-none relative z-10 text-neutral-800 focus:outline-none focus:ring-0 text-lg font-semibold mb-4 font-playfair"
                  style={{
                    fontSize: '1.4rem',
                    fontWeight: '600'
                  }}
                />
                
                <div className="border-b border-neutral-300 mb-4"></div>

                {/* Notebook lines background */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(transparent, transparent 39px, #E8DCC4 39px, #E8DCC4 40px)',
                    backgroundSize: '100% 40px',
                    opacity: 0.5
                  }}
                />
                
                {/* Red margin line */}
                <div 
                  className="absolute top-0 bottom-0 left-16 w-0.5 bg-red-300 pointer-events-none"
                  style={{ opacity: 0.4 }}
                />

                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full bg-transparent border-none outline-none resize-none relative z-10 handwritten text-neutral-800 focus:outline-none focus:ring-0"
                  style={{ 
                    fontSize: '1.6rem', 
                    lineHeight: '2.5rem',
                    minHeight: '400px',
                    paddingLeft: '80px',
                    paddingTop: '10px',
                    boxShadow: 'none'
                  }}
                  placeholder="Edit your thought..."
                />

                <div className="flex gap-3 justify-end mt-4 relative z-20" style={{ pointerEvents: 'auto' }}>
                  <button
                    onClick={handleCancelEdit}
                    className="btn-secondary"
                    style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                    disabled={isFoldingPage}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="btn-primary"
                    disabled={!editContent.trim() || isFoldingPage}
                    style={{ cursor: !editContent.trim() || isFoldingPage ? 'not-allowed' : 'pointer', pointerEvents: 'auto' }}
                  >
                    💾 Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Full Screen Letter View Modal */}
        {openLetterId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenLetterId(null)}
            className="fixed inset-0 bg-transparent backdrop-blur-sm z-50 flex items-center justify-center"
            style={{ pointerEvents: 'auto' }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full h-full max-w-4xl max-h-screen bg-transparent rounded-2xl overflow-y-auto flex flex-col relative z-50"
              style={{ pointerEvents: 'auto' }}
            >
              {/* Close Button */}
              <motion.button
                onClick={() => setOpenLetterId(null)}
                className="absolute top-6 right-6 p-2 hover:bg-neutral-100 rounded-full transition-colors z-60"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{ pointerEvents: 'auto' }}
              >
                <svg className="w-6 h-6 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>

              {/* Letter Content - Full Screen */}
              <div className="flex-1 p-8 sm:p-12 overflow-y-auto">
                <div 
                  className="card relative overflow-hidden max-w-2xl mx-auto"
                  style={{
                    background: 'linear-gradient(135deg, #FFF9E6 0%, #F5F1E8 100%)',
                    borderColor: '#D4A574',
                  }}
                >
                  {/* Notebook lines */}
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(transparent, transparent 24px, #E8DCC4 24px, #E8DCC4 25px)',
                      backgroundSize: '100% 25px',
                      opacity: 0.3
                    }}
                  />

                  <div className="relative z-10">
                    {/* Header with date and actions */}
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="text-2xl font-semibold text-neutral-800 font-playfair mb-2">
                          {thoughts.find(t => t.id === openLetterId)?.title || 'Untitled Thought'}
                        </h2>
                        <p className="text-sm text-neutral-600">
                          {openLetterId && thoughts.find(t => t.id === openLetterId) && format(new Date(thoughts.find(t => t.id === openLetterId)!.created_at), 'MMMM d, yyyy')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const thought = thoughts.find(t => t.id === openLetterId);
                            if (thought) {
                              handleStartEdit(thought.id, thought.title || 'Untitled Thought', thought.content);
                              setOpenLetterId(null);
                            }
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            if (openLetterId) {
                              handleDelete(openLetterId);
                              setOpenLetterId(null);
                            }
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-b border-neutral-300 mb-6"></div>

                    {/* Letter content */}
                    <div 
                      className="handwritten text-neutral-800 whitespace-pre-wrap leading-relaxed"
                      style={{
                        fontSize: '1.5rem',
                        lineHeight: '2.2rem',
                        paddingLeft: '20px'
                      }}
                    >
                      {thoughts.find(t => t.id === openLetterId)?.content}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Thoughts History Section - Completely Separate */}
        {thoughts.length > 0 && (
          <div className="max-w-5xl mx-auto px-8 py-0">
            <div className="border-t border-neutral-200 mb-3"></div>
            <h2 className="text-xl font-semibold text-neutral-800 font-playfair mb-6">History</h2>
            
            {/* Letters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {thoughts.map((thought) => (
                <ThoughtLetter
                  key={thought.id}
                  thought={thought}
                  isOpen={openLetterId === thought.id}
                  onToggle={() => setOpenLetterId(openLetterId === thought.id ? null : thought.id)}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                  onEdit={handleStartEdit}
                />
              ))}
            </div>
          </div>
        )}

        {thoughts.length === 0 && (
          <div className="max-w-5xl mx-auto px-8">
            <div className="border-t border-neutral-200 my-12"></div>
            <div className="text-center py-16">
              <p className="text-neutral-500 text-lg">
                No thoughts saved yet. Start writing!
              </p>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}

function ThoughtLetter({
  thought,
  isOpen,
  onToggle,
  onDelete,
  onUpdate,
  onEdit
}: { 
  thought: any; 
  isOpen: boolean; 
  onToggle: () => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, title: string, content: string) => Promise<boolean>;
  onEdit: (id: string, title: string, content: string) => void;
}) {
  return (
    <motion.div
      layout
      className="relative cursor-pointer"
      onClick={onToggle}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        zIndex: isOpen ? 10 : 1
      }}
    >
      {/* Envelope Back */}
      <motion.div
        className="relative"
        style={{
          background: 'linear-gradient(135deg, #E8DCC4 0%, #D4A574 100%)',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: isOpen ? '0 8px 24px rgba(0,0,0,0.2)' : '0 4px 12px rgba(0,0,0,0.1)',
          minHeight: '180px'
        }}
        animate={{
          minHeight: '180px',
          scale: isOpen ? 1 : 1
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {/* Envelope Flap - Animates open */}
        <motion.div
          className="absolute top-0 left-0 right-0 overflow-hidden pointer-events-none"
          style={{
            height: '60px',
            zIndex: 20,
            transformOrigin: 'top center',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px'
          }}
          animate={{
            rotateX: isOpen ? -180 : 0,
            y: isOpen ? -60 : 0
          }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <div className="w-full h-full relative" style={{
            background: 'linear-gradient(135deg, #D4A574 0%, #C89F81 100%)',
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)'
          }}>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl">
              🌻
            </div>
          </div>
        </motion.div>

        {/* Letter Content */}
        <AnimatePresence mode="wait">
          {!isOpen && (
            <motion.div
              key="preview"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="text-center relative z-10"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '130px'
              }}
            >
              <div className="text-5xl mb-3">✉️</div>
              <p className="text-neutral-800 font-semibold font-playfair text-lg mb-1 line-clamp-2">
                {thought.title || 'Untitled Thought'}
              </p>
              <p className="text-neutral-700 text-sm">
                {format(new Date(thought.created_at), 'MMM d, yyyy')}
              </p>
              <p className="text-neutral-600 text-xs mt-2 italic">
                Click to open
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
