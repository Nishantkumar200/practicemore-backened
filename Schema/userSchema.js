import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, min: 8 },
    meeting: [
      {
        language: { type: String },
        slottime: { type: String },
        withPeerName: { type: String },
        questionId: { type: mongoose.Mixed },
        quesionyouask:{type:String}
      },
    ],
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);
export default userModel;
