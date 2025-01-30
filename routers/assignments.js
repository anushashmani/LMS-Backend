import express from 'express';
import mongoose from 'mongoose';
import cloudinary from 'cloudinary';
import multer from 'multer';
import Assignment from '../model/Assignment.js';
import Course from '../model/Course.js';
import Section from '../model/Section.js';
import Trainer from '../model/Trainer.js';
import fs from "fs";
import Student from '../model/Student.js';
import User from '../model/User.js';

const router = express.Router();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: 'duvdqnoht',
  api_key: '538347923483567',
  api_secret: '7TQyo_k4m7_boBRTT8viSXuLix0',
});

// Multer Configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // limit file size to 10MB
}).single('file');

// Function to upload file to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { resource_type: 'auto' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

// Upload Assignment Route
router.post('/upload', upload, async (req, res) => {
  try {
    const { name, deadline, course, batch, section, trainer, campus, link } = req.body;

    // Validate required fields
    if (!name || !deadline || !course || !batch || !section || !trainer || !campus) {
      return res.status(400).json({ message: 'All fields are required except file or link' });
    }

    let fileUrl = '';
    if (req.file) {
      fileUrl = await uploadToCloudinary(req.file.buffer);
    } else if (!link) {
      return res.status(400).json({ message: 'Either a file or a link must be provided' });
    }

    // Find the course by name
    const courseDoc = await Course.findOne({ title: course });
    if (!courseDoc) {
      return res.status(400).json({ message: 'Course not found' });
    }

    // Find the section by name
    const sectionDoc = await Section.findOne({ title: section });
    if (!sectionDoc) {
      return res.status(400).json({ message: 'Section not found' });
    }

    // Create and save assignment
    const newAssignment = new Assignment({
      name,
      deadline: new Date(deadline),
      file: fileUrl,
      link,
      course: courseDoc._id,
      batch,
      section: sectionDoc._id,
      trainer,
      campus,
    });

    console.log('new Assignment', newAssignment);

    await newAssignment.save();
    return res.status(201).json({ message: 'Assignment uploaded successfully', assignment: newAssignment });
  } catch (error) {
    console.error('Error in assignment upload:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', error: error.message });
    }
    return res.status(500).json({ message: 'Error processing request', error: error.message });
  }
});

// // // get Assignments
// router.get('/', async (req, res) => {
//   try {
//     const { trainer, course, batch, section } = req.query;
//     let query = {};

//     if (trainer) {
//       query.trainer = trainer;
//     }

//     if (course) {
//       const courseDoc = await Course.findOne({ title: course });
//       if (!courseDoc) {
//         return res.status(400).json({ message: 'Course not found' });
//       }
//       query.course = courseDoc._id;
//     }

//     if (section) {
//       const sectionDoc = await Section.findOne({ title: section });
//       if (!sectionDoc) {
//         return res.status(400).json({ message: 'Section not found' });
//       }
//       query.section = sectionDoc._id;
//     }

//     if (batch) {
//       query.batch = batch;
//     }

//     const assignments = await Assignment.find(query)
//       .populate('campus', 'title')
//       .populate('trainer', 'name')
//       .populate('course', 'title')
//       .populate('batch', 'title')
//       .populate('section', 'title')
//       .sort({ createdAt: -1 });      

//     return res.status(200).json(assignments);
//   } catch (error) {
//     console.error('Error fetching assignments:', error);
//     return res.status(500).json({ message: 'Error fetching assignments', error: error.message });
//   }
// });

router.get('/', async (req, res) => {
  try {
    const { trainer, course, batch, section } = req.query;
    let query = {};

    if (trainer) {
      query.trainer = trainer;
    }

    if (course) {
      const courseDoc = await Course.findOne({ title: course });
      if (!courseDoc) {
        return res.status(400).json({ message: 'Course not found' });
      }
      query.course = courseDoc._id;
    }

    if (section) {
      const sectionDoc = await Section.findOne({ title: section });
      if (!sectionDoc) {
        return res.status(400).json({ message: 'Section not found' });
      }
      query.section = sectionDoc._id;
    }

    if (batch) {
      query.batch = batch;
    }

    const assignments = await Assignment.find(query)
      .populate('campus', 'title')
      .populate('trainer')
      .populate('course', 'title')
      .populate('batch', 'title')
      .populate('section', 'title')
      .sort({ createdAt: -1 });

    console.log('Assignments', assignments);

    return res.status(200).json({
      totalAssignments: assignments.length, // Return the count
      assignments
    });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return res.status(500).json({ message: 'Error fetching assignments', error: error.message });
  }
});

// Route to fetch assignments specific to a trainer based on the logged-in user's ID
router.get('/trainerAssignments/:userId', async (req, res) => {
  try {
    // Fetch the logged-in user
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'teacher') {
      return res.status(403).json({ message: 'User is not a teacher' });
    }

    // Find the trainer based on the user's email
    const trainer = await Trainer.findOne({ email: user.email });

    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    // Fetch assignments linked to this trainer's ID
    const assignments = await Assignment.find({ trainer: trainer._id })
      .populate('course', 'title')
      .populate('batch', 'title')
      .populate('section', 'title')
      .populate('campus', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      totalAssignments: assignments.length, // Total count of assignments
      assignments, // Detailed assignment data
    });
  } catch (error) {
    console.error('Error fetching trainer assignments:', error);
    res.status(500).json({ error: 'Failed to fetch trainer assignments.' });
  }
});

router.get('/studentAssignments/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'student') {
      return res.status(403).json({ message: 'User is not a student' });
    }

    const student = await Student.findOne({ email: user.email });

    if (!student) {
      return res.status(404).json({ message: 'Student data not found' });
    }

    const assignments = await Assignment.find({ section: student.section })
      .populate('course', 'title')
      .populate('batch', 'title')
      .populate('section', 'title');

    res.status(200).json(assignments);
  } catch (error) {
    console.error('Error fetching student assignments:', error);
    res.status(500).json({ error: 'Failed to fetch student assignments.' });
  }
});

export default router;