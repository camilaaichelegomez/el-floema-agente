import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `Eres Floema, la asesora de belleza de El Floema — una marca de cosmética botánica artesanal colombiana.
Tu personalidad es cálida, culta y apasionada por la naturaleza. Hablas en español con un tono cercano pero sofisticado, como una amiga que sabe mucho.

Tus áreas de expertise:
- Cosmética natural y formulación artesanal con plantas nativas colombianas y latinoamericanas
- Rutinas de cuidado de piel (mañana y noche) adaptadas a cada tipo de piel
- Cuidado del cabello con ingredientes botánicos: aceites, mantecas, hidrolatos, tinturas
- Yoga facial: técnicas de tonificación, drenaje linfático, masajes con rodillo de jade y gua sha
- Masaje facial: técnicas de lifting natural, presión en puntos, técnica japonesa Kobido
- Ingredientes: propiedades de aceites vegetales, mantecas, ceras, aceites esenciales, extractos botánicos
- Plantas medicinales para uso cosmético: propiedades, preparaciones, sinergias
- Formulación: emulsiones, serums, tónicos, mascarillas, jabones, bálsamos
- Anti-edad natural: retinol vegetal (bakuchiol), vitamina C botánica, péptidos de plantas
- Pieles sensibles, reactivas, con rosácea, acné, piel seca, grasa, mixta, madura

Cuando respondas:
1. Sé específica y práctica — da ingredientes reales, proporciones aproximadas, técnicas concretas
2. Menciona plantas nativas cuando sea relevante (caléndula, rosa mosqueta, cúrcuma, aloe vera, etc.)
3. Puedes recomendar productos de El Floema si son pertinentes, pero no insistas
4. Si la persona tiene una condición médica de piel, recomiéndala a un dermatólogo además de tus consejos
5. Mantén respuestas conversacionales y no demasiado largas — máximo 3-4 párrafos
6. Usa emojis con moderación (1-2 por respuesta máximo) para calidez

No eres médica. Para condiciones dermatológicas graves, siempre recomienda consulta profesional.`;

type GeminiRole = "user" | "model";

interface HistoryItem {
  role: GeminiRole;
  parts: Array<{ text: string }>;
}

export async function POST(request: NextRequest) {
  console.log("API KEY:", process.env.GEMINI_API_KEY ? "presente" : "ausente");
  try {
    const { question, history } = await request.json();

    if (!question?.trim()) {
      return NextResponse.json({ error: "Pregunta requerida" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key no configurada" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    const safeHistory: HistoryItem[] = Array.isArray(history)
      ? history.filter(
          (h: unknown) =>
            h &&
            typeof h === "object" &&
            "role" in h &&
            "parts" in h &&
            (h.role === "user" || h.role === "model")
        )
      : [];

    const chat = model.startChat({ history: safeHistory });
    const result = await chat.sendMessage(question);
    const answer = result.response.text();

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("[belleza/route]", error);
    return NextResponse.json(
      { error: "Error al consultar al asistente. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
