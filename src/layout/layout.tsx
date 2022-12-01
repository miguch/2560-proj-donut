import { Alert, Button, Spin } from '@arco-design/web-react';
import useUser from '../hooks/useUser';
import useFetch from '../hooks/useFetch';
import { LayoutContainer } from './layout.style';
import Header from './header';

export default function Layout() {
  const { user, error, isLoading } = useUser();

  const fetcher = useFetch();

  return (
    <Spin loading={isLoading || !!error} dot size={10}>
      <LayoutContainer>
        <Header></Header>
        {error && <Alert type="error" title={error.message}></Alert>}
      </LayoutContainer>
    </Spin>
  );
}
