import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import Halaqah from "@/lib/db/models/Halaqah";
import { verifyUnsubscribeToken } from "@/lib/actions/emailDigest";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return new NextResponse(
      buildHTML("Invalid Link", "Missing unsubscribe token."),
      {
        status: 400,
        headers: { "Content-Type": "text/html" },
      },
    );
  }

  const decoded = verifyUnsubscribeToken(token);
  if (!decoded) {
    return new NextResponse(
      buildHTML(
        "Invalid Link",
        "This unsubscribe link is invalid or has been tampered with.",
      ),
      { status: 400, headers: { "Content-Type": "text/html" } },
    );
  }

  const { userId, halaqahId } = decoded;

  try {
    await connectDB();

    const updatedHalaqah = await Halaqah.findOneAndUpdate(
      {
        _id: halaqahId,
        "members.userId": userId,
      },
      {
        $set: { "members.$.emailOptOut": true },
      },
    );

    if (!updatedHalaqah) {
      return new NextResponse(
        buildHTML(
          "Already Removed",
          "You may no longer be a member of this circle, or the circle has been deleted.",
        ),
        { status: 200, headers: { "Content-Type": "text/html" } },
      );
    }
  } catch (err) {
    console.error("[unsubscribe]", err);
    return new NextResponse(
      buildHTML("Error", "Something went wrong. Please try again later."),
      { status: 500, headers: { "Content-Type": "text/html" } },
    );
  }

  return new NextResponse(
    buildHTML(
      "Unsubscribed",
      "You have been unsubscribed from this circle's weekly digest. You will no longer receive Friday emails for this circle.",
      true,
    ),
    { status: 200, headers: { "Content-Type": "text/html" } },
  );
}

// Minimal branded HTML page — shown when the user clicks the email link
function buildHTML(title, message, success = false) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const iconColor = success ? "#14B8A6" : "#F87171";
  const icon = success ? "✓" : "✕";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — Rُuh</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #050505;
      color: #F3F4F6;
      font-family: Inter, Arial, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 24px;
    }
    .card {
      background: #111;
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 20px;
      padding: 48px 40px;
      max-width: 420px;
      width: 100%;
      text-align: center;
    }
    .icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: ${iconColor}22;
      border: 1px solid ${iconColor}44;
      color: ${iconColor};
      font-size: 24px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
    }
    h1 { font-size: 22px; font-weight: 700; margin-bottom: 12px; }
    p { font-size: 14px; line-height: 1.6; color: #9CA3AF; margin-bottom: 28px; }
    a {
      display: inline-block;
      background: #14B8A6;
      color: #fff;
      padding: 12px 28px;
      border-radius: 10px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
    }
    .brand {
      font-size: 13px;
      color: #4B5563;
      margin-top: 32px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${icon}</div>
    <h1>${title}</h1>
    <p>${message}</p>
    <a href="${appUrl}">Return to Rُuh</a>
    <p class="brand">Rُuh · رُوح</p>
  </div>
</body>
</html>`;
}
