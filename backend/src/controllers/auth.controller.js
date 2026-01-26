import User from '../models/User.js';
import JWT from 'jsonwebtoken';
import { upsertUser } from '../lib/stream.js';

export async function signupController(req, res) {
  const { fullname, email, password, profilePicture } =  req.body;
  try {
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (await User.findOne({ fullname })) {
  return res.status(400).json({ message: 'This name is already taken' });
}
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const index = Math.floor(Math.random() * 100) + 1;
    const newUser = await User.create({ fullname, email, password, profilePicture: `https://avatar.iran.liara.run/public/${index}` });

    try {
          // Create Stream user (Realtime chat video calls)
      await upsertUser({
        id: newUser._id,
        name: newUser.fullname,
        profilePicture: newUser.profilePicture || `https://avatar.iran.liara.run/public/${index}`,
      });
          console.log('Stream user created/updated for', newUser.fullname, 'successfully');
    } catch (error) {
      console.error('Error creating Stream user:', error);
    }

// Create JWT token
    const token = JWT.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });  
    res.cookie('token', token, {
      httpOnly: true, // accessible only by web server  prevent  XSS attackes
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Duplicate field error',
        field: Object.keys(error.keyPattern),
      });
    }
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function loginController(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function logoutController(req, res) {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout successful' });
}

export async function OnboardingController(req, res) {
  const userId = req.user._id;
  const { bio, language, learningLanguages, location } = req.body;

    const fullname = req.body.fullname || req.user.fullname;

  if (!fullname || !bio || !language || !learningLanguages || !location) {
    return res.status(400).json({
      message: 'All fields are required',
      missingFields: [
        !fullname && 'fullname',
        !bio && 'bio',
        !language && 'language',
        !learningLanguages && 'learningLanguages',
        !location && 'location'
      ].filter(Boolean)
    });
  }

  try {
const UpdateUser =await User.findOneAndUpdate(
    { _id: userId },
    {
      fullname,
      ...req.body,
      learningLanguages: Array.isArray(learningLanguages) ? learningLanguages : [learningLanguages],
      isOnboarding: true
    },
    { new: true }
  );

    if (!UpdateUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    try {
          // Update Stream user (Realtime chat video calls)
      await upsertUser({
        id: UpdateUser._id,
        name: UpdateUser.fullname,
        profilePicture: UpdateUser.profilePicture || '',
      });
        console.log('Stream user updated for', UpdateUser.fullname, 'successfully');
    } 
    catch (error) {
      console.error('Error updating Stream user during onboarding:', error);
    }
    res.status(200).json({message: 'Onboarding completed successfully',user: UpdateUser,});
  } catch (error) {
    console.error('Error during onboarding:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}