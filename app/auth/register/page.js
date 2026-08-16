import RegisterForm from "@/components/auth/RegisterForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Register",
  description: "Create a new account on Rُuh.",
};

export default async function RegisterPage() {
  const session = await auth();
  if (session) return redirect("/");

  return <RegisterForm />;
}
