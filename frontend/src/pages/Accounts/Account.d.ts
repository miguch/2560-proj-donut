interface Account {
  ref_id: String;
  name: String;
  department: String;
  type: 'student' | 'teacher';
  is_github_linked: Boolean;
  _id: Number | undefined;
}
