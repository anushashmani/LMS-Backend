import mongoose from "mongoose";

const personalClassAnnouncementSchema = mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        campus: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', },
        trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', },
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', },
        batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', },
        section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', },
    },
    { timestamps: true }
);

const PersonalAnnouncement = mongoose.model("PersonalAnnouncement", personalClassAnnouncementSchema);
export default PersonalAnnouncement;
