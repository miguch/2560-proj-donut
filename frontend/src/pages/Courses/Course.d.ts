interface Course {
  course_id: String;
  course_name: String;
  credit: Number;
  department: String;
  teacher_id: String | Teacher;
  _id: Number | String | undefined;
}
