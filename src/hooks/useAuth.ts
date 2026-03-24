import { useState, useEffect, useCallback } from 'react';
import type { Models } from 'appwrite';
import { account, ID } from '@/lib/appwrite';

interface AuthState {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  const getUser = useCallback(async () => {
    try {
      const user = await account.get();
      setState({ user, loading: false, error: null });
    } catch {
      setState({ user: null, loading: false, error: null });
    }
  }, []);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const login = async (email: string, password: string) => {
    try {
      setState(s => ({ ...s, loading: true, error: null }));
      await account.createEmailPasswordSession(email, password);
      await getUser();
      return { success: true };
    } catch (err: any) {
      const msg = err?.message || 'Login failed. Please check your credentials.';
      setState(s => ({ ...s, loading: false, error: msg }));
      return { success: false, error: msg };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setState(s => ({ ...s, loading: true, error: null }));
      await account.create(ID.unique(), email, password, name);
      await account.createEmailPasswordSession(email, password);
      await getUser();
      return { success: true };
    } catch (err: any) {
      const msg = err?.message || 'Registration failed. Please try again.';
      setState(s => ({ ...s, loading: false, error: msg }));
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
      setState({ user: null, loading: false, error: null });
    } catch {
      setState(s => ({ ...s, error: 'Logout failed' }));
    }
  };

  return { ...state, login, register, logout, refreshUser: getUser };
};
