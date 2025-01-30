import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
    name: String,
    deadline: Date,
    status: {
        type: String,
        enum: ["Pending", "Compeleted", "InProgress", "Not Completed"],
        default: "Pending",
    },
    campus: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', required: true },
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
    file: String,
    link: String,
    grade: String,
}, { timestamps: true });

const Assignment = mongoose.model("Assignment", assignmentSchema);
export default Assignment;
