const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.DATABASE_URI);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;
