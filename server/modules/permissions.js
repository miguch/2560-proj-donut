const ADMIN = 'admin';
const TEACHER = 'teacher';
const STUDENT = 'student';

const STATIC_PERMISSIONS = {
  '/account': [ADMIN],
  '/auth/user': [],
  '/student': [ADMIN],
  '/teacher': [ADMIN],
  '/github/link': [TEACHER, STUDENT],
  '/course': [ADMIN, TEACHER],
};

module.exports = STATIC_PERMISSIONS;
