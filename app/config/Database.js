import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();


const Database =()=>{
    try {
  mongoose.connect(process.env.MONGO_URL, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function () {
    console.log('Connected to MongoDB');
  });
} catch (error) {
  console.error('Error connecting to MongoDB:', error.message);
  process.exit(1);
}

}

export default Database