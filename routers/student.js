import express from 'express';
import cloudinary from 'cloudinary';
import multer from 'multer';
import QRCode from 'qrcode';
import nodemailer from 'nodemailer'; // Import Nodemailer
import Student from '../model/Student.js';
import User from '../model/User.js';
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

// Nodemailer Configuration
// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'shoaibrazamemon170@gmail.com', // Replace with your email
    pass: 'dbze dxhh lgms kzmj' // Replace with your password or app password
  }
});

// Generate Roll Number
const generateRollNumber = async () => {
  const count = await Student.countDocuments() + 1;
  return count.toString().padStart(6, '0'); // Example: 000001
};

// Add Student Route
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const {
      name, email, fatherName, phoneNo, whatsappNo, cnic, fatherCnic,
      qualification, campus, trainer, course, batch, section, gender, address, password
    } = req.body;

    // Generate Roll Number
    const rollNumber = await generateRollNumber();

    // Upload Image to Cloudinary
    const imageUpload = await cloudinary.uploader.upload(
      `data:image/png;base64,${req.file.buffer.toString('base64')}`
    );

    // Generate QR Code
    const qrData = `${rollNumber} - ${name}`;
    const qrCode = await QRCode.toDataURL(qrData);

    // Create Student
    const student = new Student({
      name,
      email,
      fatherName,
      phoneNo,
      whatsappNo,
      cnic,
      fatherCnic,
      qualification,
      campus,
      trainer,
      course,
      batch,
      section,
      gender,
      address,
      password,
      rollNumber,
      image: imageUpload.secure_url,
      qrCode
    });

    await student.save();

    // Send Email Notification
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender email
      to: email, // Student's email
      subject: 'Welcome to Our Training Program!',
      html: `
                <h2>Dear ${name},</h2>
                <p>Congratulations! You have been successfully registered for the training program.</p>
                <p><strong>Roll Number:</strong> ${rollNumber}</p>
                <p><strong>Your Password:</strong> ${password}</p>
                <p>We are excited to have you onboard and look forward to seeing you grow and succeed!</p>
                <p>If you have any questions, feel free to contact us.</p>
                <br>
                <p>SMIT Regards,</p>
                <p><strong>Your Training Team</strong></p>
            `
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
        return res.status(500).json({ error: 'Failed to send email.' });
      }
      console.log('Email sent:', info.response);
    });

    res.status(201).json({ message: 'Student added successfully!', student });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ error: 'Failed to add student.' });
  }
});

// Get All Students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().populate('campus trainer course batch section');
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students.' });
  }
});

// Update Student Route
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, email, fatherName, phoneNo, whatsappNo, cnic, fatherCnic,
      qualification, campus, trainer, course, batch, section, gender, address, password
    } = req.body;

    let updatedData = {
      name, email, fatherName, phoneNo, whatsappNo, cnic, fatherCnic,
      qualification, campus, trainer, course, batch, section, gender, address, password
    };

    if (req.file) {
      const imageUpload = await cloudinary.uploader.upload(
        `data:image/png;base64,${req.file.buffer.toString('base64')}`
      );
      updatedData.image = imageUpload.secure_url;
    }

    const updatedStudent = await Student.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedStudent) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    res.status(200).json({ message: 'Student updated successfully!', updatedStudent });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Failed to update student.' });
  }
});

// DELETE route for deleting a student
router.delete('/:id', async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await Student.findByIdAndDelete(studentId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/courses/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'student') {
      return res.status(403).json({ message: 'User is not a student' });
    }

    const student = await Student.findOne({ email: user.email })
      .populate('course')
      .populate('batch')
      .populate('section')
      .populate('campus');

    if (!student) {
      return res.status(404).json({ message: 'Student data not found' });
    }

     // Prepare Final Response
     const studentData = {
      studentID: student._id,
      studentName: student.name,
      email: student.email,
      phone: student.phoneNo,
      fatherName: student.fatherName,
      whatsapp: student.whatsappNo,
      cnic: student.cnic,
      fatherCnic: student.fatherCnic,
      address: student.address,
      image: student.image,
      course: student.course,
      batch: student.batch,
      section: student.section,
      campus: student.campus,
      trainer: student.trainer,
      gender: student.gender,
    };

    // console.log('Student Response', studentData);
    
    res.status(200).json({
      student: studentData,
      course: student.course,
      batch: student.batch,
      section: student.section,
      campus: student.campus,
    });
  } catch (error) {
    console.error('Error fetching student courses:', error);
    res.status(500).json({ error: 'Failed to fetch student courses.' });
  }
});

export default router;
