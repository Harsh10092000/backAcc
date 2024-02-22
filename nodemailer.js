// import nodemailer from "nodemailer";

// export const transporter = nodemailer.createTransport({
//   host: "smtp.zeptomail.in",
//   port: 587,
//   secure: false,
//   auth: {
//     user: "emailapikey",
//     pass: "PHtE6r1cQLrigzIv80MD4/7qQM6nN4l9rOtuJFMTtdxDD/QEGE1RotAilmfj/08uUvRLQfLIyow64rub4rmCdzy/MjlKWmqyqK3sx/VYSPOZsbq6x00auFQbc03YUo/se9Ni1C3fvtrTNA==",
//   },
// });

import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.zeptomail.in",
  port: 587,
  secure: false,
  auth: {
    user: "emailapikey",
    pass: "PHtE6r1cQLrigzIv80MD4/7qQM6nN4l9rOtuJFMTtdxDD/QEGE1RotAilmfj/08uUvRLQfLIyow64rub4rmCdzy/MjlKWmqyqK3sx/VYSPOZsbq6x00auFQbc03YUo/se9Ni1C3fvtrTNA==",
  },
});
