'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageTransition from '@/components/ui/PageTransition';
import { getCurrentUser, signOut } from '@/lib/auth';
import { getUserProfile, updateUserProfile } from '@/lib/db';
import type { UserProfile } from '@/entities/UserProfile';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);

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
    await loadProfile(currentUser.id);
    setLoading(false);
  };

  const loadProfile = async (userId: string) => {
    const userProfile = await getUserProfile(userId);
    setProfile(userProfile);
  };

  const autoSave = (updates: Partial<UserProfile>) => {
    if (!user || !profile) return;

    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    const timer = setTimeout(async () => {
      await updateUserProfile(user.id, updates);
    }, 800);

    setAutoSaveTimer(timer);
  };

  const handleFieldChange = (field: keyof UserProfile, value: string) => {
    if (!profile) return;
    const updatedProfile = { ...profile, [field]: value };
    setProfile(updatedProfile);
    autoSave({ [field]: value });
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/auth/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600 mx-auto mb-4"></div>
          <p className="text-neutral-600 text-sm">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <UserNotRegisteredError />;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-stone-50">
        <div className="max-w-6xl mx-auto px-6 py-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-neutral-900 mb-2 tracking-tight">Settings</h1>
            <p className="text-neutral-600 text-base">Personalize your journaling experience</p>
          </div>

          {/* Profile Section */}
          <div className="card mb-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-6 tracking-tight">Profile Information</h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile.email}
                  className="input-field bg-neutral-100 cursor-not-allowed"
                  disabled
                />
                <p className="text-xs text-neutral-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Nickname
                </label>
                <input
                  type="text"
                  value={profile.nickname || ''}
                  onChange={(e) => handleFieldChange('nickname', e.target.value)}
                  className="input-field"
                  placeholder="How should we call you?"
                  style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Vision Statement
                </label>
                <textarea
                  value={profile.vision_statement || ''}
                  onChange={(e) => handleFieldChange('vision_statement', e.target.value)}
                  className="textarea-calm"
                  placeholder="Your personal vision and mission..."
                  rows={4}
                  style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Current Identity Focus
                </label>
                <textarea
                  value={profile.current_identity_focus || ''}
                  onChange={(e) => handleFieldChange('current_identity_focus', e.target.value)}
                  className="textarea-calm"
                  placeholder="What identity are you cultivating?"
                  rows={2}
                  style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10, height: 'auto', minHeight: '100px', maxHeight: '200px' }}
                />
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="card mb-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-6 tracking-tight">Preferences</h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Default Mood Baseline
                </label>
                <select
                  value={profile.mood_baseline || 'Neutral'}
                  onChange={(e) => handleFieldChange('mood_baseline', e.target.value)}
                  className="input-field"
                  style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Neutral">Neutral</option>
                  <option value="Challenging">Challenging</option>
                  <option value="Difficult">Difficult</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Timezone
                </label>
                <select
                  value={profile.timezone}
                  onChange={(e) => handleFieldChange('timezone', e.target.value)}
                  className="input-field"
                  style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="America/Phoenix">Arizona Time (AZ)</option>
                  <option value="America/Anchorage">Alaska Time (AK)</option>
                  <option value="Pacific/Honolulu">Hawaii Time (HT)</option>
                  <option value="Europe/London">London (GMT)</option>
                  <option value="Europe/Paris">Paris (CET)</option>
                  <option value="Asia/Kolkata">India (IST)</option>
                  <option value="Asia/Tokyo">Tokyo (JST)</option>
                  <option value="Australia/Sydney">Sydney (AEST)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Auto-save indicator */}
          <div className="text-center mb-8">
            <p className="text-sm text-neutral-500">✓ All changes are automatically saved</p>
          </div>

          {/* Logout Button */}
          <div className="card border-neutral-300 bg-neutral-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-neutral-900 mb-1">Sign Out</h3>
                <p className="text-sm text-neutral-600">
                  Log out of your account on this device
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="px-6 py-2.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-medium text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
