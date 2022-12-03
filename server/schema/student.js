const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    student_id: {type: String},
    student_name: {type: String},
    age: {type: Number},
    department: {type: String},
    gender: {type: String},
    fee: {type: Number}
})
module.exports = mongoose.model("student", studentSchema);
