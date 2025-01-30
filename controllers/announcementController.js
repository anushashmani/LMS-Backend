import cloudinary from 'cloudinary';
import Announcement from '../model/Announcements.js';
import fs from "fs";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: 'duvdqnoht',
  api_key: '538347923483567',
  api_secret: '7TQyo_k4m7_boBRTT8viSXuLix0',
});

// Get All Announcements
export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
    .populate({ path: 'campus', select: 'title' })
    .populate({ path: 'trainer', select: 'name' })
    .populate({ path: 'course', select: 'title' })
    .populate({ path: 'batch', select: 'title' })
    .populate({ path: 'section', select: 'title' });
    res.status(200).json(announcements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create Announcement
export const createAnnouncement = async (req, res) => {
  try {
    const { title, description, course, batch, section, trainer , campus} = req.body;

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    fs.unlinkSync(req.file.path);

    const announcement = new Announcement({
      title,
      description,
      image: result.secure_url,
      campus,
      course,
      batch,
      section,
      trainer,
    });

    const savedAnnouncement = await announcement.save();
    res.status(201).json(savedAnnouncement);
  } catch (err) {
    console.log(err);
    
    res.status(500).json({ error: err.message });
  }
};
