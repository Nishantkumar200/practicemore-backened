import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: { type: String },
  hints: { type: String },
  answer: { type: String },
  language: { type: String },
  questionyouask:{type:String}
});

export const  questionModel = mongoose.model('Question',questionSchema);
