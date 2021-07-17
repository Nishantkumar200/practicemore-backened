import express from "express";
import expressAsyncHandler from "express-async-handler";
import { signIn, signUp,meeting,allmeeting,deleteMeeting,reschedule } from "../controller/user.js";


const userrouter = express.Router();

userrouter.post("/login",expressAsyncHandler(signIn));
userrouter.post("/signup",expressAsyncHandler(signUp));
userrouter.post('/meeting',expressAsyncHandler(meeting))
userrouter.get('/allmeeting/:id',expressAsyncHandler(allmeeting));
userrouter.delete('/delete/meeting/:meetingId/:userId',expressAsyncHandler(deleteMeeting))
userrouter.put('/meeting/reschedule/:userId/:meetingId',expressAsyncHandler(reschedule))


export default userrouter;
