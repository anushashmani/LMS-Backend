import mongoose from "mongoose"

const TopicSchema = new mongoose.Schema(
  {
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: "Module", required: true },
    title: { type: String, required: true },
    // order: { type: Number, required: true },
  },
  { timestamps: true },
)

const Topic = mongoose.model("Topic", TopicSchema)
export default Topic;