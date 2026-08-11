import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { getAllHalaqahDigestData } from "@/lib/actions/emailDigest";
import WeeklyDigestEmail from "@/emails/WeeklyDigestEmail";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

const FROM_EMAIL =
  process.env.EMAIL_FROM ?? '"Rُuh" <ruh.app.official@gmail.com>';

// bb3t email kol youm gom3a esa3a 8 elsob7 by vercel cron defined in vercel.json (5 UTC y3ny 8 elsob7)
export async function POST(req) {
  // Verify the cron secret
  const authHeader = req.headers.get("authorization");
  const expectedSecret = `Bearer ${process.env.CRON_SECRET}`;

  if (!process.env.CRON_SECRET || authHeader !== expectedSecret) {
    console.warn("[halaqah-digest] Unauthorized cron attempt");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let emails;
  try {
    emails = await getAllHalaqahDigestData();
  } catch (err) {
    console.error("[halaqah-digest] Data aggregation failed:", err);
    return NextResponse.json(
      { error: "Data aggregation failed" },
      { status: 500 },
    );
  }

  if (emails.length === 0) {
    console.log("[halaqah-digest] No emails to send.");
    return NextResponse.json({ sent: 0, message: "No eligible recipients." });
  }

  // Send emails
  let sentCount = 0;
  const errors = [];

  for (const payload of emails) {
    try {
      const emailHtml = await render(
        WeeklyDigestEmail({
          recipientName: payload.recipientName,
          halaqah: payload.halaqah,
          leaderboard: payload.leaderboard,
          reflectionPreviews: payload.reflectionPreviews,
          myStats: payload.myStats,
          links: payload.links,
        }),
      );

      await transporter.sendMail({
        from: FROM_EMAIL,
        to: payload.to,
        subject: `📖 Your weekly circle update — ${payload.halaqah.name}`,
        html: emailHtml,
      });

      sentCount++;
    } catch (err) {
      console.error(
        `[halaqah-digest] Unexpected error for ${payload.to}:`,
        err,
      );
      errors.push({ to: payload.to, error: String(err) });
    }
  }

  console.log(
    `[halaqah-digest] Done. Sent: ${sentCount}, Errors: ${errors.length}`,
  );

  return NextResponse.json({
    sent: sentCount,
    failed: errors.length,
    total: emails.length,
    errors: errors.length > 0 ? errors : undefined,
  });
}

// Vercel Cron triggers with GET on some configurations — handle both
export { POST as GET };
