// import mongoose from 'mongoose';

// const classWorkSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: true,
//     },
//     description: {
//         type: String,
//         required: true,
//     },
//     youtubeLink: {
//         type: String,
//     },
//     githubLink: {
//         type: String,
//     },
//     course: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Course',
//         required: true
//     },
//     batch: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Batch',
//         required: true
//     },
//     section: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Section',
//         required: true
//     },
//     campus: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Campus',
//         required: true
//     },
//     trainer: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Trainer',
//         required: true
//     }
// }, { timestamps: true });

// const ClassWork = mongoose.model('ClassWork', classWorkSchema);

// export default ClassWork;



import mongoose from 'mongoose';

const classWorkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    youtubeLink: {
        type: String,
    },
    githubLink: {
        type: String,
    },
    course: {
        type: String,
        required: true
    },
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        required: true
    },
    section: {
        type: String,
        required: true
    },
    campus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campus',
        required: true
    },
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trainer',
        required: true
    }
}, { timestamps: true });

const ClassWork = mongoose.model('ClassWork', classWorkSchema);

export default ClassWork;

