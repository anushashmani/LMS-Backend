// //controllers/authControllers.js

// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// import User from "../model/User.js";

// dotenv.config();

// export const signUp = async (req, res) => {
//   const { name, email, password, role } = req.body;
//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ msg: "User already exists" });
//     }

//     const newUser = new User({ name, email, password, role });
//     await newUser.save();

//     console.log('JWT Secret:', process.env.JWT_SECRET);

//     // const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
//     res.status(201).json({ msg: "User created successfully" });
//   } catch (error) {
//     res.status(500).json({ msg: "Server error", error: error.message });
//   }
// };

// // export const login = async (req, res) => {
// //   const { email, password } = req.body;
// //   try {
// //     const user = await User.findOne({ email });
// //     if (!user) {
// //       return res.status(400).json({ msg: "Invalid email or password" });
// //     }

// //     const isMatch = await user.comparePassword(password);
// //     if (!isMatch) {
// //       return res.status(400).json({ msg: "Invalid email or password" });
// //     }

// //     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
// //     res.status(200).json({ msg: "Login successful", token });
// //   } catch (error) {
// //     res.status(500).json({ msg: "Server error", error: error.message });
// //   }
// // };


// // controllers/authControllers.js
// export const login = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ msg: "Invalid email or password" });
//     }

//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(400).json({ msg: "Invalid email or password" });
//     }

//     // Generate new token
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

//     // Save token in the user's document
//     user.token = token;
//     await user.save();

//     res.status(200).json({ msg: "Login successful", token });
//   } catch (error) {
//     res.status(500).json({ msg: "Server error", error: error.message });
//   }
// };





import User from "../model/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import sendResponse from "../helpers/sendResponse.js";

const generateToken = (user) => {
  return jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h", // Token expiration time
  });
};

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return sendResponse(res, 400, null, true, "All fields are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendResponse(res, 400, null, true, "Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = generateToken(newUser);
    sendResponse(res, 201, { token }, false, "User registered successfully");
  } catch (err) {
    console.error("SignUp Error =>", err.message);
    sendResponse(res, 500, null, true, "Server Error");
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendResponse(res, 400, null, true, "All fields are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return sendResponse(res, 404, null, true, "User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendResponse(res, 401, null, true, "Invalid credentials");
    }

    const token = generateToken(user);
    sendResponse(res, 200, { token }, false, "Login successful");
  } catch (err) {
    console.error("Login Error =>", err.message);
    sendResponse(res, 500, null, true, "Server Error");
  }
};
