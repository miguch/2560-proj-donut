interface CourseStudent {
  student_id: string | Student;
  course_id: string | Course;
  status: "enrolled" | "completed" | "failed" | "withdrawn";
  _id: Number | String | undefined;
}
