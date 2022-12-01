import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from 'react-router-dom';
import Layout from './layout/layout';
import LoginPage from './pages/login/login';

export const baseRouter = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
]);

export const mainRouter = createBrowserRouter([
  {
    path: '/',
    element: <></>
  }
]);

