---
name: chequeo-seguridad
description: Auditoría de seguridad del proyecto El Floema (Next.js + Supabase + Gemini). Úsala cuando pidan "revisar seguridad", "chequeo de seguridad", "auditar", "¿es seguro?", "que no se caiga / que sea seguro", antes de un deploy grande, o después de tocar auth, RLS, endpoints /api, subida de archivos o el middleware proxy.ts. También si se agregan tablas nuevas en Supabase o una API que reciba datos del usuario.
---

# Chequeo de seguridad — El Floema

Esta app tiene dos mitades: el **sitio público** (marketing, blog, agentes IA)
y el **Lab** (`/lab/*`), un área privada por usuaria con inventario, fórmulas,
preparaciones y un asistente. Lo delicado vive casi todo en el Lab: datos
privados de cada formuladora, subida de archivos, y una API key de Gemini.

**La regla de oro.** Cada hallazgo lleva: archivo:línea, severidad
(crítica/alta/media/baja) y **cómo se explota en una frase concreta** (qué
manda un atacante y qué obtiene). Si no puedes escribir la frase de
explotación, es una opinión, no un hallazgo — no lo reportes.

**Antes de reportar, intenta tumbar cada hallazgo propio.** ¿Hay RLS detrás
que ya lo bloquea? ¿El middleware ya redirige? ¿El input ya se valida en otra
capa? Solo sobreviven los que resisten tu propio ataque. Un hallazgo teórico
que la base de datos ya frena no es un hallazgo.

## El orden exacto de revisión

### 1. Secretos expuestos o committeados
Lo más caro y lo más común aquí (ya pasó en este repo).

```bash
# ¿Algún .env quedó trackeado? (debe salir vacío)
git ls-files | grep -iE '\.env|api.env|secret|credential'

# Secretos hardcodeados en archivos trackeados (incluye scripts .py legacy)
git grep -nE 'mongodb(\+srv)?://[^ "]+|AIza[A-Za-z0-9_-]{20,}|sk-[A-Za-z0-9]{20,}|AKIA[A-Z0-9]{16}|(password|passwd|secret|api[_-]?key)\s*=\s*["'\''][^"'\'']{6,}' -- '*.py' '*.ts' '*.tsx' '*.js' '*.json'
```

- `.env` y `.env.local` deben estar en `.gitignore` (`.env*`) y **nunca**
  trackeados. Confírmalo con `git ls-files`, no con `ls`.
- **Cicatriz real de este repo:** `agente_botanico.py:64` tiene un
  `MONGO_URI = "mongodb+srv://elfloema:CONTRASEÑA@..."` hardcodeado y
  committeado. Es de la app Python vieja (no del Lab), pero la credencial
  está viva en el historial de git. **Explotación:** cualquiera con acceso al
  repo lee la URI y se conecta directo a la base Mongo. **Arreglo:** rotar esa
  contraseña en MongoDB Atlas, mover a variable de entorno, y considerar
  purgar el archivo del historial. Repórtalo aunque sea legacy.
- `GEMINI_API_KEY` solo puede leerse en `app/api/**` (server). Verifica que
  no aparezca en ningún componente `"use client"` ni con prefijo
  `NEXT_PUBLIC_`. Lo público correcto es solo
  `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  (la publishable key de Supabase es pública por diseño; su seguridad depende
  de RLS, ver paso 3).

### 2. Validación de lo que entra por cada endpoint
Rutas a revisar una por una: `app/api/lab/boleta/route.ts`,
`app/api/lab/inventario-importar/route.ts`, `app/api/lab/asistente/route.ts`,
más `app/api/belleza/route.ts` (público).

En cada `route.ts` confirma **en este orden**:
1. **Auth primero:** `const { data: { user } } = await supabase.auth.getUser()`
   y `if (!user) return 401` *antes* de tocar nada. Las tres APIs del Lab ya lo
   hacen; si agregas una, empieza por esto.
2. **Tamaño del payload:** boleta e inventario-importar cortan base64 a
   ~8M chars (413). El asistente limita a 40 mensajes / 6000 chars c/u. Sin
   estos límites, un payload gigante quema cuota de Gemini o tumba la función.
3. **Forma del input:** tipos correctos, campos obligatorios, mime aceptado.
   La API de asistente exige que el último mensaje sea `role: "user"` y que
   todos tengan forma válida.

**Explotación tipo si falta auth:** `curl -X POST .../api/lab/boleta -d '{...}'`
sin sesión → si no devuelve 401, un anónimo consume tu cuota de Gemini o sube
basura a tu Storage.

### 3. Quién puede tocar qué dato (RLS) — el corazón del asunto
**No basta con "¿puede entrar?". La pregunta es "¿puede leer/escribir datos de
OTRA usuaria?".** La publishable key de Supabase está en el navegador de todas;
lo único que separa los datos de cada formuladora es **Row Level Security**.

Prueba en vivo (no leas solo el SQL) con la cuenta de prueba
`test-lab-inventario@example.com` / `TestLab1234!`:

```bash
node -e '
const U="https://powpibehemondwobngxh.supabase.co";
const K="sb_publishable_tiBXHbRKY_RD1Yd1foybjw__HjO-_W3";
(async()=>{
  const s=await(await fetch(U+"/auth/v1/token?grant_type=password",{method:"POST",
    headers:{apikey:K,"Content-Type":"application/json"},
    body:JSON.stringify({email:"test-lab-inventario@example.com",password:"TestLab1234!"})})).json();
  const H={apikey:K,Authorization:"Bearer "+s.access_token};
  for(const t of ["inventario","formulas","formula_items","preparaciones","preparacion_items","inventario_con_costo"]){
    const r=await(await fetch(U+"/rest/v1/"+t+"?select=user_id",{headers:H})).json();
    const ajenas=Array.isArray(r)?r.filter(x=>x.user_id&&x.user_id!==s.user.id).length:"ERR";
    console.log(t.padEnd(22),"filas:",r.length,"ajenas:",ajenas);
  }
  // anónimo no debe ver nada ni escribir
  const anon=await(await fetch(U+"/rest/v1/inventario?select=*&limit=1",{headers:{apikey:K}})).json();
  console.log("anon inventario:",Array.isArray(anon)?anon.length+" filas":anon);
})();'
```

Lo correcto: **0 filas ajenas** en todas las tablas, y el rol anónimo ve
**0 filas** y sus INSERT dan `42501`.

**La vista es la trampa clásica de este proyecto.** `inventario_con_costo` es
una VIEW. Debe tener `security_invoker = on`, si no **bypasea el RLS** y una
usuaria ve el inventario de otra. Ya se rompió dos veces: una al crearla, otra
al recrearla con `create or replace view` para agregar una columna (esa
operación NO conserva `security_invoker`). Cada vez que toques la vista,
re-corre la prueba de arriba. **Arreglo:**
`alter view inventario_con_costo set (security_invoker = on);`

Las funciones RPC (`preparar_formula`, `borrar_preparacion`,
`costo_formula`) deben ser `security invoker` para respetar el RLS de quien
llama. Si alguna fuera `security definer`, verifica que filtre por
`auth.uid()` internamente.

### 4. Inyección
- **SQL:** todo pasa por el cliente de Supabase (`supabase.from(...).select()`)
  o RPCs con parámetros tipados — no hay SQL concatenado a mano. Si aparece un
  `.rpc()` nuevo, mira su definición: que reciba parámetros, no strings
  interpolados.
- **Prompt injection (Gemini):** el contenido de una boleta/documento subido
  y el mensaje del chat van al prompt. No confíes en que la respuesta de
  Gemini sea segura: se parsea con `JSON.parse` dentro de try/catch y se
  normaliza (`normalizarItems`), nunca se ejecuta. Confirma que ninguna
  respuesta del modelo se use como HTML sin escapar ni como argumento de query.

### 5. Datos sensibles en logs o respuestas
```bash
git grep -nE 'console\.(log|error)' -- 'app/**/*.ts' 'components/**/*.tsx' 'lib/**/*.ts'
```
- Los `console.error("[lab/...]", error)` de las APIs son aceptables (van al
  server de Vercel, no al cliente), pero confirma que no logueen el `imageBase64`
  completo ni tokens.
- Los mensajes de error que se devuelven al cliente (`NextResponse.json({error})`)
  no deben filtrar detalles internos crudos. Hoy son mensajes en español para
  la usuaria — correcto.

### 6. Dependencias con hoyos conocidos
```bash
npm audit --omit=dev
```
Revisa solo lo que llega a producción. Nota: `playwright` está en
`dependencies` pero es de testing — no corre en prod, pero conviene moverlo a
`devDependencies`.

## Comandos de verificación de este proyecto
```bash
npm run build          # debe compilar limpio (Turbopack); un fallo aquí = deploy roto
npx tsc --noEmit       # tipos
npx eslint app components lib proxy.ts
```
Y para probar rutas/headers con un build real:
```bash
npx next start -p 3100
curl -sI http://localhost:3100/ | grep -iE 'x-content|x-frame|referrer|permissions'  # headers de next.config.ts
for p in inventario formulas preparadas asistente; do
  curl -s -o /dev/null -w "/lab/$p: %{http_code}\n" http://localhost:3100/lab/$p   # deben dar 307 -> login
done
```
La protección de rutas vive en `proxy.ts` (middleware; matcher `/lab/:path*`):
todo `/lab` exige sesión salvo `/lab/login`.

## Formato de salida

```
## Hallazgos

### 🔴 Críticos
- **[archivo:línea]** — Descripción en una frase.
  Explotación: <qué manda el atacante → qué obtiene>.
  Arreglo: <cambio concreto>.

### 🟠 Altos
...
### 🟡 Medios
...
### ⚪ Bajos
...

## Lo que NO revisé
- <lista honesta: p.ej. "no probé la app Python legacy",
  "no audité el flujo de reset de contraseña de Supabase Auth",
  "npm audit no corrido por falta de red", etc.>
```

Si un hallazgo no sobrevivió tu intento de tumbarlo, no lo pongas en la lista;
menciónalo en una línea al final como "descartado: X, porque el RLS/middleware
ya lo bloquea".
