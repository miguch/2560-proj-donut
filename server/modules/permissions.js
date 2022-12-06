const ADMIN = 'admin';
const TEACHER = 'teacher';
const STUDENT = 'student';

const STATIC_PERMISSIONS = {
  '/login': [],
  '/account': [ADMIN],
  '/students': [ADMIN],
  '/auth/user': [],
  '/student': [ADMIN]
};

module.exports = STATIC_PERMISSIONS;
