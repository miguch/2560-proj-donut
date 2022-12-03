const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    "course_id": {type: String},
    "course_name": {type: String},
    "credit": {type: Number},
    "department": {type: String},
    "teacher_id": { type: Schema.Types.ObjectId, ref: 'teacher' },
})

module.exports = mongoose.model("course", courseSchema);