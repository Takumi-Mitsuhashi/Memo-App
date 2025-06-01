import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  time: String,
  date: String,
  title: String,
  body: String
}, { timestamps: true });

const Memo = mongoose.model('Memo', itemSchema);

export default Memo;