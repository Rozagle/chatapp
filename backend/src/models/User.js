import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlenghth: 8 },
    profilePicture: { type: String, default: "" },
    language: { type: String, default: "en" },
    learningLanguages: { type: [String], default: [] },
    location: { type: String, default: "" },
    isOnboarding: { type: Boolean, default: false },
    friends: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);// Define the User model and take userSchema as schema

userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) return next();    
    // Hash the password before saving
    const bcrypt = require('bcrypt');
    const SALT_WORK_FACTOR = 10;    
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        }
    );
    });
});

export default User;