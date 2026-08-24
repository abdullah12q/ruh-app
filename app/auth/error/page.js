import { Suspense } from "react";
import AuthErrorView from "@/components/auth/AuthErrorView";

export const metadata = {
  title: "Sign In Error",
  description:
    "An error occurred during sign-in. Please try again or return to the home page.",
};

export default function AuthErrorPage() {
  return (
    <Suspense>
      <AuthErrorView />
    </Suspense>
  );
}
