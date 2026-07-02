import User from "../models/User.js";
import bcrypt from "bcryptjs";

const seedUsers = async () => {
  try {
    const count = await User.countDocuments();
    if (count > 0) return;

    console.log("Seeding default users...");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    await User.insertMany([
      {
        name: "Super Admin",
        email: "superadmin@crm.com",
        password: hashedPassword,
        role: "superAdmin",
        status: "Active",
      },
      {
        name: "Admin User",
        email: "admin@crm.com",
        password: hashedPassword,
        role: "admin",
        status: "Active",
      },
    ]);

    console.log("Default users created: superadmin@crm.com / admin123, admin@crm.com / admin123");
  } catch (error) {
    console.error("Seed error:", error.message);
  }
};

export default seedUsers;
