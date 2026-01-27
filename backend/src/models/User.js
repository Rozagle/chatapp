import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    bio: { type: String, default: "" },
    fullname: { type: String, required: true }, ///unique: true
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
    profilePicture: { type: String, default: "" },
    language: { type: String, default: "en" },
    learningLanguages: { type: [String], default: [] },
    location: { type: String, default: "" },
    isOnboarding: { type: Boolean, default: false },
    friends: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  { timestamps: true },
);

// Password hashleme (async/await)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // sadece yeni veya değişen şifreleri hashle
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
  console.log("Saved password:", this.password);
});

// Şifre karşılaştırma metodu
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Model oluşturma
const User = mongoose.model("User", userSchema);
export default User;
