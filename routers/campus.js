import express from "express";
import Campus from "../model/Campus.js";

const router = express.Router();

// In your API route (Express)
router.get("/", async (req, res) => {
	try {
		const batches = await Campus.find()// Populate the course title
		res.status(200).json({
			msg: "Campuses fetched successfully",
			error: false,
			data: batches,
		});
		console.log('API Call Successful');
	} catch (err) {
		res.status(500).json({
			msg: "Error fetching Campuses",
			error: true,
			data: [],
		});
		console.error(err);
	}
});

router.post("/", async (req, res) => {
	const { title, description } = req.body;
  
	try {
  
	  const newCampus = new Campus({ title, description });
	  const savedCampus = await newCampus.save();
  
	  res.status(201).json({
		msg: "Campus added successfully",
		data: savedCampus,
		error: false,
	  });
	} catch (err) {
	  res.status(500).json({
		msg: "Error adding Campus",
		error: true,
		data: [],
	  });
	  console.error(err);
	}
  });
  
  router.put('/:id', async (req, res) => {
	try {
	  const { id } = req.params;
	  const updatedCampus = await Campus.findByIdAndUpdate(id, req.body, { new: true });
	  if (!updatedCampus) {
		return res.status(404).send({ error: 'Campus not found' });
	  }
	  res.status(200).send({ data: updatedCampus });
	} catch (error) {
	  res.status(500).send({ error: 'Internal Server Error' });
	}
  });
  
  router.delete('/:id', async (req, res) => {
	const { id } = req.params;
	try {
	  const deletedCampus = await Campus.findByIdAndDelete(id);
	  if (!deletedCampus) {
		return res.status(404).send({ message: 'Campus not found' });
	  }
	  res.status(200).send({ message: 'Campus deleted successfully!' });
	} catch (error) {
	  res.status(500).send({ message: 'Failed to delete Campus.' });
	}
  });
  
export default router;
