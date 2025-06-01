import mongoose from 'mongoose';

const deletedMemoSchema = new mongoose.Schema({
  id: String,
  time: String,
  title: String,
  body: String,
}, { timestamps: true });

export default mongoose.model('DeletedMemo', deletedMemoSchema);
