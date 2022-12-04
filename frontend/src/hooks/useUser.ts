import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';
import { User } from '../types/User';
import useFetch from './useFetch';

export default function useUser(): {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
} {
  const fetcher = useFetch();
  const { data, error } = useSWR('/api/auth/user', fetcher);

  if (data && data.status !== 200) {
    return {
      user: null,
      isLoading: false,
      error: new Error(data.message),
    };
  }

  return {
    user: data?.data,
    isLoading: !error && !data,
    error: error,
  };
}
