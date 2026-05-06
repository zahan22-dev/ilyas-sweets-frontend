import { useMutation } from '@tanstack/react-query';
import { authService, LoginCredentials, RegisterData } from '@/lib/services/auth';
import { useRouter } from 'next/navigation';

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      authService.setToken(data.accessToken);
      router.push('/admin');
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (registerData: RegisterData) => authService.register(registerData),
  });
}

export function useLogout() {
  const router = useRouter();

  return () => {
    authService.removeToken();
    router.push('/admin/login');
  };
}

export function useAuth() {
  return {
    isAuthenticated: authService.isAuthenticated(),
    logout: useLogout(),
  };
}
