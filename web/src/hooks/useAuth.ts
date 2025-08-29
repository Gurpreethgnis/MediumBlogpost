import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { api } from '../services/api';
import { User } from '../types';

interface AuthState {
  user: User | null;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
  });

  const queryClient = useQueryClient();

  // Mock authentication for development (remove this in production)
  useEffect(() => {
    // Simulate a mock user for development
    const mockUser: User = {
      id: 'mock-user-1',
      email: 'dr.schmidt@bayer.com',
      name: 'Dr. Anna Schmidt',
      avatar: null,
      role: 'ADMIN',
      isActive: true,
      lastLoginAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Simulate loading delay
    const timer = setTimeout(() => {
      setAuthState({ user: mockUser, loading: false });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Comment out the real API call for now
  /*
  // Check if user is authenticated
  const { data: user, isLoading } = useQuery(
    'user',
    async () => {
      const response = await api.get('/auth/me');
      return response.data.user;
    },
    {
      retry: false,
      onError: () => {
        setAuthState({ user: null, loading: false });
      },
      onSuccess: (data) => {
        setAuthState({ user: data, loading: false });
      },
    }
  );
  */

  // Login mutation
  const loginMutation = useMutation(
    async (credentials: { email: string; password: string }) => {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    },
    {
      onSuccess: (data) => {
        setAuthState({ user: data.user, loading: false });
        queryClient.setQueryData('user', data.user);
      },
    }
  );

  // Logout mutation
  const logoutMutation = useMutation(
    async () => {
      await api.post('/auth/logout');
    },
    {
      onSuccess: () => {
        setAuthState({ user: null, loading: false });
        queryClient.clear();
      },
    }
  );

  // Update user profile
  const updateProfileMutation = useMutation(
    async (updates: Partial<User>) => {
      const response = await api.put('/users/profile', updates);
      return response.data.user;
    },
    {
      onSuccess: (updatedUser) => {
        setAuthState({ user: updatedUser, loading: false });
        queryClient.setQueryData('user', updatedUser);
      },
    }
  );

  // Comment out for mock authentication
  /*
  useEffect(() => {
    if (!isLoading) {
      setAuthState({ user: user || null, loading: false });
    }
  }, [user, isLoading]);
  */

  return {
    user: authState.user,
    loading: authState.loading,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    isLoggingIn: loginMutation.isLoading,
    isLoggingOut: logoutMutation.isLoading,
    isUpdatingProfile: updateProfileMutation.isLoading,
  };
}
