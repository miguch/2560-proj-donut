interface Coursehavechosen {
  course_id: String;
  course_name: String;
  credit: Number;
  department: String;
  teacher_id: String | Teacher;
  student_id: String | Student;
  status: 'enrolled' | 'completed' | 'failed' | 'withdrawn';
  selection_ref_id: string;
  sections: Array<Section>;
  grade: Number;
  gpa: Number;
  _id: Number | String | undefined;
}
