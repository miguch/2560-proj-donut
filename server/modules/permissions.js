const ADMIN = 'admin';
const TEACHER = 'teacher';
const STUDENT = 'student';

const STATIC_PERMISSIONS = {
  '/login': [],
  '/accountadded': [],
  '/students': [ADMIN],
  '/auth/user': [],
};

module.exports = STATIC_PERMISSIONS;
