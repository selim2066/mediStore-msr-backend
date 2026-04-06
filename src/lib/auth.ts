import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import nodemailer from "nodemailer";
import { prisma } from "./prisma";

// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});


export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:3000"],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true, // Set to true in production for better security
    autoSignIn: false,
  },
  emailVerification: {
    autoSignInAfterVerification:true,
    sendOnSignUp: true, // Automatically send verification email on sign-up, not on every sign-in
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const verificationURL = `${process.env.APP_URL}/api/auth/verify-email?token=${token}`;
      const info = await transporter.sendMail({
        from: '"hijibiji" <hijibiji@ethereal.email>',
        to: user.email ||"mdselimreza2066@gmail.com",
        subject: "Please verify your email address",
        text: "Hello world?", // Plain-text version of the message
        html: `<div style="font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 40px 0;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px;">
    
    <h2 style="margin-top: 0; color: #333333;">
      Verify Your Email Address
    </h2>

    <p style="font-size: 16px; color: #555555;"> assalamu alaikum ${user.name || "User"},</p>

    <p style="font-size: 16px; color: #555555;">
      Thank you for signing up! Please confirm your email address by clicking the button below.
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a 
        href="${verificationURL}" 
        style="
          background-color: #2563eb;
          color: #ffffff;
          padding: 12px 24px;
          text-decoration: none;
          font-size: 16px;
          border-radius: 6px;
          display: inline-block;
        "
      >
        Verify Email
      </a>
    </div>

    <p style="font-size: 14px; color: #777777;">
      If the button above doesn’t work, copy and paste the link below into your browser:
    </p>

    <p style="word-break: break-all; font-size: 14px; color: #444444;">
      ${verificationURL}
    </p>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eeeeee;" />

    <p style="font-size: 12px; color: #999999;">
      If you did not create an account, you can safely ignore this email.
    </p>

  </div>
</div>`,
      });
      console.log("message sent", info.messageId);
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "CUSTOMER",
        input: true, // allow client to send it during signup
      },
      isBanned: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false, // don't allow client to set this
      },
      phone: {
        type: "string",
        required: false,
        input: true,
      },
      address: {
        type: "string",
        required: false,
        input: true,
      },
    },}

});
