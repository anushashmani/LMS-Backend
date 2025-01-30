import mongoose from 'mongoose' 

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    fatherName: { type: String, required: true },
    phoneNo: { type: String, required: true },
    whatsappNo: { type: String },
    cnic: { type: String, required: true },
    fatherCnic: { type: String, required: true },
    qualification: { type: String, required: true },
    campus: { type: mongoose.Schema.Types.ObjectId, ref: 'Campus', required: true },
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    section: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    rollNumber: { type: String, unique: true, required: true },
    image: { type: String, required: true },
    qrCode: { type: String, required: true },
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

export default Student