import type { User } from '@/types';
import useAuth from '@/components/auth/use-auth';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import client from './client';
import { API_ENDPOINTS } from './client/endpoints';

export function useMe() {
  const { isAuthorized, getAuthPermissions } = useAuth();
  const { data, isLoading, error } = useQuery<User, Error>(
    [API_ENDPOINTS.USERS_ME],
    client.users.me,
    {
      enabled: isAuthorized,
    }
  );
  const permissions: string [] = getAuthPermissions()
  return {
    me: data,
    isLoading,
    error,
    isAuthorized,
    permissions
  };
}

export function useLogout() {
  const { unauthorize } = useAuth();
  const queryClient = useQueryClient();
  return useMutation(client.users.logout, {
    onSuccess: () => {
      unauthorize();
      queryClient.resetQueries(API_ENDPOINTS.USERS_ME);
    },
  });
}

export const useConfirmEmail = () => {
  const { mutate: confirmEmail, isLoading, isError, data, error } = useMutation(
    ({ userId, token }: { userId: string; token: string }) =>
      client.users.confirmEmail({ user_id: userId, token }),
    {
      onSuccess: (response) => {
        console.log('Email confirmed successfully:', response);
      },
      onError: (error) => {
        console.error('Email confirmation failed:', error);
      },
    }
  );

  return {
    confirmEmail,
    isLoading,
    isError,
    data,
    error,
  };
};
