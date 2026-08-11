import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";

export async function POST(req) {
  try {
    const { name, email, password, confirmPassword } = await req.json();

    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long." },
        { status: 400 },
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Passwords do not match." },
        { status: 400 },
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with this email." },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name,
      studyCircleName: name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "User registered successfully." },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error in registration:", error);
    return NextResponse.json(
      { message: "An error occurred during registration." },
      { status: 500 },
    );
  }
}
