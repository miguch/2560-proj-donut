const ADMIN = 'admin';
const TEACHER = 'teacher';
const STUDENT = 'student';

const STATIC_PERMISSIONS = {
  '/account': [ADMIN],
  '/auth/user': [],
  '/student': [ADMIN],
  '/teacher': [ADMIN],
  '/course': [ADMIN, TEACHER],
};

module.exports = STATIC_PERMISSIONS;
