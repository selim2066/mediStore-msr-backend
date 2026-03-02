import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/authMiddleware";

async function seedAdmin() {
  try {
    // admin data
    const adminData = {
      name: "admin2066",
      email: "mdselimreza2066@gmail.com",
      role: UserRole.ADMIN,
      password: "admin2066",
    };

    // check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminData.email },
    });

    if (existingAdmin) {
      throw new Error("Admin user already exists. Skipping seeding.");
    }

    const signUpAdmin = await fetch(
      "http://localhost:5000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "http://localhost:5000",
        },
        body: JSON.stringify(adminData),
      },
    );

    console.log("***** signUpAdmin: *****\n", signUpAdmin);

    if (!signUpAdmin.ok) {
      throw new Error("Failed to create admin user.");
    }

    if (signUpAdmin.ok) {
      console.log("Admin user created successfully.");
      await prisma.user.update({
        where: { email: adminData.email },
        data: {
          emailVerified: true,
          role: UserRole.ADMIN,
        },
      });
      console.log("***** Email Verification Status updated *****");
    }
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
}

seedAdmin();
