/**
 * Vapi ve Retell webhook'larini karsilayan tek sunucu.
 *
 *   npm run server
 *   ngrok http 3000        (veya cloudflared tunnel)   -> PUBLIC_URL'i .env'e yaz
 *
 * Uclar:
 *   POST /vapi/webhook                 durum, transcript, gorusme sonu raporu
 *   POST /vapi/tools                   asistanin cagirdigi function tool'lar
 *   POST /retell/webhook               call_started / call_ended / call_analyzed
 *   POST /retell/tools/randevu-olustur Retell custom tool
 */
import crypto from "node:crypto";
import express from "express";
import { optionalEnv } from "./lib/http.js";
import { buildAssistant } from "./vapi/assistant.config.js";

const app = express();
app.use(
  express.json({
    limit: "2mb",
    // Retell imza dogrulamasi ham govde uzerinden yapilir
    verify: (req, _res, buf) => {
      req.rawBody = buf.toString("utf8");
    },
  }),
);

const vapiSecret = optionalEnv("VAPI_SERVER_SECRET");
const retellApiKey = optionalEnv("RETELL_API_KEY");
const verifyRetell = optionalEnv("RETELL_VERIFY_SIGNATURE", "true") !== "false";

app.get("/health", (_req, res) => res.json({ ok: true }));

// --------------------------------------------------------------------------
// VAPI
// --------------------------------------------------------------------------
function vapiAuthorized(req) {
  if (!vapiSecret) return true; // gelistirme sirasinda secret tanimli degilse gecir
  return req.get("x-vapi-secret") === vapiSecret;
}

app.post("/vapi/webhook", (req, res) => {
  if (!vapiAuthorized(req)) return res.status(401).json({ error: "gecersiz secret" });

  const message = req.body?.message ?? {};
  switch (message.type) {
    case "assistant-request":
      // Inbound cagride asistani calisma aninda belirlemek istersen burada dondur.
      // Arayan numaraya gore farkli prompt/dil secmek icin ideal yer.
      return res.json({ assistant: buildAssistant() });

    case "status-update":
      console.log(`[vapi] cagri ${message.call?.id} durumu: ${message.status}`);
      break;

    case "end-of-call-report":
      console.log(
        `[vapi] gorusme bitti: ${message.call?.id} | sebep: ${message.endedReason} | sure: ${message.durationSeconds}sn`,
      );
      console.log(`[vapi] ozet: ${message.analysis?.summary ?? "-"}`);
      console.log(`[vapi] kayit: ${message.recordingUrl ?? "-"}`);
      break;

    case "transcript":
      if (message.transcriptType === "final") {
        console.log(`[vapi] ${message.role}: ${message.transcript}`);
      }
      break;

    default:
      break;
  }

  return res.json({});
});

app.post("/vapi/tools", async (req, res) => {
  if (!vapiAuthorized(req)) return res.status(401).json({ error: "gecersiz secret" });

  const toolCalls = req.body?.message?.toolCallList ?? [];
  const results = [];

  for (const call of toolCalls) {
    const name = call.function?.name ?? call.name;
    const args =
      typeof call.function?.arguments === "string"
        ? JSON.parse(call.function.arguments)
        : (call.function?.arguments ?? call.arguments ?? {});

    results.push({
      toolCallId: call.id,
      // Sonuc metni dogrudan asistana okunur; kisa ve Turkce tut.
      result: await runTool(name, args),
    });
  }

  return res.json({ results });
});

// --------------------------------------------------------------------------
// RETELL
// --------------------------------------------------------------------------
function retellAuthorized(req) {
  if (!verifyRetell || !retellApiKey) return true;

  const header = req.get("x-retell-signature") ?? "";
  const provided = header.startsWith("v=") ? header.slice(2) : header;
  const expected = crypto
    .createHmac("sha256", retellApiKey)
    .update(req.rawBody ?? "")
    .digest("hex");

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

app.post("/retell/webhook", (req, res) => {
  if (!retellAuthorized(req)) return res.status(401).json({ error: "gecersiz imza" });

  const { event, call } = req.body ?? {};
  switch (event) {
    case "call_started":
      console.log(`[retell] cagri basladi: ${call?.call_id} (${call?.from_number} -> ${call?.to_number})`);
      break;
    case "call_ended":
      console.log(`[retell] cagri bitti: ${call?.call_id} | sebep: ${call?.disconnection_reason}`);
      break;
    case "call_analyzed":
      console.log(`[retell] ozet: ${call?.call_analysis?.call_summary ?? "-"}`);
      console.log(`[retell] kayit: ${call?.recording_url ?? "-"}`);
      break;
    default:
      break;
  }

  return res.status(204).end();
});

app.post("/retell/tools/randevu-olustur", async (req, res) => {
  if (!retellAuthorized(req)) return res.status(401).json({ error: "gecersiz imza" });

  const { args = {}, ...rest } = req.body ?? {};
  const params = Object.keys(args).length ? args : rest;
  return res.json({ result: await runTool("randevu_olustur", params) });
});

// --------------------------------------------------------------------------
// Is mantigi — burayi kendi sistemine bagla (CRM, takvim, veritabani...)
// --------------------------------------------------------------------------
async function runTool(name, args) {
  console.log(`[tool] ${name}`, args);

  switch (name) {
    case "randevu_olustur": {
      // TODO: burada gercek randevu kaydini olustur (Google Calendar, CRM, DB...)
      const { ad_soyad, tarih_saat } = args;
      return `${ad_soyad} adina ${tarih_saat} icin randevu olusturuldu.`;
    }
    default:
      return "Bu islemi su anda yapamiyorum.";
  }
}

const port = Number(optionalEnv("PORT", "3000"));
app.listen(port, () => {
  console.log(`Webhook sunucusu ${port} portunda dinliyor`);
  const publicUrl = optionalEnv("PUBLIC_URL");
  if (publicUrl) console.log(`Public URL: ${publicUrl}`);
  else console.log("PUBLIC_URL bos — ngrok/cloudflared ile tunel acip .env'e yaz.");
});
