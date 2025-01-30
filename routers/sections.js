// Get all sections
import express from 'express';
import Course from '../model/Course.js';
import Batch from '../model/Batch.js';
import Section from '../model/Section.js';
import Student from '../model/Student.js';

const router = express.Router();

// // Get all sections
// router.get('/', async (req, res) => {
//   try {
//     const sections = await Section.find()
//       .populate('course', 'title')
//       .populate('batch', 'title');
//     res.status(200).json(sections);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// router.get('/', async (req, res) => {
//   const { course, batch } = req.query;
  
//   try {
//     const query = {};
//     if (course) query.course = course;
//     if (batch) query.batch = batch;

//     const sections = await Section.find(query)
//       .populate('course', 'title')
//       .populate('batch', 'title');
      
//     res.status(200).json(sections);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Get all sections with student count
router.get('/', async (req, res) => {
  const { course, batch } = req.query;
  
  try {
    const query = {};
    if (course) query.course = course;
    if (batch) query.batch = batch;

    const sections = await Section.find(query)
      .populate('course', 'title')
      .populate('batch', 'title');

    // Get student count for each section
    const sectionsWithStudentCount = await Promise.all(sections.map(async (section) => {
      const studentCount = await Student.countDocuments({ section: section._id });
      return {
        ...section.toObject(),
        studentCount
      };
    }));
      
    res.status(200).json(sectionsWithStudentCount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, course, batch, status } = req.body;
    const newSection = new Section({ title, description, course, batch, status });
    await newSection.save();
    res.status(201).json(newSection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update section
router.put('/:id', async (req, res) => {
  try {
    const { title, description, course, batch, status } = req.body;
    const updatedSection = await Section.findByIdAndUpdate(req.params.id, {
      title,
      description,
      course,
      batch,
      status,
    }, { new: true }).populate('course', 'title').populate('batch', 'title');
    res.json(updatedSection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Delete section
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSection = await Section.findByIdAndDelete(id);

    if (!deletedSection) {
      return res.status(404).json({ message: 'Section not found' });
    }

    res.status(200).json({ message: 'Section deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting section', error });
  }
});

export default router;