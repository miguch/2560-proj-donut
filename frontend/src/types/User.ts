export interface User {
  username: string;
  displayName: string;
  avatar: string;
  type: 'student' | 'teacher' | 'admin';
}
