interface Course {
  course_id: string;
  course_name: String;
  credit: Number;
  department: String;
  teacher_id: String | Teacher;
  _id: string | undefined;
  prerequisites: Array<String>;
  sections: Array<Section>;
  isPaused: boolean;
  withdrawOnly: boolean;
  capacity: number|undefined;
  enrolledCount: number;
}

interface Section {
  weekday: 0|1|2|3|4|5|6,
  startTime: number,
  endTime: number
}
