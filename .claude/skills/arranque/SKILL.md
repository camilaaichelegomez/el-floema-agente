---
name: arranque
description: Cómo arrancar un proyecto nuevo de Camila bien desde el día 1, con las lecciones cicatrizadas de El Floema. Úsala cuando diga "empecemos un proyecto nuevo", "quiero hacer una app/web para X", "arranquemos", "proyecto nuevo desde cero", o cuando esté por escribir el primer archivo de algo que aún no existe. También si un proyecto ya empezó pero todavía no tiene git, CLAUDE.md ni deploy.
---

# Arranque de proyecto — el manual de Camila

Este manual sale de una autopsia honesta de El Floema. Léela: te dice qué
repetir y qué no.

## Autopsia de El Floema (sin suavizar)

**Qué ayudó:**
- El stack terminó siendo sólido y aburrido: **Next.js (App Router) +
  Supabase + Vercel**. Reversible, hosteado, con auth y base de datos que ya
  vienen resueltos. Cuando el Lab creció, el stack aguantó sin drama.
- **Row Level Security desde Supabase** fue la decisión que salvó la
  privacidad de los datos de cada formuladora sin escribir backend propio.
- Trabajar **en pasos chicos, cada uno su rama → PR → merge → deploy**. Cada
  función quedó probada en producción antes de seguir. Eso hizo la app estable.

**Qué faltó al inicio y dolió después:**
- **No hubo CLAUDE.md hasta muy tarde.** Cada sesión nueva re-descubría los
  comandos, las convenciones (estilos inline con CSS vars, no Tailwind en el
  Lab) y qué no tocar (los agentes). Horas perdidas en re-contexto.
- **El repo arrancó como otra cosa.** El primer commit fue un "agente botánico
  con MongoDB" en Python. Encima se creó una carpeta `el-floema/` con una app
  Next duplicada, y *después* la app real quedó en la raíz. Resultado: hoy
  conviven en git la app buena, una app Next vieja anidada, scripts .py
  legacy, un `Procfile` de Heroku, libs de DynamoDB y decenas de `.xlsx`,
  `.pdf` y `.pub` sueltos en la raíz. Nadie limpió nunca. **Esto confunde a
  cada modelo que entra** y esconde cosas peligrosas (ver siguiente punto).
- **Un secreto committeado que sigue vivo:** `agente_botanico.py:64` tiene la
  contraseña de MongoDB en texto plano, en el historial de git. Nació de esa
  etapa temprana sin `.env`. Una decisión de día 1 (usar variables de entorno
  siempre) lo habría evitado.
- **Churn de plataforma:** Heroku (Procfile) → AWS (DynamoDB) → Vercel +
  Supabase. Elegir el destino de deploy tarde costó reescrituras.
- **El alcance creció solo:** empezó como "un agente" y terminó siendo un
  ERP de laboratorio (inventario, fórmulas, costos, historial, PWA). No estuvo
  mal — pero nunca se escribió en una línea "qué es esto y para quién", así
  que cada feature se decidió sobre la marcha.

La lección de fondo: **el código del Lab es bueno; lo que dolió fue el
arranque descuidado.** Este manual arregla el arranque.

## Antes de escribir una sola línea de código

Responde estas tres, en voz alta, y guárdalas en el README:
1. **¿Qué problema resuelve?** Una frase. ("Las formuladoras llevan su
   inventario y costos en cuadernos y se equivocan.")
2. **¿Quién lo usa?** Concreto. ("Camila y 2-3 formuladoras, desde el celular,
   sin conocimiento técnico.")
3. **¿Cuál es la primera cosa VISIBLE que demuestra que funciona?** El
   objetivo del día 1. ("Poder loguearme y ver una lista vacía de inventario
   en el celular.")

Si no puedes responder las tres, todavía no arranques código: pregúntale a
Camila.

## El stack por defecto (mínimo y aburrido)

Salvo que el proyecto pida otra cosa, usa **el mismo que ya conoces**:

```bash
npx create-next-app@latest nombre-proyecto --typescript --app --eslint
cd nombre-proyecto
```

- **Next.js App Router + TypeScript** — es lo que Camila ya tiene andando.
- **Supabase** para auth + base de datos + storage (`@supabase/ssr`). RLS
  activado desde el primer día en toda tabla con datos de usuario.
- **Vercel** para deploy (conectar el repo de GitHub = deploy automático en
  cada push a main).
- Estilos: si es una herramienta interna, alcanza con CSS y variables. No
  metas una librería de componentes "por si acaso".

**Regla:** una decisión reversible hoy vale más que la "perfecta" en dos
semanas. Y **anota el porqué de cada elección** en el README (una línea por
decisión). El churn Heroku→AWS→Vercel de El Floema pasó por no fijar esto
temprano.

## El día 1 no negociable

Antes de la segunda feature, esto tiene que existir:

1. **Git con primer commit real** (no "agente con MongoDB" que en verdad es
   otra cosa — que el commit diga lo que es):
   ```bash
   git init && git add -A && git commit -m "Estructura inicial: Next + Supabase"
   ```
   Crear el repo en GitHub y conectarlo a Vercel el mismo día.

2. **`.gitignore` con `.env*` ANTES del primer commit.** Verifícalo:
   ```bash
   git ls-files | grep -i env   # debe salir vacío
   ```
   Todo secreto va a `.env.local` (local) y a las Environment Variables de
   Vercel (producción). **Nunca** una credencial en un `.ts`/`.py`. Esta es la
   línea que le faltó a `agente_botanico.py`.

3. **CLAUDE.md** en la raíz, corto, con:
   - Comandos: `npm run dev`, `npm run build`, `npx tsc --noEmit`, `npm run lint`.
   - Convenciones del proyecto (ej: "estilos con CSS vars inline en el área
     privada, no Tailwind"; "cada feature en su rama desde main → PR → probar
     en el preview de Vercel → merge").
   - Qué NO tocar (ej: "los agentes IA públicos viven en un backend externo,
     no los modifiques").
   - Cómo se corre y prueba de verdad.

4. **Estructura explicada** (una línea por carpeta en el README). Y **una sola
   app por repo** — no anides una segunda app en un subdirectorio "temporal";
   en El Floema esa carpeta `el-floema/` sigue ahí un año después.

5. **Deploy temprano, aunque sea un "hola".** Que la página vacía esté en
   internet el día 1. Es infinitamente más fácil mantener verde un deploy que
   ya existe que estrenarlo con 20 features encima.

## Cero sobre-ingeniería

- Nada de capas de abstracción para problemas que aún no tienes. ¿Un solo tipo
  de usuario? No armes sistema de roles. ¿Una base de datos? No metas un ORM
  encima del cliente de Supabase.
- No agregues una dependencia "por si acaso". Cada una es superficie de
  ataque y peso (en El Floema quedó `playwright` en `dependencies` sin correr
  en prod).
- Resuelve el caso real de hoy. La generalización se hace cuando aparece el
  segundo caso, no antes.

## Checklist de salida del arranque

No sigas a la segunda feature hasta que todo esto sea ✅:

- [ ] Las 3 preguntas (problema / quién / primera cosa visible) escritas en el README.
- [ ] `git init` + primer commit con mensaje honesto; repo en GitHub.
- [ ] `.gitignore` con `.env*`; `git ls-files | grep -i env` sale vacío.
- [ ] Ningún secreto en código: `git grep -nE 'api[_-]?key|password|mongodb://|AIza' ` sale limpio.
- [ ] CLAUDE.md con comandos, convenciones y qué-no-tocar.
- [ ] Una línea por carpeta explicando la estructura; **una sola app en el repo**.
- [ ] Deploy en Vercel andando (aunque sea una página vacía) con auto-deploy desde main.
- [ ] RLS activado en toda tabla con datos de usuario, probado con una cuenta real (no solo leído el SQL).
- [ ] `npm run build` compila limpio.

## Cómo lo demostrarías en 3 líneas

```bash
npx create-next-app@latest mi-proyecto --typescript --app --eslint && cd mi-proyecto
printf ".env*\n" >> .gitignore && git add -A && git commit -m "Estructura inicial: Next + Supabase"
# crear repo GitHub + conectar a Vercel, escribir CLAUDE.md y las 3 preguntas en el README, y recién ahí: primera feature
```
