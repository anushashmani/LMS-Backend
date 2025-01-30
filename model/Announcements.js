import mongoose from "mongoose";

const announcementSchema = mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String }, // Cloudinary URL
        campus: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', },
        trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', },
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', },
        batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', },
        section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', },
    },
    { timestamps: true }
);


const Announcement = mongoose.model("Announcement", announcementSchema);
export default Announcement;
