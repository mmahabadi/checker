const nodemailer = require('nodemailer');
const { increaseMessageHit, insertMessage } = require("../db");
const { log } = require('../helpers/log');

const sendEmail = async ({ text, html }, hits = 0, options = {}) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: process.env.SEND_EMAIL_ADDRESS,
      pass: process.env.SEND_EMAIL_PASSWORD
    },
  });

  try {
    await transporter.sendMail({
      from: `"Website Checker" <${process.env.SEND_EMAIL_ADDRESS}>`,
      to: process.env.RECEIVERS_EMAILS,
      subject: "✅ Check this URL",
      text,
      html,
      ...options
    });
    log("Email Sent");

    // increase hits or add
    if(hits === -1) {
      await insertMessage(text, 'EMAIL');
    } else {
      await increaseMessageHit(text, hits + 1, 'EMAIL')
    }
  } catch(e) {
    log("Error sending email", e.message)
  }
}

module.exports = {
  sendEmail
}