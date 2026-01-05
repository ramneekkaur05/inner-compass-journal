'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import PageTransition from '@/components/ui/PageTransition';
import { getCurrentUser } from '@/lib/auth';
import { getAllJournalEntries } from '@/lib/db';
import type { JournalEntry } from '@/entities/JournalEntry';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

const moodScale = [
  { label: 'Excellent', value: 5, color: '#10b981', emoji: '😊' },
  { label: 'Good', value: 4, color: '#0ea5e9', emoji: '🙂' },
  { label: 'Neutral', value: 3, color: '#f59e0b', emoji: '😐' },
  { label: 'Challenging', value: 2, color: '#8b5cf6', emoji: '😔' },
  { label: 'Difficult', value: 1, color: '#dc2626', emoji: '😢' },
];

const COLORS = ['#10b981', '#0ea5e9', '#f59e0b', '#8b5cf6', '#dc2626'];

export default function InsightsPage() {
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
    await loadData(currentUser.id);
    setLoading(false);
  };

  const loadData = async (userId: string) => {
    const allEntries = await getAllJournalEntries(userId);
    setEntries(allEntries);
  };

  // Calculate statistics
  const totalEntries = entries.length;
  const currentMonth = entries.filter(e => {
    const entryDate = new Date(e.entry_date);
    const now = new Date();
    return entryDate >= startOfMonth(now) && entryDate <= endOfMonth(now);
  }).length;

  const totalTasks = entries.reduce((sum, e) => sum + e.checklist_items.length, 0);
  const completedTasks = entries.reduce((sum, e) => 
    sum + e.checklist_items.filter(item => item.completed).length, 0
  );
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const avgMood = entries.length > 0 
    ? entries
        .filter(e => e.mood)
        .reduce((sum, e) => {
          const moodValue = moodScale.find(m => m.label === e.mood)?.value || 3;
          return sum + moodValue;
        }, 0) / entries.filter(e => e.mood).length
    : 0;

  // Mood trend data (last 30 days)
  const moodTrendData = entries
    .filter(e => e.mood)
    .slice(0, 30)
    .reverse()
    .map(e => ({
      date: format(new Date(e.entry_date), 'MMM d'),
      mood: moodScale.find(m => m.label === e.mood)?.value || 3,
    }));

  // Task completion by day
  const taskCompletionData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const entry = entries.find(e => e.entry_date === dateStr);
    
    return {
      date: format(date, 'EEE'),
      completed: entry?.checklist_items.filter(item => item.completed).length || 0,
      total: entry?.checklist_items.length || 0,
    };
  });

  // Mood distribution
  const moodDistribution = moodScale.map(mood => ({
    name: mood.label,
    value: entries.filter(e => e.mood === mood.label).length,
    emoji: mood.emoji,
  })).filter(d => d.value > 0);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading insights...</p>
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
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-2">📊 Insights</h1>
              <p className="text-sm sm:text-base text-neutral-600">Track your progress and discover patterns</p>
            </div>

            {entries.length === 0 ? (
              <div className="card text-center py-16">
                <div className="text-6xl mb-4">📝</div>
                <h2 className="text-xl font-semibold text-neutral-800 mb-2">No Data Yet</h2>
                <p className="text-neutral-600">Start journaling to see your insights!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <div className="text-xs sm:text-sm text-green-700 font-medium mb-1">Task Completion</div>
                    <div className="text-2xl sm:text-3xl font-bold text-green-900">{completionRate}%</div>
                    <div className="text-[10px] sm:text-xs text-green-600 mt-1">{completedTasks}/{totalTasks} tasks</div>
                  </div>
                  
                  <div className="card bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                    <div className="text-xs sm:text-sm text-amber-700 font-medium mb-1">Avg Mood</div>
                    <div className="text-2xl sm:text-3xl font-bold text-amber-900">{avgMood.toFixed(1)}/5</div>
                    <div className="text-[10px] sm:text-xs text-amber-600 mt-1">{moodScale.find(m => Math.abs(m.value - avgMood) < 0.5)?.emoji || '😐'}</div>
                  </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Mood Trend Chart */}
                  <div className="card">
                    <h2 className="text-lg sm:text-xl font-semibold text-neutral-800 mb-4">Mood Trend (Last 30 Days)</h2>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={moodTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#737373" 
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis 
                          domain={[0, 6]} 
                          ticks={[1, 2, 3, 4, 5]} 
                          stroke="#737373"
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e5e5',
                            borderRadius: '8px',
                            fontSize: '14px'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="mood" 
                          stroke="#9333ea" 
                          strokeWidth={3}
                          dot={{ fill: '#9333ea', r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Mood Distribution Pie Chart */}
                  <div className="card">
                    <h2 className="text-lg sm:text-xl font-semibold text-neutral-800 mb-4">Mood Distribution</h2>
                    {moodDistribution.length > 0 ? (
                      <div className="flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              data={moodDistribution}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {moodDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-neutral-500">No mood data yet</div>
                    )}
                  </div>
                </div>

                {/* Task Completion Chart */}
                <div className="card">
                  <h2 className="text-lg sm:text-xl font-semibold text-neutral-800 mb-4">Weekly Task Completion</h2>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={taskCompletionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#737373"
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        stroke="#737373"
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e5e5',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      />
                      <Bar dataKey="completed" fill="#10b981" radius={[8, 8, 0, 0]} name="Completed" />
                      <Bar dataKey="total" fill="#e5e7eb" radius={[8, 8, 0, 0]} name="Total" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Mood Legend */}
                <div className="card">
                  <h2 className="text-lg sm:text-xl font-semibold text-neutral-800 mb-4">Mood Scale Reference</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                    {moodScale.map((mood) => (
                      <div
                        key={mood.label}
                        className="flex items-center gap-3 p-3 rounded-lg border-2"
                        style={{ 
                          borderColor: mood.color + '40',
                          backgroundColor: mood.color + '10'
                        }}
                      >
                        <div className="text-2xl">{mood.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-neutral-800 truncate">{mood.label}</div>
                          <div className="text-xs text-neutral-600">Score: {mood.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
