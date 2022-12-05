import { Alert, Button, Message, Spin } from '@arco-design/web-react';
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
import React, { useEffect } from 'react';

export default function Layout({children}: {children?: JSX.Element}) {
  const { user, error, isLoading } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !user.type) {
      fetch('/api/auth/logoff');
      Message.warning(
        'No associated account, please signup first and link your GitHub account'
      );
      navigate('/login');
    }
  }, [user]);

  const fetcher = useFetch();

  return (
    <Spin loading={isLoading || !!error} dot size={10}>
      <LayoutContainer>
        <Header></Header>
        {error && <Alert type="error" title={error.message}></Alert>}
        <MainContainer>
          {children ? children : <Outlet></Outlet>}
        </MainContainer>
      </LayoutContainer>
    </Spin>
  );
}
