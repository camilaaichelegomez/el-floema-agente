import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

export default async function LabIndexPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  redirect(user ? "/lab/inventario" : "/lab/login");
}
