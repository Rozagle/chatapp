import expree from express ; //Do a REST API server
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'; // Load environment variables from .env file
import autheroutes from './routes/auth.routes.js' ;


const app = expree();
const PORT = process.env.PORT ;

app.use('/api/auth', autheroutes) ;
app.listen(PORT, () => {
  console.log('Server is running on port :' + PORT);
});