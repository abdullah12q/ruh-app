import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/db/mongoClient";
import connectDB from "@/lib/db/mongoose";
import User from "@/lib/db/models/User";

/**
 * Auth.js (NextAuth v5) Configuration
 *
 * Providers:
 * 1. Google OAuth — Primary social sign-in
 * 2. Credentials — Email/password (bcrypt hashed, stored in MongoDB)
 *
 * Adapter: MongoDB Adapter — persists sessions, accounts, users to MongoDB.
 * Strategy: JWT (stateless) for flexibility with the MongoDB adapter.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),

  providers: [
    // ── Google OAuth ───────────────────────────────────────────
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent", // this will force the user to select account every time
          access_type: "offline",
          response_type: "code",
          // Required: "profile" scope authorizes the access_token to call the
          // Google userinfo endpoint (/oauth2/v3/userinfo) to fetch the profile picture.
          scope: "openid email profile",
        },
      },
    }),

    // ── Credentials (Email/Password) ───────────────────────────
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email }).select(
          "+password",
        ); // +password is used to select the password from the database even if it is not selected in the schema

        if (!user || !user.password) {
          throw new Error("No account found with this email.");
        }

        // Dynamically import bcryptjs to keep it server-side only
        const bcrypt = await import("bcryptjs");
        const isValid = bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Incorrect password.");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // Persist the user's MongoDB _id to the JWT on first sign-in (Save MongoDB _id inside the JWT) w b3deha bb3t token.userId lel client side ely hya el session
      if (user) {
        token.userId = user.id;
      }

      // On first Google sign-in, use the access_token to fetch the full profile
      // from Google's userinfo endpoint (ID token may not include the picture field)
      if (account?.provider === "google" && account.access_token) {
        try {
          const res = await fetch(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
              headers: { Authorization: `Bearer ${account.access_token}` },
            },
          );
          const googleProfile = await res.json();
          // nfs fkrt el _id ely 3mlnaha fo2
          if (googleProfile.picture) {
            token.picture = googleProfile.picture;
          }
        } catch (err) {
          console.error("Failed to fetch Google userinfo:", err);
        }
      }

      return token;
    },

    async session({ session, token }) {
      // Expose userId on the client-side session object
      if (token?.userId) {
        session.user.id = token.userId;
      }
      // Expose the Google profile picture to the client-side session
      if (token?.picture) {
        session.user.image = token.picture;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  debug: process.env.NODE_ENV === "development",
});
