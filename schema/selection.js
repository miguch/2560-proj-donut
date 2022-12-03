const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const selectionSchema = new Schema({
    "course_id": { type: Schema.Types.ObjectId, ref: 'course' },
    "student_id": { type: Schema.Types.ObjectId, ref: 'student' },
    "grade": {type: Number},
    "gpa": {type: Number},
})
module.exports = mongoose.model("selection", selectionSchema);