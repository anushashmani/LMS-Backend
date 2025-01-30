import express from "express"
import cloudinary from "cloudinary"
import Module from "../model/Module.js"
import Topic from "../model/Topic.js"
import Chapter from "../model/Chapter.js"
import Course from "../model/Course.js"
import Trainer from "../model/Trainer.js"
import User from "../model/User.js"

const router = express.Router()

// Create a new module
router.post("/module", async (req, res) => {
    try {
        const { title, description, duration, course } = req.body

        const newModule = new Module({
            courseId: course, // Change this line
            title,
            description,
            duration,
        })

        const savedModule = await newModule.save()
        res.status(201).json({
            msg: "Module added successfully",
            data: savedModule,
            error: false,
        })
    } catch (error) {
        console.log("Error Module Adding", error)

        res.status(500).json({
            msg: "Failed to add module",
            error: error.message,
        })
    }
})

// Get all modules with populated course details
router.get("/modules", async (req, res) => {
    try {
        // Fetch all modules and populate the courseId field
        const modules = await Module.find().populate("courseId");

        res.status(200).json({
            msg: "Modules fetched successfully",
            data: modules,
            error: false,
        });
    } catch (error) {
        console.log("Error fetching modules:", error);

        res.status(500).json({
            msg: "Failed to fetch modules",
            error: error.message,
        });
    }
});

// Create a new topic under a specific module
router.post("/topic", async (req, res) => {
    try {
        const { title, order, moduleId } = req.body
        // const moduleId = req.params.moduleId // Get the module ID from the URL parameters

        const newTopic = new Topic({
            moduleId,
            title,
            order, // Optional: order can help define the sequence of topics
        })

        const savedTopic = await newTopic.save()
        res.status(201).json({
            msg: "Topic added successfully",
            data: savedTopic,
            error: false,
        })
    } catch (error) {
        res.status(500).json({
            msg: "Failed to add topic",
            error: error.message,
        })
    }
})

// Get topics by moduleId
router.get("/topics/:moduleId", async (req, res) => {
    try {
        const { moduleId } = req.params;
        const topics = await Topic.find({ moduleId }); // Fetch topics based on moduleId
        res.status(200).json({
            msg: "Topics fetched successfully",
            data: topics,
            error: false,
        });
    } catch (error) {
        console.log("Error fetching topics:", error);
        res.status(500).json({
            msg: "Failed to fetch topics",
            error: error.message,
        });
    }
});

// Add a new chapter
router.post("/chapters", async (req, res) => {
    try {
        const { moduleId, topicId, title, content } = req.body;

        // Validate if the module and topic exist
        const moduleExists = await Module.findById(moduleId);
        if (!moduleExists) {
            return res.status(404).json({
                msg: "Module not found",
                error: true,
            });
        }

        const topicExists = await Topic.findById(topicId);
        if (!topicExists) {
            return res.status(404).json({
                msg: "Topic not found",
                error: true,
            });
        }

        // Create a new chapter
        const newChapter = new Chapter({
            moduleId,
            topicId,
            title,
            content,
            // order,
        });

        const savedChapter = await newChapter.save();
        res.status(201).json({
            msg: "Chapter added successfully",
            data: savedChapter,
            error: false,
        });
    } catch (error) {
        console.log("Error adding chapter:", error);
        res.status(500).json({
            msg: "Failed to add chapter",
            error: error.message,
        });
    }
});

// Fetch courses with their associated modules, topics, and chapters
router.get("/courseOutline", async (req, res) => {
    try {
        // Fetch all courses
        const courses = await Course.find();

        const coursesWithModulesTopicsChapters = await Promise.all(
            courses.map(async (course) => {
                // Fetch modules linked to this course
                const modules = await Module.find({ courseId: course._id });

                // Fetch topics and chapters for each module
                const modulesWithDetails = await Promise.all(
                    modules.map(async (module) => {
                        const topics = await Topic.find({ moduleId: module._id });

                        // Fetch chapters for each topic
                        const topicsWithChapters = await Promise.all(
                            topics.map(async (topic) => {
                                const chapters = await Chapter.find({ topicId: topic._id });
                                return { ...topic.toObject(), chapters };
                            })
                        );

                        return { ...module.toObject(), topics: topicsWithChapters };
                    })
                );

                return { ...course.toObject(), modules: modulesWithDetails };
            })
        );

        res.status(200).json({
            msg: "Courses, modules, topics, and chapters fetched successfully",
            error: false,
            data: coursesWithModulesTopicsChapters,
        });
    } catch (error) {
        console.error("Error fetching course outline:", error);
        res.status(500).json({
            msg: "Failed to fetch course outline",
            error: error.message,
        });
    }
});

// New route to fetch course outlines for the trainer
router.get("/course-outlines/:userId", async (req, res) => {
    try {
        const { userId } = req.params

        // Validate userId
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" })
        }

        // Find User by ID
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        // Check role
        if (user.role !== "teacher") {
            return res.status(403).json({ message: "User is not a teacher" })
        }

        // Fetch Trainer Data
        const trainer = await Trainer.findOne({ email: user.email }).populate("courses")
            .populate("batches")
            .populate("sections");

        if (!trainer) {
            return res.status(404).json({ message: "Trainer data not found" })
        }

        // Fetch course outlines for trainer's courses
        const courseOutlines = await Promise.all(
            trainer.courses.map(async (course) => {
                const modules = await Module.find({ courseId: course._id })

                const modulesWithDetails = await Promise.all(
                    modules.map(async (module) => {
                        const topics = await Topic.find({ moduleId: module._id })

                        const topicsWithChapters = await Promise.all(
                            topics.map(async (topic) => {
                                const chapters = await Chapter.find({ topicId: topic._id })
                                return { ...topic.toObject(), chapters }
                            }),
                        )

                        return { ...module.toObject(), topics: topicsWithChapters }
                    }),
                )

                return { ...course.toObject(), modules: modulesWithDetails }
            }),
        )

        res.status(200).json({
            trainerName: trainer.name,
            email: trainer.email,
            courses: courseOutlines,
            batches: trainer.batches.map((batch) => ({
                batchId: batch._id,
                title: batch.title, // Add relevant batch details
            })),
            sections: trainer.sections.map((section) => ({
                sectionId: section._id,
                title: section.title, // Add relevant section details
            })),
            courseOutlines,
        })
        
    } catch (error) {
        console.error("Error fetching course outlines:", error)
        res.status(500).json({ error: "Failed to fetch course outlines." })
    }
})


export default router

