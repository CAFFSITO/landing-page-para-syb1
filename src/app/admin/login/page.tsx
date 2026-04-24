import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.user_metadata?.role === "admin") {
    redirect("/admin");
  }

  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : null;

  return <AdminLoginForm defaultToken={token} />;
}
