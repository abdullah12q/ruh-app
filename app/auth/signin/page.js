import SignInForm from "@/components/auth/SignInForm";

export const metadata = {
  title: "Sign In",
  description:
    "Sign in to your Rُuh account to access your Quran, bookmarks, and reading progress.",
};

export default async function SignInPage({ searchParams }) {
  const { callbackUrl } = await searchParams;
  return <SignInForm callbackUrl={callbackUrl} />;
}
