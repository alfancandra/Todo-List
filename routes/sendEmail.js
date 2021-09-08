const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp-relay.sendinblue.com", // mx.example.com
            port: 587, // 143
            secureConnection: false, // TLS requires secureConnection to be false
            auth: {
                user: 'teguhrijanandi02@gmail.com',
                pass: 'g7pTjwB3I6EXrHt1'
            },
            tls: {
                ciphers:'SSLv3'
            }
        });

        var mailOptions = {
            from: 'shippu@shippu.tech',
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