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

transporter.verify((error, success) => {
  if (error) {
    console.error("[SMTP] Connection failed on startup:", error.message);
  } else {
    console.log("[SMTP] Server is ready to send emails");
  }
});

export const auth = betterAuth({
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.APP_URL ||
    "http://localhost:5000",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [
    process.env.FRONTEND_URL || "http://localhost:3000",
    "https://medi-store-msr-frontend.vercel.app",
    "https://medistore-msr-backend.onrender.com",
  ],

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false,
  },

  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,

    // sendVerificationEmail: async ({ user, token }) => {
    //   const verificationURL = `${process.env.APP_URL}/api/auth/verify-email?token=${token}`;

    //   const info = await transporter.sendMail({
    //     from: `"MediStore" <${process.env.APP_EMAIL}>`,
    //     to: user.email || "test@example.com",
    //     subject: "Please verify your email address",

    //     text: "Please verify your email",

    //     html: `
    //       <div style="font-family: Arial; padding: 40px;">
    //         <h2>Verify Your Email Address</h2>

    //         <p>Assalamu Alaikum ${user.name || "User"},</p>

    //         <p>Please confirm your email by clicking below:</p>

    //         <a href="${verificationURL}"
    //           style="background:#2563eb;color:white;padding:10px 20px;text-decoration:none;border-radius:6px;">
    //           Verify Email
    //         </a>

    //         <p>If button doesn't work:</p>
    //         <p>${verificationURL}</p>
    //       </div>
    //     `,
    //   });

    //   console.log("Email sent:", info.messageId);
    // },

    // ! update
    sendVerificationEmail: async ({ user, token }) => {
      const verificationURL = `${process.env.APP_URL}/api/auth/verify-email?token=${token}&callbackURL=${process.env.FRONTEND_URL}/login`;

      try {
        const info = await transporter.sendMail({
          from: `"MediStore" <${process.env.APP_EMAIL}>`,
          to: user.email,
          subject: "Verify your MediStore account",
          text: `Assalamu Alaikum ${user.name || "User"},

Welcome to MediStore.

Please verify your email address by visiting the link below:

${verificationURL}

If you did not create this account, you can ignore this email.
`,
          html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Verify Your Email</title>
</head>

<body style="margin:0;padding:0;background:#f3f6fb;font-family:Arial,Helvetica,sans-serif;">

<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f6fb;padding:40px 16px;">
<tr>
<td align="center">

<table role="presentation" width="100%" cellspacing="0" cellpadding="0"
style="max-width:620px;background:#ffffff;border-radius:22px;overflow:hidden;box-shadow:0 20px 60px rgba(15,23,42,.08);">

<!-- HEADER -->
<tr>
<td style="background:linear-gradient(135deg,#0f172a,#1d4ed8,#06b6d4);padding:42px 34px;text-align:center;">

<div style="width:78px;height:78px;margin:0 auto 18px;border-radius:50%;background:rgba(255,255,255,.16);line-height:78px;font-size:36px;">
💊
</div>

<p style="margin:0;color:#bfdbfe;font-size:13px;letter-spacing:2px;font-weight:700;">
MEDISTORE
</p>

<h1 style="margin:12px 0 8px;color:#ffffff;font-size:30px;line-height:1.2;">
Welcome to MediStore
</h1>

<p style="margin:0;color:#dbeafe;font-size:15px;line-height:1.7;max-width:460px;">
Trusted medicine marketplace with secure ordering and reliable healthcare access.
</p>

</td>
</tr>

<!-- BODY -->
<tr>
<td style="padding:38px 34px;">

<h2 style="margin:0 0 14px;font-size:24px;color:#0f172a;">
Assalamu Alaikum ${user.name || "User"} 👋
</h2>

<p style="margin:0 0 16px;color:#475569;font-size:15px;line-height:1.8;">
Thank you for joining <strong>MediStore</strong>. Please verify your email address to activate your account.
</p>

<table role="presentation" width="100%" cellspacing="0" cellpadding="0"
style="margin:24px 0;background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;">
<tr>
<td style="padding:18px 20px;color:#334155;font-size:14px;line-height:2;">
✅ Trusted Sellers<br/>
🚚 Fast Delivery<br/>
🔒 Secure Payments<br/>
💙 Easy Medicine Access
</td>
</tr>
</table>

<table role="presentation" cellspacing="0" cellpadding="0" style="margin:28px 0;">
<tr>
<td align="center">
<a href="${verificationURL}"
style="background:linear-gradient(135deg,#2563eb,#06b6d4);color:#ffffff;text-decoration:none;padding:16px 34px;font-size:16px;font-weight:700;border-radius:12px;display:inline-block;box-shadow:0 10px 24px rgba(37,99,235,.28);">
Verify My Email →
</a>
</td>
</tr>
</table>

<p style="margin:0 0 10px;color:#64748b;font-size:14px;">
If the button doesn't work, copy this secure link:
</p>

<p style="margin:0;padding:14px;background:#f8fafc;border:1px dashed #cbd5e1;border-radius:12px;color:#2563eb;font-size:13px;word-break:break-all;line-height:1.6;">
${verificationURL}
</p>

</td>
</tr>

<!-- FOOTER -->
<tr>
<td style="padding:24px 34px;background:#f8fafc;border-top:1px solid #e2e8f0;">
<p style="margin:0;color:#64748b;font-size:13px;line-height:1.8;text-align:center;">
This verification link may expire for security reasons.<br/>
© ${new Date().getFullYear()} MediStore. All rights reserved.
</p>
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`,
        });

        console.log("[EMAIL] Verification email sent:", {
          messageId: info.messageId,
          to: user.email,
          accepted: info.accepted,
          rejected: info.rejected,
        });
      } catch (error) {
        // This is the critical line — without it you'd never know what failed
        console.error("[EMAIL] Failed to send verification email:", {
          to: user.email,
          error: error instanceof Error ? error.message : error,
        });
        throw error; // re-throw so BetterAuth knows the send failed
      }
    },
  },

 socialProviders: {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
   redirectURI: process.env.APP_URL + "/api/auth/callback/google",
  },
},

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "CUSTOMER",
        input: true,
      },

      isBanned: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
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
    },
  },

  advanced: {
    cookiePrefix: "medistore",
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      partitioned: true,
    },
  },
});

// export const auth = betterAuth({
//   database: prismaAdapter(prisma, {
//     provider: "postgresql", // or "mysql", "postgresql", ...etc
//   }),
//   trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:3000"],
//   emailAndPassword: {
//     enabled: true,
//     requireEmailVerification: true, // Set to true in production for better security
//     autoSignIn: false,
//   },
//   emailVerification: {
//     autoSignInAfterVerification:true,
//     sendOnSignUp: true, // Automatically send verification email on sign-up, not on every sign-in
//     sendVerificationEmail: async ({ user, url, token }, request) => {
//       const verificationURL = `${process.env.APP_URL}/api/auth/verify-email?token=${token}`;
//       const info = await transporter.sendMail({
//         from: '"hijibiji" <hijibiji@ethereal.email>',
//         to: user.email ||"mdselimreza2066@gmail.com",
//         subject: "Please verify your email address",
//         text: "Hello world?", // Plain-text version of the message
//         html: `<div style="font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 40px 0;">
//   <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px;">

//     <h2 style="margin-top: 0; color: #333333;">
//       Verify Your Email Address
//     </h2>

//     <p style="font-size: 16px; color: #555555;"> assalamu alaikum ${user.name || "User"},</p>

//     <p style="font-size: 16px; color: #555555;">
//       Thank you for signing up! Please confirm your email address by clicking the button below.
//     </p>

//     <div style="text-align: center; margin: 30px 0;">
//       <a
//         href="${verificationURL}"
//         style="
//           background-color: #2563eb;
//           color: #ffffff;
//           padding: 12px 24px;
//           text-decoration: none;
//           font-size: 16px;
//           border-radius: 6px;
//           display: inline-block;
//         "
//       >
//         Verify Email
//       </a>
//     </div>

//     <p style="font-size: 14px; color: #777777;">
//       If the button above doesn’t work, copy and paste the link below into your browser:
//     </p>

//     <p style="word-break: break-all; font-size: 14px; color: #444444;">
//       ${verificationURL}
//     </p>

//     <hr style="margin: 30px 0; border: none; border-top: 1px solid #eeeeee;" />

//     <p style="font-size: 12px; color: #999999;">
//       If you did not create an account, you can safely ignore this email.
//     </p>

//   </div>
// </div>`,
//       });
//       console.log("message sent", info.messageId);
//     },
//   },
//   user: {
//     additionalFields: {
//       role: {
//         type: "string",
//         required: true,
//         defaultValue: "CUSTOMER",
//         input: true, // allow client to send it during signup
//       },
//       isBanned: {
//         type: "boolean",
//         required: false,
//         defaultValue: false,
//         input: false, // don't allow client to set this
//       },
//       phone: {
//         type: "string",
//         required: false,
//         input: true,
//       },
//       address: {
//         type: "string",
//         required: false,
//         input: true,
//       },
//     },}

// });
