// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//     googleId: { type: String, required: true, unique: true }, // Google’s unique ID
//   email: { type: String, required: true, unique: true },    // Useful for login/notifications
//   name: String,
//   profilePic: String,
//   createdAt: { type: Date, default: Date.now },
//  role: {
//   type: String,
//   enum: ["user", "admin"],
//   default: "user"
//  },
//   resetPasswordToken: String,
//   resetPasswordExpires: Date,
// });

// const User = mongoose.model("User", userSchema);
// export {User};

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: String,
  profilePic: String,
  role: { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

export default User; 
