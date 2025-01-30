import mongoose from 'mongoose';

const assignmentSubmissionSchema = new mongoose.Schema({
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
    },
    file: String, // Submitted file URL
    codeLink: String,
    deploymentLink: String,
    videoLink: String,
    submittedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const AssignmentSubmission = mongoose.model("AssignmentSubmission", assignmentSubmissionSchema);
export default AssignmentSubmission;