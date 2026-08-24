import RegisterForm from "@/components/auth/RegisterForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Register",
  description:
    "Create a free Rُuh account to save your Quran progress, bookmarks, and reflections. Join a study circle and build a daily Islamic routine.",
};

export default async function RegisterPage() {
  const session = await auth();
  if (session) return redirect("/");

  return <RegisterForm />;
}
