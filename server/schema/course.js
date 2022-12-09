const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  course_id: { type: String },
  course_name: { type: String },
  credit: { type: Number },
  department: { type: String },
  teacher_id: { type: Schema.Types.ObjectId, ref: 'teacher' },
  prerequisites: [String],
  sections: [
    new Schema({
      weekday: { type: Number },
      // time are encoded as number of minutes
      // since the starts of the day
      // i.e. 600 is 10:00, 1000 is 16:40
      startTime: { type: Number },
      endTime: { type: Number },
    }),
  ],
  capacity: { type: Number },
  isPaused: { type: Boolean },
  withdrawOnly: { type: Boolean },
});

module.exports = mongoose.model('course', courseSchema);
