import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION ?? "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const dynamo = DynamoDBDocumentClient.from(client);

const TABLE = "conversaciones-el-floema";

export async function guardarMensaje(params: {
  session_id: string;
  rol: "usuario" | "agente";
  texto: string;
  fuentes?: object[];
  pregunta?: string;
}) {
  await dynamo.send(
    new PutCommand({
      TableName: TABLE,
      Item: {
        session_id: params.session_id,
        timestamp: new Date().toISOString(),
        rol: params.rol,
        texto: params.texto,
        ...(params.fuentes ? { fuentes: params.fuentes } : {}),
        ...(params.pregunta ? { pregunta: params.pregunta } : {}),
      },
    })
  );
}
