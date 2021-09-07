const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "in-v3.mailjet.com", // mx.example.com
            port: 587, // 143
            secureConnection: false, // TLS requires secureConnection to be false
            auth: {
                user: '2d378f4bfddf299a880042ee963b4f8c',
                pass: '3c399e48ac246ce35599892c8270f358'
            },
            tls: {
                ciphers:'SSLv3'
            }
        });

        var mailOptions = {
            from: 'alfanchand@gmail.com',
            to: email,
            subject: subject,
            html: '<h1>Reset Password</h1><p>Anda telah meminta untuk reset password</p></p><a href="'+text+'">Reset password</a>'
        }

        await transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            }
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;