import userModel from "../Schema/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { questionModel } from "../Schema/questionSchema.js";
import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,

  auth: {
    user: "nikku1456321@gmail.com",
    pass: "8521824925",
  },
});

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (user) {
    const comparePassword = await bcrypt.compareSync(password, user.password);

    if (comparePassword) {
      res.status(200).send({
        id: user._id,
        username: user.name,
        email: user.email,
        isAuthenticated: true,
        token: jwt.sign({ email: user.email, id: user._id }, "secret", {
          expiresIn: "1h",
        }),
        meetings: user.meeting,
      });
    } else {
      return res.send({
        message: "Email or passsword is incorrect",
        isAuthenticated: false,
      });
      // res.send({ message: "Password is wrong", isAuthenticated:false });
    }
  } else {
    // res.send({ message: "Email or Password do not match",isAuthenticated:false });
    return res.send({
      message: "Please check your email or password",
      isAuthenticated: false,
    });
  }
};

// #################  Registering New User ################
export const signUp = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (
    username.length == 0 ||
    password.length == 0 ||
    email.length == 0 ||
    confirmPassword.length == 0
  ) {
    return res.send({ message: "All fields are requireed" });
  }

  let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (!email.match(regexEmail)) {
    return res.send({ message: "Please check your email id" });
  }

 

  try {
  
    if (email.match(regexEmail)) {

  
      
      const existingUser = await userModel.findOne({ email });

      // if email is existing
      if (existingUser) {
        // return res.status(400).send({ message: "Email is already existing" });
        return res.send({ message: "Email is already existing" });
      }

      // checking password length

      if (password.length < 6) {
        return res.send({ message: "Password is too short" });
      }
      // Now Comparing Password

      if (password !== confirmPassword) {
        //return res.status(401).json({ error: "Password do not match" });
        return res.send({ message: "Password do not match" });
      }

      // if email is not existing
      const hashPassword = await bcrypt.hashSync(password, 12);

      const createNewUser = new userModel({
        name: username,
        email: email,
        password: hashPassword,
      });

      // Inserting new user into the database

      const newUser = await createNewUser.save();

      // To Recieve the data we have to send like that
      res.status(201).send({
        id: newUser._id,
        username: newUser.name,
        email: newUser.email,
        isAuthenticated: true,
        token: jwt.sign({ id: newUser._id }, "secret", { expiresIn: "1h" }),
      });
    } else {
      return res.send({ message: "Please check your Email id" });
    }

    // For sending the mail newly user created an account

    // let info = transporter.sendMail({
    //   from: "nikku1456321@gmail.com", // sender address
    //   to: newUser.email, // list of receivers
    //   subject: "Congratulations", // Subject line
    //   // text: "You have successfully created an account on SummerInovation Website Building", // plain text body
    //   html: `<b> Hey ${newUser.name} , You have successfully created an account on SummerInovation Website Building</b>`, // html body
    // });

    // info.then((data) => console.log(data)).catch((err) => console.log(err));
  } catch (error) {
    console.log(error.message);
  }
};

//  to schedule meeting

export const meeting = async (req, res) => {
  const { id, language, selectedDate } = req.body;

  // Setting the question papaer

  const findAllQuestion = await questionModel.find({});

  const findMatchedQuestion = (language) => {
    const foundQuestion = findAllQuestion.filter((x) => x.language == language);

    const getId = foundQuestion.map((item) => {
      return item._id;
    });

    return getId[0];
  };

  const matchedQuestionId = findMatchedQuestion(language);

  try {
    // For inserting the new meeting
    const pushedMeeting = await userModel.findByIdAndUpdate(id, {
      // This method is to push the new value into the array
      $push: {
        meeting: [
          {
            language: language,
            slottime: selectedDate,
            questionId: matchedQuestionId,
            quesionyouask: "Decrypt message",
            isJoined: false,
            meetingLink: "http://localhost:5000",
          },
        ],
      },
    });

    // Send the mail of meeting is confirmed
    // For now email functionality is disabled

    // let info = transporter.sendMail({
    //   from: "nikku1456321@gmail.com", // sender address
    //   to: userDetail.email, // list of receivers
    //   subject: "Congratulations !", // Subject line
    //   // text: `You have successfully booked your meeting  `, // plain text body
    //   html: `<p>Hey ${
    //     userDetail.name
    //   } We are happy to share the details of your upcoming interview practice :</p> <br>
    //  When: ${moment(selectedDate).format("dddd, MMMM Do YYYY, h:mm A ")} <br>
    //  Interview Type : ${language} <br>
    //  Peer Name : ${MatchedPeer.name} <br>
    //  Meeting Link : <a href ="http://localhost:3000/session/join">Join Now</a>`, // html body
    // });

    // info.then((data) => console.log(data)).catch((err) => console.log(err));

    if (pushedMeeting) {
      res.status(200).send({ allMeetings: pushedMeeting.meeting });
    } else {
      console.log("No meeting is pushed");
    }
  } catch (error) {
    console.log(error);
  }
};

// Get All meeting

export const allmeeting = async (req, res) => {
  const id = req.params.id;
  // console.log("userId", id);

  try {
    // if you're defining asyn function , then you must include await function
    const foundUser = await userModel.findOne({ _id: id });

    if (foundUser) {
      const { meeting } = foundUser;
      // console.log(meeting);
      res.status(200).send({
        meeting,
      });
    } else {
      console.log("No Meeting Found");
    }
  } catch (error) {
    console.log(error);
  }
};

// Delete the meeting

export const deleteMeeting = async (req, res) => {
  try {
    const meetingId = req.params.meetingId;
    const userId = req.params.userId;
    console.log(meetingId, userId);

    const deletedMeeting = await userModel.findByIdAndUpdate(
      userId,
      {
        $pull: {
          meeting: { _id: meetingId },
        },
      },
      { multi: true }
    );

    res.status(200).json(deletedMeeting.meeting);
    console.log(deletedMeeting.meeting);
  } catch (error) {
    console.log(error);
  }
};

//  For rescheduling the meeting

export const reschedule = async (req, res) => {
  const { userId, meetingId } = req.params;
  const { newRescheduleTime } = req.body;

  console.log(userId, meetingId, newRescheduleTime);

  try {
    const rescheduleMeet = await userModel.updateOne(
      { _id: userId, "meeting._id": meetingId },
      {
        $set: { "meeting.$.slottime": newRescheduleTime },
      }
    );

    res.status(200).json(rescheduleMeet);
    console.log(rescheduleMeet);
  } catch (error) {
    console.log(error);
  }
};
