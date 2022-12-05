import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from 'react-router-dom';
import Layout from './layout/layout';
import LoginPage from './pages/login/login';
import Onboarding from './pages/onboarding/onboarding';
import Students from './pages/Students/Students';

export const baseRouter = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/onboarding',
        element: <Onboarding></Onboarding>
      },
      {
        path: '/students',
        element: <Students></Students>
      }
    ]
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
]);

