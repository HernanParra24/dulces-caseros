import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { authService } from '@/lib/api';
import { toast } from 'react-hot-toast';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<any>;
  deleteAccount: () => Promise<void>;
  checkAuth: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (data: {
    token: string;
    newPassword: string;
    confirmPassword: string;
  }) => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await authService.login({ email, password });
          console.log('Login successful:', response);
          set({
            user: response.user,
            token: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
          
          localStorage.setItem('token', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          localStorage.setItem('user', JSON.stringify(response.user));
          
          toast.success('Inicio de sesión exitoso');
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await authService.register(userData);
          set({ isLoading: false });
          toast.success(response.message);
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        console.log('Logging out user');
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        toast.success('Sesión cerrada exitosamente', { duration: 3000 });
      },

      updateProfile: async (data: Partial<User>) => {
        try {
          const response = await authService.updateProfile(data);
          const { user } = get();
          if (user) {
            const updatedUser = { ...user, ...response.user };
            set({
              user: updatedUser,
            });
            // Actualizar también el localStorage
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
          return response;
        } catch (error) {
          throw error;
        }
      },

      deleteAccount: async () => {
        try {
          await authService.deleteAccount();
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
          });
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
        } catch (error) {
          throw error;
        }
      },

      checkAuth: async () => {
        console.log('🔍 CheckAuth called');
        
        // Primero, siempre revisar localStorage
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        console.log('📦 LocalStorage check:', {
          hasToken: !!storedToken,
          hasUser: !!storedUser
        });
        
        if (storedToken && storedUser) {
          try {
            const user = JSON.parse(storedUser);
            console.log('✅ Restoring user from localStorage:', user);
            
            // Validar el token con el servidor y obtener información actualizada del usuario
            try {
              const response = await authService.getProfile();
              const updatedUser = response.user;
              console.log('🔄 User data updated from server:', updatedUser);
              
              // Actualizar localStorage con la información más reciente
              localStorage.setItem('user', JSON.stringify(updatedUser));
              
              set({
                user: updatedUser,
                token: storedToken,
                isAuthenticated: true,
              });
            } catch (serverError) {
              console.log('⚠️ Server validation failed, using cached user data');
              // Si falla la validación del servidor, usar los datos en caché
              set({
                user,
                token: storedToken,
                isAuthenticated: true,
              });
            }
            return;
          } catch (error) {
            console.error('❌ Error parsing stored user:', error);
            // Limpiar localStorage corrupto
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
          }
        }

        // Si no hay datos en localStorage, limpiar el estado
        console.log('🚫 No valid localStorage data, clearing state');
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      forgotPassword: async (email: string) => {
        set({ isLoading: true });
        try {
          const response = await authService.forgotPassword(email);
          set({ isLoading: false });
          toast.success(response.message);
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      resetPassword: async (data) => {
        set({ isLoading: true });
        try {
          const response = await authService.resetPassword(data);
          set({ isLoading: false });
          toast.success(response.message);
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        console.log('Auth store rehydrated:', state);
        if (state) {
          console.log('Rehydrated user:', state.user);
          console.log('Rehydrated token:', state.token);
          console.log('Rehydrated isAuthenticated:', state.isAuthenticated);
        }
      },
    }
  )
);
