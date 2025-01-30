import mongoose from "mongoose";

const ChapterSchema = new mongoose.Schema(
  {
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: "Module", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const Chapter = mongoose.model("Chapter", ChapterSchema);  // Singular model name
export default Chapter;
