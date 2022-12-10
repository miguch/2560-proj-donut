const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    "username": {type: Schema.Types.ObjectId, ref: 'teacher' },
    "password": {type: String},
    "salt": {type: String},
    "github_id": {type: String}
})
module.exports = mongoose.model("teacherUser", userSchema);