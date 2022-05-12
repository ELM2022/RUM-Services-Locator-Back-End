const db = require('../configs/db').pool;
const path = require('path');
const nodemailer = require('nodemailer');
const SMTPTransport = require("nodemailer/lib/smtp-transport");

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const sendEmail = (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport(new SMTPTransport({
            service: process.env.EMAIL_SERVICE,
            host: process.env.EMAIL_HOST,
            auth: {
                user: `${process.env.EMAIL_SENDER}`,
                pass: `${process.env.EMAIL_SENDER_PASSW}`,
            }
        }));

        const mailOptions = {
            from: `${process.env.EMAIL_SENDER}`,
            to: `${email}`, 
            subject: subject,
            text: text,
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Email not sent: ", error);
            }
            else {
                console.log("Email sent: " + info.response);
            }
        });

    } catch (error) {
        console.log(error);
    }
}

const emailVerification = async(req) => {
    try {
        // console.log(req.session.data);
        const account = await db.promise().query("SELECT * FROM Administrator WHERE admin_id = ?", [req.session.data.admin_id]);
        const { admin_email, admin_name, auth_token } = account[0][0]; 
        const token = auth_token;
        
        if (admin_email !== undefined && admin_name !== undefined) {

            const subject = "RUM Services Locator: Validación de Acceso";
            const text = `Hola ${admin_name},\nPor favor ingrese este código de seis dígitos a la plataforma, para validar su acceso.\n\nCódigo: ${token}\n`;
            
            sendEmail(admin_email, subject, text);

        }
        else {
            console.log('Admin Email Not Found');
        }

    } catch (error) {
        console.log(error);
    }
}

const emailAuthTokenResend = async(email, token) => {
    try {
        const account = await db.promise().query("SELECT * FROM Administrator WHERE admin_email = ?", [email]);
        const { admin_email, admin_name } = account[0][0];
        
        if (admin_email !== undefined && admin_name !== undefined) {

            const subject = "RUM Services Locator: Validación de Acceso";
            const text = `Hola ${admin_name},\nPor favor ingrese este código de seis dígitos a la plataforma, para validar su acceso.\n\nCódigo: ${token}\n`;
            
            sendEmail(admin_email, subject, text);

        }
        else {
            console.log('Admin Email Not Found');
        }

    } catch (error) {
        console.log(error);
    }
}

const emailPasswReset = async(email, token) => {
    try {
        const [account] = await db.promise().query("SELECT * FROM Administrator WHERE admin_email = ?", [email]);
        const { admin_email, admin_name } = account[0]; 
        
        if (admin_email !== undefined && admin_name !== undefined) {

            const url = (process.env.NODE_ENV === "production") ? process.env.SERVER_URL_PROD : process.env.SERVER_URL_DEV;
            const link = `${url}/reset/${token}`;
            const subject = "RUM Services Locator: Restablecer Contraseña";
            const text = `Hola ${admin_name},\nPor favor haga 'click' en el siguiente enlace para restablecer su contraseña.\n\nEnlace: ${link}\n`;
            
            sendEmail(admin_email, subject, text);

        }
        else {
            console.log('Admin Email Not Found');
        }

    } catch (error) {
        console.log(error);
    }
}

const emailResetConfirmation = async(email) => {
    try {
        const subject = "RUM Services Locator: Cambio de Contraseña";
        const text = `La contraseña para su cuenta (${email}) ha sido restablecida y actualizada. \n`;

        sendEmail(email, subject, text);

    } catch (error) {
        console.log(error);
    }
}

const emailPendingAdmin = async(email) => {
    try {
        const host = (process.env.NODE_ENV === 'production') ? process.env.ADMIN_URL_PROD : process.env.ADMIN_URL_DEV;
        const link = `${host}/Create_Account`;
        const subject = "RUM Services Locator: Acceso a Sistema Otorgado";
        const text = `Usted ha sido otorgado acceso de administrador al sistema de 'RUM Services Locator'.\nPara registrar su cuenta, acceda al sistema utilizando el siguiente enlace.\n\nEnlace: ${link}`;
        sendEmail(email, subject, text);
    } catch (error) {
        console.log(error);
    }
}

const emailConfirmRegister = async(email) => { // create confirmation link/route
    try {
        const host = (process.env.NODE_ENV === 'production') ? process.env.ADMIN_URL_PROD : process.env.ADMIN_URL_DEV;
        const link = ``;
        const subject = "RUM Services Locator: Confirmación de Registro";
        const text = `Su cuenta (${email}) ha sido registrada.\nPara confirmar el registro, haga 'click' en el siguiente enlace.\n\nEnlace: ${link}`;

        sendEmail(email, subject, text);

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    sendEmail,
    emailVerification,
    emailAuthTokenResend,
    emailPasswReset,
    emailResetConfirmation,
    emailPendingAdmin,
    emailConfirmRegister
}