import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from 'react-router-dom';
import Layout from './layout/layout';
import Accounts from './pages/Accounts/Accounts';
import Courses from './pages/Courses/Courses';
import LoginPage from './pages/login/login';
import NotFoundPage from './pages/NotFoundPage';
import Onboarding from './pages/onboarding/onboarding';
import PageGuard from './pages/PageGuard';
import Students from './pages/Students/Students';
import Teachers from './pages/Teachers/Teachers';
import CourseList from './pages/CoursesCouldChose/CoursesCouldChose';
import Enrollment from './pages/CoursesHaveChosen/CoursesHaveChosen';
import { User } from './types/User';
import Home from './layout/Home';
import CourseStudents from './pages/CourseStudents/CourseStudents';

const ADMIN = 'admin';
const TEACHER = 'teacher';
const STUDENT = 'student';

export const baseRouter = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // {
      //   path: '/onboarding',
      //   element: <Onboarding></Onboarding>,
      // },
      {
        path: '/',
        element: <Home></Home>,
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
      {
        path: '/accounts',
        element: (
          <PageGuard allowedRoles={[ADMIN]}>
            <Accounts></Accounts>
          </PageGuard>
        ),
      },
      {
        path: '/courses',
        element: (
          <PageGuard allowedRoles={[ADMIN, TEACHER]}>
            <Courses></Courses>
          </PageGuard>
        ),
      },
      {
        path: '/courselist',
        element: (
          <PageGuard allowedRoles={[STUDENT]}>
            <CourseList></CourseList>
          </PageGuard>
        ),
      },
      {
        path: '/enrollment',
        element: (
          <PageGuard allowedRoles={[STUDENT]}>
            <Enrollment></Enrollment>
          </PageGuard>
        ),
      },
      {
        path: '/courses_students/:course_ref_id',
        element: (
          <PageGuard allowedRoles={[TEACHER]}>
            <CourseStudents></CourseStudents>
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
