import { supabase } from './supabaseClient';
import type { User } from '@supabase/supabase-js';

export interface AuthResponse {
  user: User | null;
  error: Error | null;
}

/**
 * Sign up a new user with email and password
 */
export async function signUp(email: string, password: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    // Create user profile
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        user_id: data.user.id,
        email: data.user.email,
        timezone: 'Asia/Kolkata',
      });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Don't throw - let them login, we'll handle it in the app
      }
    }

    return { user: data.user, error: null };
  } catch (error) {
    console.error('Signup error:', error);
    return { user: null, error: error as Error };
  }
}

/**
 * Sign in an existing user with email and password
 */
export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Check if it's an email confirmation error
      if (error.message.includes('Email not confirmed')) {
        const confirmError = new Error(
          'Please confirm your email address before signing in. Check your inbox for the confirmation link we sent you.'
        );
        return { user: null, error: confirmError };
      }
      throw error;
    }

    return { user: data.user, error: null };
  } catch (error) {
    return { user: null, error: error as Error };
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
}

/**
 * Get the current user session
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
}

/**
 * Update user password
 */
export async function updatePassword(newPassword: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
}
