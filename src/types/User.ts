export interface User {
  username: string;
  displayName: string;
  avatar: string;
  email: string;
  type: 'student' | 'instructor' | 'admin';
}
