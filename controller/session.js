import nodemailer from "nodemailer";
import { nanoid } from 'nanoid'

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,

  auth: {
    user: "nikku1456321@gmail.com",
    pass: "8521824925",
  },
});
export const sendLinkToFreind = async (req, res) => {
  const { mail,meetLink } = req.body;

  // send mail to freind

  const meetingId = nanoid();

  try {
    let info = transporter.sendMail({
      from: "nikku1456321@gmail.com", // sender address
      to: mail, // list of receivers
      subject: "Practice With Freind", // Subject line
      // text: "You have successfully created an account on SummerInovation Website Building", // plain text body
      html: `<h1>Your freind has invited you to do practice <br>
           <p>Use this link to get practice now :  <a href = ${meetLink}>Join this Meeting</a></p>
          </h1>`, // html body
    });

    info.then((data) => console.log(data)).catch((err) => console.log(err));

    if (info) {
      res.send({meetingId:`${meetingId}`});
    } else {
      res.send({ msg: "Some internal error happend" });
    }
  } catch (error) {
    console.log(error);
  }
};
