// hooks/useLogin.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UsersService } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export const useLogin = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: UsersService.login,
    onSuccess: ({ user, token }) => {
      login(token, user);
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  return () => {
    logout();
    queryClient.clear(); // wipe cached server data
  };
};