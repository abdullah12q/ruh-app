import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db/mongoose";
import UserPreferences from "@/lib/db/models/UserPreferences";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const preferences = await UserPreferences.findOne({
      userId: session.user.id,
    });

    if (!preferences) {
      return NextResponse.json({ data: null });
    }

    return NextResponse.json({ data: preferences });
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    await connectDB();

    const updatedPreferences = await UserPreferences.findOneAndUpdate(
      { userId: session.user.id },
      {
        $set: {
          ...body,
          userId: session.user.id, // Ensure userId is never overwritten by client
        },
      },
      { returnDocument: "after", upsert: true },
    );

    return NextResponse.json({ data: updatedPreferences });
  } catch (error) {
    console.error("Error updating user preferences:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
