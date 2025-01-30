import express from 'express';
import PersonalAnnouncement from '../model/PersonalClassAnnouncement.js';
import Student from '../model/Student.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use your preferred email service
    auth: {
        user: 'shoaibrazamemon170@gmail.com', // Replace with your email
        pass: 'dbze dxhh lgms kzmj' // Replace with your password or app password
    }
});

// Routes
router.post('/', async (req, res) => {
    try {
        const { title, description, course, batch, section, trainer, campus } = req.body;

        // Create a new Personal Announcement
        const personalAnnouncement = new PersonalAnnouncement({
            title,
            description,
            campus,
            course,
            batch,
            section,
            trainer,
        });

        // Save the personal announcement
        const savedPersonalAnnouncement = await personalAnnouncement.save();

        // Find all students in the selected section
        const studentsInSection = await Student.find({ section });

        // Prepare email content
        const emailSubject = `New Announcement: ${title}`;
        const emailBody = `
            <h3>${title}</h3>
            <p>${description}</p>
        `;

        // Loop through students and send emails
        studentsInSection.forEach(student => {
            const mailOptions = {
                from: 'shoaibrazamemon170@gmail.com',  // Sender's email
                to: student.email,             // Student's email
                subject: emailSubject,         // Subject line
                html: emailBody                // HTML content
            };

            // Send email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(`Error sending email to ${student.email}:`, error);
                } else {
                    console.log(`Email sent to ${student.email}: ${info.response}`);
                }
            });
        });

        // Send the response with the saved announcement
        res.status(201).json(savedPersonalAnnouncement);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

// Routes
router.get('/', async (req, res) => {
    try {
        const announcements = await PersonalAnnouncement.find()
            .populate({ path: 'campus', select: 'title' })
            .populate({ path: 'trainer', select: 'name' })
            .populate({ path: 'course', select: 'title' })
            .populate({ path: 'batch', select: 'title' })
            .populate({ path: 'section', select: 'title' });
        res.status(200).json(announcements);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
);

export default router;
