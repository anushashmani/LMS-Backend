import mongoose from "mongoose";

const TeacherAnnouncementSchema = mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        campus: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', },
        trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', },
        // course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', },
        course: { type:String, required: true, },
        batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', },
        // section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', },
        section: { type:String, required: true, },

    },
    { timestamps: true }
);

const TeacherAnnouncement = mongoose.model("TeacherAnnouncement", TeacherAnnouncementSchema);
export default TeacherAnnouncement;
