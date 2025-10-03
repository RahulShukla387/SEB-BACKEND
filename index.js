import express from "express";
import process from "process";
// import session from "express-session";
// import passport from "passport";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import path from "path";
const port = process.env.PORT;
import Notice from "./models/Notice.js";
import EventPoster from "./models/Poster.js";
import User from "./models/User.js";
import MongoStore from 'connect-mongo';

//todo if you using import you have to write this extra means have to define explicitly;
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serving static files(css, js, images, etc.)
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true })); // for taking the parameter from req.body;
import methodOverride from "method-override";
app.use(methodOverride('_method'));
//todo Adding the cloudinary;

import {storage} from "./config/cloudinary.js";
import { cloudinary } from "./config/cloudinary.js";

//In cloudinary integrating multer for image.
import multer from "multer";
const upload = multer({ storage: storage });
import fs from "fs";
import { v4 as uuidv4 } from 'uuid';
import crypto from "crypto";

//todo connecting with frontend 
import cors from "cors";
// app.use(express.json());
// app.use(cors({
//   origin: 'http://localhost:5173',  // Change to the URL of your frontend if deployed
//   credentials: true,               // Enable cookies or credentials if needed
// }));


const allowedOrigins = [
  "http://localhost:5173",        // local development
  "https://seb-frontend.vercel.app" // deployed frontend
];

// ✅ CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like curl, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"), false);
    }
  },
  credentials: true // ✅ Important: allows cookies/sessions
}));

// ✅ Needed so Express can read JSON request bodies
app.use(express.json());



//todo Importing the session and passport for authentication.
import session from "express-session";
import passport from "passport";
 import userConfig from "./config/userConfig.js";
// import {User} from "./models/User.js";
import { isAdmin, isLoggedIn } from "./config/middleware.js";
app.set("view engine", "ejs");


// app.use(session({
//   secret: process.env.SECRETKEY,
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     httpOnly: true,
//     secure: false,          // must be false for localhost
//     sameSite: 'lax',        // use 'lax' for dev; 'none' + secure:true for prod
//     maxAge: 24 * 60 * 60 * 1000 // 1 day
//   }
// }));

app.use(session({
  secret: process.env.SECRETKEY,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL, // your MongoDB connection string
    collectionName: 'sessions'
  }),
  cookie: {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
  }
}));

app.use(passport.initialize());
app.use(passport.session());
// Configure Google strategy
// passportConfig(passport);
userConfig(passport);

//todo Middleware so that req.user be sent to navbar.ejs template,

app.use((req, res, next)=>{
  res.locals.currUser = req.user;
  next();
});

// app.use(express.json());
 import dbConnect from "./config/mongodb.js";
 dbConnect();


app.post("/api/UploadNotice", isLoggedIn, isAdmin, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // const newNotice = new Notice({
    //   title: req.body.noticeTitle,
    //   imgUrl: req.file.path,        // secure_url from Cloudinary
    //   public_id: req.file.filename, // public_id from Cloudinary
    //   originalName: req.file.originalname 
    // });

    const newNotice = new Notice({
  title: req.body.noticeTitle,
  imgUrl: req.file.secure_url,       // ✅ correct Cloudinary URL
  public_id: req.file.filename || req.file.public_id, // use actual public_id
  originalName: req.file.originalname 
});

    await newNotice.save();
    console.log("Saved notice:", newNotice);

    res.json(newNotice);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

 app.post("/api/getNotice", async (req, res)=>{
   const AllNotice = await Notice.find({}).sort({ createdAt: -1 });
   res.send(AllNotice);
 })
// DELETE notice by ID
app.delete("/api/notice/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Notice.findByIdAndDelete(id);
    res.status(200).json({ message: "Notice deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting notice" });
  }
});




  app.get("/api/debug", (req, res) => {
  res.json({
    isAuthenticated: req.isAuthenticated(),
    user: req.user || null
  });
});
 
// const dlt = async ()=>{
//   await Notice.deleteMany({});
// }
// dlt();
// const print = async ()=>{
//   console.log( await Notice.find({}) );
// }
// print();
// app.listen(port,()=>{
//     console.log("Website Working Properly on port  " + port);
// })

// //todo Google login
// Start Google login
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

    
    const FRONTEND_URL = process.env.FRONTEND_URL;
    
    // Google OAuth callback
    app.get(
      "/auth/google/callback",
      passport.authenticate("google", { failureRedirect: "/login" }),
      (req, res) => {
        // Redirect after successful login
        res.redirect(`${FRONTEND_URL}/api/UploadNotice`);
      }
    );

// Logout route
app.get("/logout", (req, res) => {
  req.logout(err => {
    if (err) console.error(err);
    res.redirect(`${FRONTEND_URL}/`);
  });
});


app.listen(port, ()=>{
  console.log("working on port " + port);
})
