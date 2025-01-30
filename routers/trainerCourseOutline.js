import express from "express";
import TrainerCourseOutlineProgress from "../model/TrainerProgressSchema";
const router = express.Router();

// Get trainer progress
router.get("/:trainerId", async (req, res) => {
  const { trainerId } = req.params;
  const { courseId, batch, section } = req.query;

  try {
    const progress = await TrainerCourseOutlineProgress.findOne({
      trainerId,
      courseId,
      batch,
      section,
    });

    if (!progress) {
      return res.status(404).json({ message: "Progress not found." });
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: "Error fetching progress.", error });
  }
});

// Update trainer progress
router.put("/:courseId", async (req, res) => {
    const { trainerId, batch, section, progress } = req.body;
    const { courseId } = req.params;
  
    try {
      const updatedProgress = await TrainerCourseOutlineProgress.findOneAndUpdate(
        { trainerId, courseId, batch, section },
        { $set: { progress } },
        { new: true, upsert: true }
      );
  
      res.json({ message: "Progress updated successfully.", updatedProgress });
    } catch (error) {
      res.status(500).json({ message: "Error updating progress.", error });
    }
  });
  

export default router;
