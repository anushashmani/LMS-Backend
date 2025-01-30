import { createAnnouncement, getAnnouncements } from '../controllers/announcementController.js';

import multer  from 'multer';
import express from 'express';

const router = express.Router();

// Multer Config for File Upload
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Routes
router.get('/', getAnnouncements);
router.post('/', upload.single('image'), createAnnouncement);

export default router ;