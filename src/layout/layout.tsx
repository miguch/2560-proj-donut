import { Alert, Button, Spin } from '@arco-design/web-react';
import useUser from '../hooks/useUser';
import useFetch from '../hooks/useFetch';
import { LayoutContainer, MainContainer } from './layout.style';
import Header from './header';
import {
  Outlet,
  Route,
  RouterProvider,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';

export default function Layout() {
  const { user, error, isLoading } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user?.type && location.pathname !== '/onboarding') {
    navigate('/onboarding');
  }

  const fetcher = useFetch();

  return (
    <Spin loading={isLoading || !!error} dot size={10}>
      <LayoutContainer>
        <Header></Header>
        {error && <Alert type="error" title={error.message}></Alert>}
        <MainContainer>
          <Outlet />
        </MainContainer>
      </LayoutContainer>
    </Spin>
  );
}
