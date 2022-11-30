import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from 'react-router-dom';
import LoginPage from './pages/login/login';

const router = createBrowserRouter([
  {
    path: '/',
    element: <div></div>,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
]);

export default router;
