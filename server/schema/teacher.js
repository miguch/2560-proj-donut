const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
    "teacher_id": {type: String},
    "teacher_name": {type: String},
    "department": {type: String},
    "position": {type: String},
})
module.exports = mongoose.model("teacher", teacherSchema);