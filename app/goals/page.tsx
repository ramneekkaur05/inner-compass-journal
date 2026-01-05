'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import PageTransition from '@/components/ui/PageTransition';
import { getCurrentUser } from '@/lib/auth';
import { getAllJournalEntries } from '@/lib/db';
import type { JournalEntry } from '@/entities/JournalEntry';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

export default function GoalsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<JournalEntry[]>([]);

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
    loadData(currentUser.id);
    setLoading(false);
  };

  const loadData = async (userId: string) => {
    const allEntries = await getAllJournalEntries(userId);
    const nonEmptyEntries = allEntries.filter(hasContent);
    setEntries(nonEmptyEntries);
  };

  const hasContent = (entry: JournalEntry) => {
    const textFields = [entry.daily_recap, entry.gratitude, entry.goals_desires, entry.mood];
    const hasText = textFields.some((field) => field && field.trim().length > 0);
    const hasChecklist = entry.checklist_items && entry.checklist_items.length > 0;
    return hasText || hasChecklist;
  };

  const calculateStats = () => {
    const totalEntries = entries.length;
    const totalTasks = entries.reduce((sum, entry) => sum + entry.checklist_items.length, 0);
    const completedTasks = entries.reduce(
      (sum, entry) => sum + entry.checklist_items.filter((item) => item.completed).length,
      0
    );
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return { totalEntries, totalTasks, completedTasks, completionRate };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading your progress...</p>
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
        <div className="max-w-7xl mx-auto px-8 py-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-neutral-900 mb-2 tracking-tight">Goals & Progress</h1>
            <p className="text-neutral-600 text-base">Track your objectives and progress</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                {stats.totalEntries}
              </div>
              <p className="text-neutral-600">Journal Entries</p>
            </div>

            <div className="card text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                {stats.completedTasks}
              </div>
              <p className="text-neutral-600">Tasks Completed</p>
            </div>

            <div className="card text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                {stats.totalTasks}
              </div>
              <p className="text-neutral-600">Total Tasks</p>
            </div>

            <div className="card text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                {stats.completionRate}%
              </div>
              <p className="text-neutral-600">Completion Rate</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="card mb-8">
            <h2 className="text-xl font-semibold text-neutral-800 mb-4">Overall Progress</h2>
            <div className="w-full bg-neutral-200 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-500"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
            <p className="text-sm text-neutral-600 mt-2">
              {stats.completedTasks} of {stats.totalTasks} tasks completed
            </p>
          </div>

          {/* Timeline */}
          <div className="card">
            <h2 className="text-xl font-semibold text-neutral-800 mb-6">Recent Entries</h2>
            <div className="space-y-4">
              {entries.slice(0, 10).map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-neutral-800">
                      {format(new Date(entry.entry_date), 'EEEE, MMM d, yyyy')}
                    </span>
                    {entry.mood && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold text-neutral-700 bg-white/80 border border-purple-100 rounded-full">
                        {entry.mood}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">Daily Goals</p>
                      <p className="text-neutral-700 text-sm">
                        {entry.goals_desires?.trim() || 'No goals written for this day.'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">Work Done (tasks)</p>
                      {entry.checklist_items.length > 0 ? (
                        <div className="text-sm text-neutral-700">
                          {entry.checklist_items.filter((item) => item.completed).length}/
                          {entry.checklist_items.length} tasks completed
                        </div>
                      ) : (
                        <p className="text-sm text-neutral-500">No tasks logged for this day.</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {entries.length === 0 && (
              <div className="text-center py-8">
                <p className="text-neutral-500">Start journaling to see your progress here!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}


