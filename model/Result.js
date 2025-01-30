import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
    marks: { type: Number, required: true },
    reason: { type: String, required: true },
});

const Result = mongoose.model("Result", resultSchema);
export default Result;
