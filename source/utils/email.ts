import * as nodemailer from "nodemailer";
import config from "../config";

const sendEmail = (options) => {
  //1) Create a transpoter
  const transporter = nodemailer.createTransport({
    host: config.secrets.EmailHost,
    port: config.secrets.EmailPort,
    auth: {
      user: config.secrets.EmailUserName,
      pass: config.secrets.EmailPassword,
    },
    //activate in gmail "less secure app" option
  });
  //2) Define the email op tions
  const mailOptions = {
    
  }
  //1) Actually  send the email
};
