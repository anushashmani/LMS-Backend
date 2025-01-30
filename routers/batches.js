import express from "express";
import Batch from "../model/Batch.js";
import Course from "../model/Course.js";

const router = express.Router();

// // In your API route (Express)
// router.get("/", async (req, res) => {
// 	try {
// 		const batches = await Batch.find().populate('course'); // Populate the course title
// 		res.status(200).json({
// 			msg: "Batches fetched successfully",
// 			error: false,
// 			data: batches,
// 		});
// 		console.log('API Call Successful');
// 	} catch (err) {
// 		res.status(500).json({
// 			msg: "Error fetching batches",
// 			error: true,
// 			data: [],
// 		});
// 		console.error(err);
// 	}
// });

router.get("/", async (req, res) => {
	const { course } = req.query;
  
	try {
	  const filter = course ? { course } : {};
	  const batches = await Batch.find(filter).populate('course');
	  res.status(200).json({
		msg: "Batches fetched successfully",
		error: false,
		data: batches,
	  });
	} catch (err) {
	  res.status(500).json({
		msg: "Error fetching batches",
		error: true,
		data: [],
	  });
	}
  });
  

router.post("/", async (req, res) => {
	const { title, description, course } = req.body;
  
	try {
	  // Check if the course exists
	  const existingCourse = await Course.findById(course);
	  if (!existingCourse) {
		return res.status(400).json({
		  msg: "Course not found",
		  error: true,
		  data: [],
		});
	  }
  
	  const newBatch = new Batch({ title, description, course });
	  const savedBatch = await newBatch.save();
  
	  res.status(201).json({
		msg: "Batch added successfully",
		data: savedBatch,
		error: false,
	  });
	} catch (err) {
	  res.status(500).json({
		msg: "Error adding batch",
		error: true,
		data: [],
	  });
	  console.error(err);
	}
  });
  
  router.put('/:id', async (req, res) => {
	try {
	  const { id } = req.params;
	  const updatedBatch = await Batch.findByIdAndUpdate(id, req.body, { new: true });
	  if (!updatedBatch) {
		return res.status(404).send({ error: 'Batch not found' });
	  }
	  res.status(200).send({ data: updatedBatch });
	} catch (error) {
	  res.status(500).send({ error: 'Internal Server Error' });
	}
  });
  
  router.delete('/:id', async (req, res) => {
	const { id } = req.params;
	try {
	  const deletedBatch = await Batch.findByIdAndDelete(id);
	  if (!deletedBatch) {
		return res.status(404).send({ message: 'Batch not found' });
	  }
	  res.status(200).send({ message: 'Batch deleted successfully!' });
	} catch (error) {
	  res.status(500).send({ message: 'Failed to delete batch.' });
	}
  });
  
export default router;
