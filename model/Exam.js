import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
    title: { type: String, required: true },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
    date: { type: Date, required: true },
    examPaperUrl: { type: String, required: true }, // Cloudinary URL
});

const Exam = mongoose.model("Exam", examSchema);
export default Exam;