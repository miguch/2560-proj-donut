interface Coursehavechosen {
  course_id: String;
  course_name: String;
  credit: Number;
  department: String;
  teacher_id: String | Teacher;
  status: 'enrolled' | 'completed' | 'failed' | 'withdrawn';
  selection_ref_id: string;
  sections: Array<Section>;
  grade: Number;
  enrolledCount: number;
  capacity: number | undefined;
  _id: Number | String | undefined;
  prerequisites: Array<String>;
}
