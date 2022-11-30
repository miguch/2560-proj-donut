import { Button } from '@arco-design/web-react';
import useUser from '../hooks/useUser';
import useFetch from '../hooks/useFetch';

export default function Layout() {
  const { user, error, isLoading } = useUser();

  if (error && error.name) {
  }
  const fetcher = useFetch()

  return (
    <>
      <Button onClick={() => fetcher('/api')}>test</Button>
    </>
  );
}
