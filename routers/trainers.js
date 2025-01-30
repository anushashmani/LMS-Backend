import express from "express";
import Trainer from "../model/Trainer.js";
import multer from "multer";
import cloudinary from 'cloudinary';
import User from "../model/User.js";
import Course from "../model/Course.js";
import Batch from "../model/Batch.js";
import Section from "../model/Section.js";

import fs from "fs";

const router = express.Router();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: 'duvdqnoht',
  api_key: '538347923483567',
  api_secret: '7TQyo_k4m7_boBRTT8viSXuLix0'
});

// Multer Configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Cloudinary upload function for images and resume
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload_stream({ resource_type: "auto" }, (error, result) => {
      if (error) reject(error);
      resolve(result);
    }).end(file.buffer);
  });
};

// Update the POST route to handle multiple courses
router.post("/", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'resume', maxCount: 1 }]), async (req, res) => {
  try {
    console.log('Received form data:', req.body);
    console.log('Received files:', req.files);

    // Upload image and resume to Cloudinary
    const imageResult = await uploadToCloudinary(req.files['image'][0]);
    const resumeResult = await uploadToCloudinary(req.files['resume'][0]);

    // Parse the Courses, Batches and Sections JSON strings
    const courses = JSON.parse(req.body.Courses || '[]');
    const batches = JSON.parse(req.body.Batches || '[]');
    const sections = JSON.parse(req.body.Sections || '[]');
    console.log('Parsed courses:', courses);
    console.log('Parsed batches:', batches);
    console.log('Parsed sections:', sections);

    // Delete local file
    // fs.unlinkSync(req.file.path);

    // Create a new trainer
    const newTrainer = new Trainer({
      name: req.body.Name,
      email: req.body.Email,
      phone: req.body.Phone,
      whatsapp: req.body.Whatsapp,
      cnic: req.body.Cnic,
      salary: req.body.Salary,
      address: req.body.address,
      specialization: req.body.Specialization,
      courses: courses,
      batches: batches,
      sections: sections,
      password: req.body.Password,
      image: imageResult.secure_url,
      resume: resumeResult.secure_url,
    });

    console.log('Trainer object before saving:', newTrainer);

    // Save to the database
    await newTrainer.save();

    res.status(200).json({ message: 'Trainer added successfully', trainer: newTrainer });
  } catch (error) {
    console.error('Error in trainer creation:', error);
    res.status(500).json({ message: 'Failed to upload files or save trainer', error: error.message });
  }
});

// Update the GET route to populate multiple courses
router.get('/', async (req, res) => {
  try {
    const trainers = await Trainer.find()
      .populate('courses', 'title') // Populating course titles
      .populate('batches', 'title')  // Populating batch titles
      .populate('sections', 'title'); // Populating section titles

    res.status(200).json({ data: trainers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch trainers' });
  }
});

// Update the GET by ID route to populate multiple courses
router.get("/:id", async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id)
      .populate("courses")
      .populate("batches")
      .populate("sections");
    if (!trainer) return res.status(404).json({ message: "Trainer not found" });
    res.status(200).json(trainer);
  } catch (error) {
    console.error("Error fetching trainer:", error);
    res.status(500).json({ message: "Failed to fetch trainer." });
  }
});

router.put("/:id", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'resume', maxCount: 1 }]), async (req, res) => {
  try {
    const updates = { ...req.body };

    // Handle image update
    if (req.files && req.files['image']) {
      const imageResult = await uploadToCloudinary(req.files['image'][0]);
      updates.image = imageResult.secure_url;
    }

    // Handle resume update
    if (req.files && req.files['resume']) {
      const resumeResult = await uploadToCloudinary(req.files['resume'][0]);
      updates.resume = resumeResult.secure_url;
    }

    // Handle array fields (courses, batches, sections)
    ['courses', 'batches', 'sections'].forEach(field => {
      if (updates[field]) {
        // Ensure the field is an array or convert it to an array
        if (typeof updates[field] === 'string') {
          try {
            // Try to parse the string if it looks like a JSON array
            updates[field] = JSON.parse(updates[field]);
          } catch (e) {
            // If parsing fails, keep the field as is (or handle error if necessary)
            console.error(`Error parsing ${field}:`, e);
            updates[field] = [updates[field]]; // Convert it to an array
          }
        } else {
          updates[field] = Array.isArray(updates[field]) ? updates[field] : [updates[field]];
        }
      }
    });

    // Update the trainer in the database
    const updatedTrainer = await Trainer.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!updatedTrainer) return res.status(404).json({ message: "Trainer not found" });
    res.status(200).json({ message: "Trainer updated successfully", updatedTrainer });
  } catch (error) {
    console.error("Error updating trainer:", error);
    res.status(500).json({ message: "Failed to update trainer.", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedTrainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!deletedTrainer) return res.status(404).json({ message: "Trainer not found" });
    res.status(200).json({ message: "Trainer deleted successfully" });
  } catch (error) {
    console.error("Error deleting trainer:", error);
    res.status(500).json({ message: "Failed to delete trainer." });
  }
});

router.get('/courses/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Find User by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check role
    if (user.role !== 'teacher') {
      return res.status(403).json({ message: 'User is not a teacher' });
    }

    // Fetch Trainer Data
    const trainer = await Trainer.findOne({ email: user.email })
      .populate('courses')     // Populate courses
      .populate('batches')     // Populate batches
      .populate('sections');   // Populate sections

    if (!trainer) {
      return res.status(404).json({ message: 'Trainer data not found' });
    }

    // Prepare Final Response
    const response = {
      trainerID: trainer._id,
      trainerName: trainer.name,
      email: trainer.email,
      phone: trainer.phone,
      whatsapp: trainer.whatsapp,
      specialization: trainer.specialization,
      address: trainer.address,
      salary: trainer.salary,
      image: trainer.image,
      resume: trainer.resume,
      courses: trainer.courses.map(course => ({
        courseName: course.title,
        batches: trainer.batches.filter(batch => batch.course.toString() === course._id.toString()),
        sections: trainer.sections.filter(section => section.course.toString() === course._id.toString())
      }))
    };


    // Send Response
    res.status(200).json(response);

  } catch (error) {
    console.error('Error fetching trainer data:', error);
    res.status(500).json({ error: 'Failed to fetch trainer data.' });
  }
});

export default router;