export interface User {
  username: string;
  displayName: string;
  avatar: string;
  type: 'student' | 'teacher' | 'admin';
  _id?: String | undefined;
  student_name?: String;
  teacher_name?: String;
  department?: String;
  github_id?: String;
}
