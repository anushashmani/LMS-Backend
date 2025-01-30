// import mongoose from "mongoose";
// const { Schema } = mongoose;

// const trainerSchema = new Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     role: { type: String, default: "trainer", required: true },
//     salary: { type: Number, required: true },
//     phone: { type: String, required: true },
//     whatsapp: { type: String, required: true },
//     cnic: { type: String, required: true },
//     address: { type: String, required: true },
//     specialization: { type: String, required: true },
//     course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
//     batches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }],
//     sections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }],
//     password: { type: String, required: true },
//     image: { type: String },
//     resume: { type: String },
//   },
//   { timestamps: true }
// );

// const Trainer = mongoose.model("Trainer", trainerSchema);
// export default Trainer;




import mongoose from "mongoose";
const { Schema } = mongoose;

const trainerSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: "trainer", required: true },
    salary: { type: Number, required: true },
    phone: { type: String, required: true },
    whatsapp: { type: String, required: true },
    cnic: { type: String, required: true },
    address: { type: String, required: true },
    specialization: { type: String, required: true },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }],
    batches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }],
    sections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }],
    password: { type: String, required: true },
    image: { type: String },
    resume: { type: String },
  },
  { timestamps: true }
);

const Trainer = mongoose.model("Trainer", trainerSchema);
export default Trainer;