import { redirect } from "next/navigation";
import LoginForm from "@/components/landing/login-form";

export default async function LoginPage() {
  return <LoginForm />;
}
