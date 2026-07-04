import { Suspense } from "react";
import SignInForm from "@/components/auth/SignInForm";

export const metadata = {
  title: "Sign In",
  description:
    "Sign in to your Rُuh account to access your Quran, bookmarks, and reading progress.",
};

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
