import express from 'express';
import mongoose from 'mongoose';
import ClassWork from '../model/ClassWork.js';
import User from '../model/User.js'
import Student from '../model/Student.js';
import Section from '../model/Section.js';
import Trainer from '../model/Trainer.js';

const router = express.Router();

router.post('/submit-class-work', async (req, res) => {
  console.log('Body Request', req.body);
  try {
    const { title, description, youtubeLink, githubLink, course, batch, section, campus, trainer } = req.body;

    const newClassWork = new ClassWork({
      title,
      description,
      youtubeLink,
      githubLink,
      course,
      batch,
      section,
      campus,
      trainer
    });

    const savedClassWork = await newClassWork.save();

    console.log('savedClassWork', savedClassWork);

    res.status(201).json(savedClassWork);
  } catch (error) {
    console.error('error', error);
    res.status(400).json({ message: error.message });
  }
})

// // New route to fetch class works for a student
// router.get('/get-class-works', async (req, res) => {
//   try {
//     const { trainer } = req.query

//     const classWorks = await ClassWork.find({ trainer })
//       .populate('batch', 'title')
//       .populate('campus', 'title')
//       .populate('trainer', 'name')
//       .sort({ createdAt: -1 })

//     res.status(200).json(classWorks)
//   } catch (error) {
//     console.error('Error fetching class works:', error)
//     res.status(500).json({ message: error.message })
//   }

// });

router.get('/get-class-works', async (req, res) => {
  try {
    const { trainer, course, batch, section } = req.query;

    const filter = { trainer };
    if (course) filter.course = course;
    if (batch) filter.batch = batch;
    if (section) filter.section = section;

    const classWorks = await ClassWork.find(filter)
      .populate('batch', 'title')
      .populate('campus', 'title')
      .populate('trainer', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json(classWorks);
  } catch (error) {
    console.error('Error fetching class works:', error);
    res.status(500).json({ message: error.message });
  }
});


// New route to fetch class works for a student
router.get('/student-class-works/:userId', async (req, res) => {
  try {
    console.log('Fetching class works for userId:', req.params.userId);
    
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

    // Get the section title from the student's section
    const studentSection = await Section.findById(student.section);

    if (!studentSection) {
      return res.status(404).json({ message: 'Section not found' });
    }

    // Find class works by section title
    const classWorks = await ClassWork.find({ 
      section: studentSection.title // Match by section title instead of ID
    })
    .populate('batch', 'title')
    .populate('campus', 'title')
    .populate('trainer', 'name')
    .populate('course', 'title')
    .sort({ createdAt: -1 });

    res.status(200).json(classWorks);
  } catch (error) {
    console.error('Error fetching class works:', error);
    res.status(500).json({ message: error.message });
  }
});

// Route to fetch teacher's class work activity
router.get('/teacher-class-work-activity/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user || user.role !== 'teacher') {
      return res.status(403).json({ message: 'User is not a teacher' });
    }

    const trainer = await Trainer.findOne({ email: user.email });

    if (!trainer) {
      return res.status(404).json({ message: 'Trainer data not found' });
    }

    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31);

    // Fetch class works with populated fields
    const classWorks = await ClassWork.find({
      trainer: trainer._id,
      createdAt: { $gte: startOfYear, $lte: endOfYear }
    })
    .lean() // Use lean for better performance
    .populate('batch')
    .select('course section createdAt') // Select only needed fields
    .sort({ createdAt: 1 }); // Sort by creation date

    // Group class works by month and section
    const activityData = classWorks.reduce((acc, classWork) => {
      const month = new Date(classWork.createdAt).getMonth();
      const sectionKey = `${classWork.course} - ${classWork.section}`;

      if (!acc[month]) {
        acc[month] = {};
      }

      if (!acc[month][sectionKey]) {
        acc[month][sectionKey] = 0;
      }

      acc[month][sectionKey]++;
      return acc;
    }, {});

    // Format data for frontend
    const formattedData = Object.entries(activityData).map(([month, sections]) => ({
      month: parseInt(month),
      ...sections
    }));
    res.status(200).json(formattedData);
  } catch (error) {
    console.error('Error fetching teacher class work activity:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;

