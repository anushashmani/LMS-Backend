import express from "express";
import usersRoutes from "./routers/users.js";
import trainersRoutes from "./routers/trainers.js";
import coursesRoutes from "./routers/courses.js";
import campusRoutes from "./routers/campus.js";
import batchesRoutes from "./routers/batches.js";
import sectionsRoutes from "./routers/sections.js";
import moduleRoutes from "./routers/moduleRoute.js";
import studentRoutes from './routers/student.js';
import assignmentsRoutes from './routers/assignments.js';
import assignmentsSubmissionRoutes from './routers/assignmentSubmission.js';
import announcementRoutes from './routers/announcements.js'
import personalAnnouncementRoutes from './routers/personalAnnouncement.js'
import commentProblemRoutes from './routers/commentProblem.js';
import teacherAnnouncementRoutes from './routers/teacherAnnouncement.js';
import teachingActivityRoutes from './routers/teachingActivity.js';
import examRoutes from './routers/examRoutes.js'
import classWorkRoutes from './routers/classWork.js';
import dotenv from "dotenv";
import { connectDB } from "./lib/DB/connectDB.js";
import cors from "cors";
import cookieParser from 'cookie-parser';

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const app = express();
const PORT = process.env.PORT || 4010;

app.use(cookieParser()); // Parse cookies

// Connect to the database
connectDB();
// CORS configuration to allow your frontend
app.use(
	cors({
	  origin: [
		"http://localhost:5173",  // Allow localhost for development
		"https://manegement-system.vercel.app",  // Allow Vercel URL for production
	  ], // Allow these specific frontend addresses
	  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
	  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
	  credentials: true,              // Allows cookies to be sent
	})
  );
  
// Middleware to log requests
const middleware = (req, res, next) => {
	console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
	next();
};

app.use(middleware);
app.use(express.json());

// Routes
app.use("/users", usersRoutes);
app.use("/trainers", trainersRoutes);
app.use("/courses", coursesRoutes);
app.use("/campus", campusRoutes);
app.use("/batches", batchesRoutes);
app.use("/section", sectionsRoutes);
app.use("/module", moduleRoutes);
app.use("/student", studentRoutes);

app.use('/assignment', assignmentsRoutes);
app.use('/assignmentSubmission', assignmentsSubmissionRoutes);
app.use('/announcements', announcementRoutes);
app.use('/personalAnnouncements', personalAnnouncementRoutes);
app.use('/commentProblem', commentProblemRoutes);
app.use('/teacherAnnouncement', teacherAnnouncementRoutes);
app.use('/teachingActivity', teachingActivityRoutes);
app.use('/exam', examRoutes);
app.use('/classWork', classWorkRoutes);

// Home Route
app.get("/", (req, res) => {
	const obj = {
		name: "Manegement System For SMIT",
		getReqTime: `Date: ${new Date().toDateString()}, Time: ${new Date().toLocaleTimeString()}`,
	};
	res.send(obj);
	console.log("GET request received");
});

// Start Server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
