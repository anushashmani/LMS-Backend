import express from 'express';
import TeacherAnnouncement from '../model/TeacherAnnouncement.js';
import Student from '../model/Student.js';
import nodemailer from 'nodemailer';
import Trainer from '../model/Trainer.js';

const router = express.Router();

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Routes
router.post('/add', async (req, res) => {
    console.log('Body Request', req.body);
    try {
        const { title, description, course, batch, section, trainer, campus } = req.body;

        // Create a new Teacher Announcement
        const teacherAnnouncement = new TeacherAnnouncement({
            title,
            description,
            campus,
            course,
            batch,
            section,
            trainer,
        });

        // Save the teacher announcement
        const savedTeacherAnnouncement = await teacherAnnouncement.save();

        // Find all students in the selected section
        const studentsInSection = await Student.find({ section });

        // Prepare email content
        const emailSubject = `New Teacher Announcement: ${title}`;
        const emailBody = `
            <h3>${title}</h3>
            <p>${description}</p>
        `;

        // Loop through students and send emails
        for (const student of studentsInSection) {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: student.email,
                subject: emailSubject,
                html: emailBody
            };

            // Send email
            try {
                await transporter.sendMail(mailOptions);
                console.log(`Email sent to ${student.email}`);
            } catch (error) {
                console.log(`Error sending email to ${student.email}:`, error);
            }
        }

        // Send the response with the saved announcement
        res.status(201).json(savedTeacherAnnouncement);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

// router.get('/getTeacherAnnouncement', async (req, res) => {
//     try {
//         const { trainer } = req.query;
//         let query = {};

//         if (trainer) {
//             query.trainer = trainer;
//         }

//         const Announcement = await TeacherAnnouncement.find(query)
//             .populate('campus', 'title')
//             .populate('trainer', 'name')
//             // .populate('course', 'title')
//             .populate('batch', 'title')
//             // .populate('section', 'title')
//             .sort({ createdAt: -1 });

//         return res.status(200).json(Announcement);
//     } catch (error) {
//         console.error('Error fetching assignments:', error);
//         return res.status(500).json({ message: 'Error fetching assignments', error: error.message });
//     }
// });


router.get("/getTeacherAnnouncement", async (req, res) => {
    try {
      const { email } = req.query // Get email from query params
  
      if (!email) {
        return res.status(400).json({ message: "Teacher email is required" })
      }
  
      // Find the teacher by email
      const teacher = await Trainer.findOne({ email })
  
      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" })
      }
  
      // Find announcements for this teacher
      const announcements = await TeacherAnnouncement.find({ trainer: teacher._id })
        .populate("campus", "title")
        .populate("trainer", "name email")
        .populate("batch", "title")
        .sort({ createdAt: -1 })
  
      return res.status(200).json(announcements)
    } catch (error) {
      console.error("Error fetching announcements:", error)
      return res.status(500).json({ message: "Error fetching announcements", error: error.message })
    }
  })

export default router;