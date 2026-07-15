import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { LabEncabezado } from "@/components/lab/LabEncabezado";
import { TareasManager, type Tarea, type NotaLibre } from "@/components/lab/TareasManager";

export default async function TareasLabPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/lab/login");
  }

  const [{ data: tareasData, error: errorTareas }, { data: notasData, error: errorNotas }] = await Promise.all([
    supabase.from("floema_tareas").select("*").order("creada", { ascending: false }),
    supabase.from("floema_notas").select("*").order("creada", { ascending: false }),
  ]);

  return (
    <main
      className="parchment-bg lab-bg"
      style={{ minHeight: "100vh", padding: "clamp(90px, 14vh, 140px) clamp(20px, 5vw, 64px) 64px" }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <LabEncabezado titulo="Grimorio de Tareas" actual="tareas" />

        {errorTareas || errorNotas ? (
          <p style={{ fontFamily: "var(--font-body)", color: "#e05a4a" }}>
            No se pudieron cargar las tareas: {(errorTareas ?? errorNotas)?.message}
          </p>
        ) : (
          <TareasManager
            initialTareas={(tareasData as Tarea[] | null) ?? []}
            initialNotas={(notasData as NotaLibre[] | null) ?? []}
            userId={user.id}
          />
        )}
      </div>
    </main>
  );
}
