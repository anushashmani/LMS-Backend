import mongoose from 'mongoose';

const CommentProblemSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    classWork: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClassWork',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    problemFile: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const CommentProblem = mongoose.model('StudentComment', CommentProblemSchema);

export default CommentProblem;
