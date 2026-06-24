import { guardarMensaje } from "@/lib/dynamodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pregunta, historial, session_id } = body;

    // Guardar mensaje del usuario
    if (session_id && pregunta) {
      await guardarMensaje({ session_id, rol: "usuario", texto: pregunta }).catch(
        (e) => console.error("[DynamoDB] error usuario:", e)
      );
    }

    const res = await fetch("http://localhost:8001/consulta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pregunta, historial, session_id }),
    });

    if (!res.ok) {
      const err = await res.text();
      return Response.json({ error: err }, { status: res.status });
    }

    const data = await res.json();

    // Guardar respuesta del agente
    if (session_id && data.respuesta) {
      await guardarMensaje({
        session_id,
        rol: "agente",
        texto: data.respuesta,
        fuentes: data.fuentes ?? [],
        pregunta,
      }).catch((e) => console.error("[DynamoDB] error agente:", e));
    }

    return Response.json(data);
  } catch {
    return Response.json(
      { error: "El servidor del agente no está disponible. Asegúrate de que api_botanico.py está corriendo." },
      { status: 503 }
    );
  }
}
