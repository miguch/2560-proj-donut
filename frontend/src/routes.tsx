import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from 'react-router-dom';
import Layout from './layout/layout';
import LoginPage from './pages/login/login';
import NotFoundPage from './pages/NotFoundPage';
import Onboarding from './pages/onboarding/onboarding';
import PageGuard from './pages/PageGuard';
import Students from './pages/Students/Students';
import Teachers from './pages/Teachers/Teachers';
import { User } from './types/User';

const ADMIN = 'admin';
const TEACHER = 'teacher';
const STUDENT = 'student';

export const baseRouter = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/onboarding',
        element: <Onboarding></Onboarding>,
      },
      {
        path: '/students',
        element: (
          <PageGuard allowedRoles={[ADMIN]}>
            <Students></Students>
          </PageGuard>
        ),
      },
      {
        path: '/teachers',
        element: (
          <PageGuard allowedRoles={[ADMIN]}>
            <Teachers></Teachers>
          </PageGuard>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/*',
    element: (
      <Layout>
        <NotFoundPage />
      </Layout>
    ),
  },
]);
