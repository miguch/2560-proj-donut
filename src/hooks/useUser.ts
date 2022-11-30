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
  const { data, error } = useSWR(
    '/api/user',
    fetcher
  );

  return {
    user: data,
    isLoading: !error && !data,
    error: error,
  };
}
