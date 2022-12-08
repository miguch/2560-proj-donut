const ADMIN = 'admin';
const TEACHER = 'teacher';
const STUDENT = 'student';

const STATIC_PERMISSIONS = {
  '/account': [ADMIN],
  '/auth/user': [],
  '/student': [ADMIN],
  '/student_list': [ADMIN, TEACHER, STUDENT],
  '/teacher': [ADMIN],
  '/github/link': [TEACHER, STUDENT],
  '/course': [ADMIN, TEACHER],
  '/couldchose': [STUDENT],
  '/grade': [TEACHER],
  '/drop_course': [STUDENT],
  '/register_course': [STUDENT],
  '/havechosen': [STUDENT],
  '/courses_students':[TEACHER],
  "/withdraw": [TEACHER]
};
module.exports = STATIC_PERMISSIONS;
