import {StreamChat} from 'stream-chat';
import 'dotenv/config';

const API_KEY = process.env.STREAM_API_KEY;
const API_SECRET = process.env.STREAM_API_SECRET;

if (!API_KEY || !API_SECRET) {
  throw new Error('Stream API key and secret are missing.');
}

export const streamClient = StreamChat.getInstance(API_KEY, API_SECRET);

export const upsertUser = async (userData) => {
  try {
    // If the user already exists, update them; otherwise create them
    return await streamClient.upsertUser(userData);
    } catch (error) {
    console.error('Error creating Stream user:', error.message);
  }
};
export const generateStreamToken = (userId) => {
  return streamClient.createToken(userId);
};