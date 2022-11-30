import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from 'react-router-dom';
import Layout from './layout/layout';
import LoginPage from './pages/login/login';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
]);

export default router;
