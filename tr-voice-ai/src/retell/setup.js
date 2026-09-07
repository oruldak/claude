/**
 * Retell tarafini bastan kurar:
 *   1) Turkce prompt'lu bir Retell LLM olusturur
 *   2) Bu LLM'e bagli, Turkce konusan bir agent olusturur
 *   3) TR DID numarasini elastic SIP trunk uzerinden Retell'e import eder
 *
 * Kullanim: npm run retell:setup
 */
import { env, optionalEnv, printIds } from "../lib/http.js";
import { retell } from "./client.js";

const publicUrl = optionalEnv("PUBLIC_URL").replace(/\/$/, "");

const SYSTEM_PROMPT = [
  "Sen bir Turk sirketinin telefonla konusan sesli asistanisin. Adin Ada.",
  "",
  "KONUSMA KURALLARI",
  "- Sadece Turkce konus, karsi taraf baska dilde konussa bile.",
  "- Tek seferde en fazla iki kisa cumle kur; bu bir telefon gorusmesi.",
  "- Markdown, madde isareti veya emoji kullanma; her sey sesli okunacak.",
  "- Sayilari ve saatleri yaziyla soyle: 'on dort otuz' gibi.",
  "- Telefon numaralarini rakam rakam tekrar edip dogrulat.",
  "- Bilmedigin seyi uydurma; gerekirse ilgili birime aktarmayi teklif et.",
  "",
  "GOREV",
  "- Talebi anla, gerekli bilgileri tek tek ve teyit ederek topla.",
  "- Randevu talebinde once uygun zamani sor, sonra randevu_olustur aracini cagir.",
  "- Konu bitince kibarca ozetle ve gorusmeyi kapat.",
].join("\n");

async function createLlm() {
  const existing = optionalEnv("RETELL_LLM_ID");
  if (existing) {
    console.log(`Retell LLM zaten var: ${existing}`);
    return existing;
  }

  const llm = await retell("/create-retell-llm", {
    method: "POST",
    body: {
      // Retell kendi model adlandirmasini kullanir; panelde acik olan model adini yaz
      model: optionalEnv("RETELL_LLM_MODEL", optionalEnv("LLM_MODEL", "claude-opus-5")),
      model_temperature: 0.4,
      general_prompt: SYSTEM_PROMPT,
      begin_message: "Merhaba, ben Ada. Size nasil yardimci olabilirim?",
      general_tools: [
        { type: "end_call", name: "gorusmeyi_bitir", description: "Konu bittiginde gorusmeyi kapatir." },
        ...(publicUrl
          ? [
              {
                type: "custom",
                name: "randevu_olustur",
                description:
                  "Arayan kisi icin randevu kaydi olusturur. Ad soyad, telefon ve tarih/saat teyit edildikten sonra cagrilir.",
                url: `${publicUrl}/retell/tools/randevu-olustur`,
                speak_during_execution: true,
                speak_after_execution: true,
                execution_message_description: "Randevuyu kaydediyorum, bir saniye.",
                parameters: {
                  type: "object",
                  properties: {
                    ad_soyad: { type: "string", description: "Arayanin adi ve soyadi" },
                    telefon: { type: "string", description: "E.164 formatinda telefon" },
                    tarih_saat: { type: "string", description: "ISO 8601 tarih ve saat" },
                  },
                  required: ["ad_soyad", "telefon", "tarih_saat"],
                },
              },
            ]
          : []),
      ],
    },
  });

  console.log(`Retell LLM olusturuldu: ${llm.llm_id}`);
  return llm.llm_id;
}

async function createAgent(llmId) {
  const existing = optionalEnv("RETELL_AGENT_ID");
  if (existing) {
    console.log(`Agent zaten var: ${existing}`);
    return existing;
  }

  const agent = await retell("/create-agent", {
    method: "POST",
    body: {
      agent_name: "TR Sesli Asistan",
      response_engine: { type: "retell-llm", llm_id: llmId },
      voice_id: optionalEnv("RETELL_VOICE_ID", "11labs-Adrian"),
      // Turkce STT + TTS icin dili acikca sabitle
      language: optionalEnv("RETELL_LANGUAGE", "tr-TR"),
      interruption_sensitivity: 0.9,
      responsiveness: 1,
      end_call_after_silence_ms: 20000,
      max_call_duration_ms: 600000,
      ...(publicUrl ? { webhook_url: `${publicUrl}/retell/webhook` } : {}),
    },
  });

  console.log(`Agent olusturuldu: ${agent.agent_id}`);
  return agent.agent_id;
}

async function importNumber(agentId) {
  const number = env("TR_DID_NUMBER");
  const imported = await retell("/import-phone-number", {
    method: "POST",
    body: {
      phone_number: number,
      nickname: "TR DID",
      // Operatorunun verdigi termination URI, orn. trunk-adi.operator.com.tr
      termination_uri: env("RETELL_TERMINATION_URI"),
      sip_trunk_auth_username: optionalEnv("SIP_USERNAME") || undefined,
      sip_trunk_auth_password: optionalEnv("SIP_PASSWORD") || undefined,
      inbound_agent_id: agentId,
      outbound_agent_id: agentId,
    },
  });

  console.log(`Numara import edildi: ${imported.phone_number}`);
  return imported.phone_number;
}

const llmId = await createLlm();
const agentId = await createAgent(llmId);
await importNumber(agentId);

printIds("Retell kurulumu tamam", {
  RETELL_LLM_ID: llmId,
  RETELL_AGENT_ID: agentId,
});

console.log(
  [
    "Inbound icin son adim: operator panelinde bu DID'e gelen aramalari Retell'e yonlendir.",
    "  Origination / gelen cagri hedefi:  sip.retellai.com",
    "Outbound cagrilar senin trunk'in uzerinden cikar, yani arayan numara kendi DID'in gorunur.",
  ].join("\n"),
);
