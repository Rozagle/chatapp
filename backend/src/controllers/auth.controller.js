// we use promises then we do all asychronous operations
import User from '../models/User.js';
import JWT from 'jsonwebtoken';

export async function signupController(req, res) {
  const { fullname, email, password } =  req.body;
  try {
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }
    const emailPattern = "^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$"; 
    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    if(await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const index = Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10
    const newUser = new User({ fullname, email, password, profilePicture: `https://avatar.iran.liara.run/public/${index}` });
    const token = JWT.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });  
    res.cookie('token', token, {
      httpOnly: true, // accessible only by web server  prevent  XSS attackes
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    
  }
}

export async function loginController(req, res) {
  res.send('Hello World!');
}   

export async function logoutController(req, res) {
  res.send('Hello World!');
}   