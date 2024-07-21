import * as nodemailer from "nodemailer";
import config from "../config";

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}
export const sendEmail = async (options: EmailOptions): Promise<void> => {
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
  //2) Define the email options
  const mailOptions = {
    from: "Hamaz Chihab <chihabhamaz19@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html :HTML content if needed
  };
  //1) Actually  send the email
  await transporter.sendMail(mailOptions);
  console.log("Email sent successfully!");
};
export default sendEmail;