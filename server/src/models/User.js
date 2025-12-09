import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    email: { type: String, required: true, unique: true, lowercase: ture },
    image: { type: String, required: ture },
    role: { type: String, enum: ["admin", "manager", "user"], default: "user" },
    recentSearchCities: [{ type: String, reuired: true }],
  },
  { timestamps: ture }
);

const User = userSchema.model("User", userSchema);

export default User;
