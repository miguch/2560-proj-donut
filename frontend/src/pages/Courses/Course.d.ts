interface Course {
  course_id: String;
  course_name: String;
  credit: Number;
  department: String;
  teacher_id: String | Teacher;
  _id: Number | String | undefined;
  prerequisites: Array<{ course_id: String }>;
  sections: Array<Section>;
}

interface Section {
  weekday: 0|1|2|3|4|5|6,
  startTime: Number,
  endTime: Number
}
