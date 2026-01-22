import expree from express ; //Do a REST API server
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'; // Load environment variables from .env file

const app = expree();
const PORT = process.env.PORT ;

app.get ('/api/auth/signup', (req, res) => {
  res.send('Hello World!');
});

app.get ('/api/auth/login', (req, res) => {
  res.send('Hello World!');
});

app.get ('/api/auth/logout', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log('Server is running on port :' + PORT);
});