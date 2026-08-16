import SignInForm from "@/components/auth/SignInForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Sign In",
  description:
    "Sign in to your Rُuh account to access your Quran, bookmarks, and reading progress.",
};

export default async function SignInPage({ searchParams }) {
  const session = await auth();
  if (session) return redirect("/");

  const { callbackUrl } = await searchParams;
  return <SignInForm callbackUrl={callbackUrl} />;
}
