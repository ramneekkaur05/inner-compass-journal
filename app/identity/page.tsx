'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import PageTransition from '@/components/ui/PageTransition';
import { getCurrentUser } from '@/lib/auth';
import {
  getIdentityStatements,
  createIdentityStatement,
  updateIdentityStatement,
  deleteIdentityStatement,
} from '@/lib/db';
import type { IdentityStatement } from '@/entities/IdentityStatement';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

const sections = [
  {
    key: 'who_i_am_becoming' as const,
    title: 'Who I Am Becoming',
    icon: '🦋',
    placeholder: 'I am becoming someone who...',
  },
  {
    key: 'core_values' as const,
    title: 'Core Values',
    icon: '💎',
    placeholder: 'I value...',
  },
  {
    key: 'empowering_beliefs' as const,
    title: 'Empowering Beliefs',
    icon: '✨',
    placeholder: 'I believe that...',
  },
  {
    key: 'identity_habits' as const,
    title: 'Identity Habits',
    icon: '🌱',
    placeholder: 'I am someone who regularly...',
  },
];

export default function IdentityPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statements, setStatements] = useState<IdentityStatement[]>([]);
  const [newStatements, setNewStatements] = useState<Record<string, string>>({});

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
    loadStatements(currentUser.id);
    setLoading(false);
  };

  const loadStatements = async (userId: string) => {
    const identityStatements = await getIdentityStatements(userId);
    setStatements(identityStatements);
  };

  const handleAddStatement = async (section: IdentityStatement['section']) => {
    if (!user || !newStatements[section]?.trim()) return;

    const orderIndex = statements.filter((s) => s.section === section).length;

    const newStatement = await createIdentityStatement(user.id, {
      section,
      content: newStatements[section].trim(),
      order_index: orderIndex,
    });

    if (newStatement) {
      setStatements([...statements, newStatement]);
      setNewStatements({ ...newStatements, [section]: '' });
    }
  };

  const handleUpdateStatement = async (id: string, content: string) => {
    if (!content.trim()) return;
    
    const success = await updateIdentityStatement(id, { content });
    if (success) {
      setStatements(
        statements.map((s) => (s.id === id ? { ...s, content } : s))
      );
    }
  };

  const handleDeleteStatement = async (id: string) => {
    const success = await deleteIdentityStatement(id);
    if (success) {
      setStatements(statements.filter((s) => s.id !== id));
    }
  };

  const getStatementsForSection = (section: IdentityStatement['section']) => {
    return statements.filter((s) => s.section === section);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading your identity...</p>
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
            <h1 className="text-3xl font-semibold text-neutral-900 mb-2 tracking-tight">Identity</h1>
            <p className="text-neutral-600 text-base">Explore and develop your core identity</p>
          </div>

          {/* Sections Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sections.map((section) => (
              <div key={section.key} className="card">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{section.icon}</span>
                  <h2 className="text-xl font-semibold text-neutral-800">{section.title}</h2>
                </div>

                {/* Existing Statements */}
                <div className="space-y-3 mb-4">
                  {getStatementsForSection(section.key).map((statement) => (
                    <StatementItem
                      key={statement.id}
                      statement={statement}
                      onUpdate={handleUpdateStatement}
                      onDelete={handleDeleteStatement}
                    />
                  ))}
                </div>

                {/* Add New Statement */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newStatements[section.key] || ''}
                    onChange={(e) =>
                      setNewStatements({ ...newStatements, [section.key]: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddStatement(section.key);
                      }
                    }}
                    placeholder={section.placeholder}
                    className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none"
                  />
                  <button
                    onClick={() => handleAddStatement(section.key)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Auto-save indicator */}
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-500">✓ All changes are automatically saved</p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

function StatementItem({
  statement,
  onUpdate,
  onDelete,
}: {
  statement: IdentityStatement;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(statement.content);

  useEffect(() => {
    setContent(statement.content);
  }, [statement.content]);

  const handleBlur = () => {
    setIsEditing(false);
    if (content.trim() && content !== statement.content) {
      onUpdate(statement.id, content);
    } else if (!content.trim()) {
      setContent(statement.content);
    }
  };

  return (
    <motion.div 
      className="flex items-start gap-3 group p-3 rounded-lg transition-all duration-300"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ 
        x: 4,
        backgroundColor: 'rgba(139, 157, 131, 0.1)'
      }}
      style={{
        background: 'rgba(255, 255, 255, 0.5)',
        position: 'relative',
        zIndex: 15,
        pointerEvents: 'auto'
      }}
    >
      <span className="text-purple-600 mt-1">•</span>
      
      {isEditing ? (
        <motion.input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleBlur();
            if (e.key === 'Escape') {
              setContent(statement.content);
              setIsEditing(false);
            }
          }}
          className="flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 font-medium handwritten min-w-0"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderColor: 'var(--boho-sage)',
            color: 'var(--boho-rust)',
            fontSize: '1.35rem',
            position: 'relative',
            zIndex: 20,
            pointerEvents: 'auto'
          }}
          autoFocus
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        />
      ) : (
        <motion.span
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          className="flex-1 cursor-pointer font-medium handwritten transition-all duration-200 break-words"
          style={{
            fontSize: '1.35rem',
            color: 'var(--boho-rust)',
            position: 'relative',
            zIndex: 15,
            lineHeight: '1.6',
            fontFamily: 'Caveat, cursive',
            fontWeight: '500'
          }}
          whileHover={{ opacity: 0.8 }}
        >
          {statement.content}
        </motion.span>
      )}

      <motion.button
        onClick={() => onDelete(statement.id)}
        className="opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
        style={{
          color: 'var(--boho-rust)',
          cursor: 'pointer',
          position: 'relative',
          zIndex: 20
        }}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </motion.button>
    </motion.div>
  );
}
