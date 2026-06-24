import { guardarMensaje } from "@/lib/dynamodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, history, session_id } = body;

    if (session_id && question) {
      await guardarMensaje({ session_id, rol: "usuario", texto: question }).catch(
        (e) => console.error("[DynamoDB/belleza] error usuario:", e)
      );
    }

    const res = await fetch("https://el-floema-agente.onrender.com/ask-belleza", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, history }),
    });

    if (!res.ok) {
      const err = await res.text();
      return Response.json({ error: err }, { status: res.status });
    }

    const data = await res.json();

    if (session_id && data.response) {
      await guardarMensaje({
        session_id,
        rol: "agente",
        texto: data.response,
        pregunta: question,
      }).catch((e) => console.error("[DynamoDB/belleza] error agente:", e));
    }

    return Response.json(data);
  } catch {
    return Response.json(
      { error: "No se pudo conectar al agente de belleza. Intenta nuevamente." },
      { status: 503 }
    );
  }
}
