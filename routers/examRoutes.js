import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
import nodemailer from "nodemailer"; // Added nodemailer
import Exam from "../model/Exam.js";
import Result from "../model/Result.js";
import Student from "../model/Student.js"; // Import Student Model

dotenv.config();
const router = express.Router();

// Cloudinary Configuration
cloudinary.config({
    cloud_name: 'duvdqnoht',
    api_key: '538347923483567',
    api_secret: '7TQyo_k4m7_boBRTT8viSXuLix0',
});

// Multer Memory Storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
    service: "gmail", // Using Gmail service
    auth: {
        user: 'shoaibrazamemon170@gmail.com', // Replace with your email
        pass: 'dbze dxhh lgms kzmj' // Replace with your password or app password
    }
});

// Function to send emails
const sendEmails = async (students, examDetails) => {
    const subject = "New Exam Notification!";
    const message = `
    <h1>Dear Student,</h1>
    <p>You have a new exam scheduled. Below are the details:</p>
    <ul>
      <li><strong>Title:</strong> ${examDetails.title}</li>
      <li><strong>Date:</strong> ${examDetails.date}</li>
    </ul>
    <p>Make sure to prepare well. Good Luck!</p>
  `;

    const emailList = students.map(student => student.email); // Collect emails

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: emailList,
        subject,
        html: message,
    };

    await transporter.sendMail(mailOptions);
};

// Create Exam
router.post("/createExam", upload.single("examPaper"), async (req, res) => {
    console.log("Request Received: ", req.body);
    const { title, trainerId, course, batch, section, date } = req.body;

    try {
        if (!req.file) {
            console.error("No file uploaded");
            return res.status(400).json({ msg: "No file uploaded" });
        }

        console.log("File Received: ", req.file);

        // Upload file to Cloudinary
        cloudinary.v2.uploader.upload_stream(
            { resource_type: "auto" },
            async (error, result) => {
                if (error) {
                    console.error("Cloudinary Upload Error: ", error);
                    return res.status(500).json({ msg: "Cloudinary upload failed", error });
                }

                console.log("Cloudinary Upload Success: ", result);

                // Save exam details in database
                const newExam = new Exam({
                    title,
                    trainerId,
                    course,
                    batch,
                    section,
                    date,
                    examPaperUrl: result.secure_url,
                });

                await newExam.save();
                console.log("Exam Created: ", newExam);

                // Fetch students in the selected section
                const students = await Student.find({ section }); // Fetch all students in the section
                if (students.length > 0) {
                    await sendEmails(students, { title, course, batch, section, date }); // Send emails
                }

                res.status(201).json({ msg: "Exam created successfully and emails sent!", exam: newExam });
            }
        ).end(req.file.buffer);

    } catch (error) {
        console.error("Backend Error: ", error);
        res.status(500).json({ msg: "Error creating exam", error: error.message });
    }
});

// Get All Exams
router.get("/getExams", async (req, res) => {
    try {
        const exams = await Exam.find().populate("trainerId course batch section");
        res.status(200).json(exams);
    } catch (error) {
        console.error("Fetch Exams Error: ", error);
        res.status(500).json({ msg: "Error fetching exams", error: error.message });
    }
});

// Submit Result
router.post("/submitResult", async (req, res) => {
    const { studentId, examId, marks, reason } = req.body;

    try {
        const result = new Result({
            studentId,
            examId,
            marks,
            reason,
        });

        await result.save();
        res.status(201).json({ msg: "Result submitted successfully", result });
    } catch (error) {
        console.error("Result Submission Error:", error);
        res.status(500).json({ msg: "Error submitting result", error: error.message });
    }
});

// Get Results for Exam
router.get("/getResults/:examId", async (req, res) => {
    try {
        const results = await Result.find({ examId: req.params.examId }).populate("studentId");
        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).json({ msg: "Error fetching results", error: error.message });
    }
});

export default router;
