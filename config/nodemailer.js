const nodemailer = require("nodemailer");
const config = require("../keys");

const user = config.user;
const pass = config.pass;

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: user,
    pass: pass,
  },
});

module.exports.sendConfirmationEmail = (name, email, confirmationCode) => {
  console.log("Email Sent - nodemailer.js");
  transport
    .sendMail({
      from: user,
      to: email,
      subject: "Please confirm your account",
      html: `<h3>Email Confirmation</h3>
          <h4>Hi 👋</h4>
          <p>Thanks for choosing us. <br/> Please confirm your email by clicking on the following link 🙌</p>
          <a href=http://localhost:3000/confirm/${confirmationCode}> Click here</a>
          </div>`,
    })
    .catch((err) => console.log(err));
};
