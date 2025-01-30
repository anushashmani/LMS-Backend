import mongoose from "mongoose";

const TrainerCourseOutlineProgressSchema = new mongoose.Schema({
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "Trainer", required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    batch: { type: mongoose.Schema.Types.ObjectId, ref: "Batch", required: true },
    section: { type: mongoose.Schema.Types.ObjectId, ref: "Section", required: true },
    progress: [
        {
            moduleId: { type: mongoose.Schema.Types.ObjectId, ref: "Module" },
            topics: [
                {
                    topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
                    chapters: [
                        {
                            chapterId: { type: mongoose.Schema.Types.ObjectId, ref: "Chapter" },
                            isTaught: { type: Boolean, default: false },
                        },
                    ],
                },
            ],
        },
    ],
});

const TrainerCourseOutlineProgress = mongoose.model("TrainerCourseOutlineProgress", TrainerCourseOutlineProgressSchema);
export default TrainerCourseOutlineProgress;
