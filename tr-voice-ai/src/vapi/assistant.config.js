import { optionalEnv } from "../lib/http.js";

/**
 * Turkce konusan bir Vapi asistani.
 *
 * Turkce icin onemli olan uc ayar:
 *  - transcriber.language: "tr"  (STT'ye dili acikca soyle, otomatik algilamaya birakma)
 *  - Cok dilli bir TTS sesi     (ElevenLabs multilingual/turbo v2.5 veya Azure tr-TR-*)
 *  - Sistem prompt'unun Turkce yazilmasi ve sayi/tarih okuma kurallarinin verilmesi
 */
export function buildAssistant({ serverUrl, serverSecret } = {}) {
  const elevenVoiceId = optionalEnv("ELEVENLABS_VOICE_ID");

  const voice = elevenVoiceId
    ? {
        provider: "11labs",
        voiceId: elevenVoiceId,
        // turbo v2.5 cok dillidir ve Turkce'yi dogru telaffuz eder
        model: "eleven_turbo_v2_5",
        stability: 0.5,
        similarityBoost: 0.75,
        optimizeStreamingLatency: 3,
      }
    : {
        // ElevenLabs yoksa Azure'un Turkce neural sesleri iyi bir varsayilandir
        provider: "azure",
        voiceId: "tr-TR-EmelNeural",
      };

  return {
    name: "TR Sesli Asistan",
    firstMessage:
      "Merhaba, ben Ada. Size nasil yardimci olabilirim?",
    firstMessageMode: "assistant-speaks-first",

    transcriber: {
      provider: "deepgram",
      model: "nova-2",
      language: "tr",
      smartFormat: true,
    },

    model: {
      provider: optionalEnv("LLM_PROVIDER", "anthropic"),
      model: optionalEnv("LLM_MODEL", "claude-opus-5"),
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: [
            "Sen bir Turk sirketinin telefonla konusan sesli asistanisin. Adin Ada.",
            "",
            "KONUSMA KURALLARI",
            "- Sadece Turkce konus. Karsi taraf baska dilde konusursa yine Turkce cevap ver.",
            "- Cumlelerin kisa olsun; tek seferde en fazla iki cumle kur. Bu bir telefon gorusmesi, makale degil.",
            "- Madde isareti, emoji, markdown veya kisaltma kullanma; her sey sesli okunacak.",
            "- Sayilari ve tarihleri yaziyla soyle: '14:30' yerine 'on dort otuz', '2026' yerine 'iki bin yirmi alti'.",
            "- Telefon numaralarini rakam rakam, ikiserli gruplayarak tekrar et ve dogrulat.",
            "- Emin olmadigin bir sey varsa uydurma; 'bunu su an goremiyorum, sizi ilgili birime aktarabilirim' de.",
            "- Karsi taraf sozunu keserse hemen sus ve onu dinle.",
            "",
            "GOREV",
            "- Arayanin talebini anla, gerekli bilgileri (ad soyad, telefon, tarih/saat) tek tek ve teyit ederek topla.",
            "- Randevu talebi varsa once musait zamani sor, sonra randevu_olustur aracini cagir.",
            "- Konu bittiginde kibarca ozetle ve gorusmeyi kapat.",
          ].join("\n"),
        },
      ],
      tools: serverUrl
        ? [
            {
              type: "function",
              function: {
                name: "randevu_olustur",
                description:
                  "Arayan kisi icin randevu kaydi olusturur. Ad soyad, telefon ve tarih/saat teyit edildikten sonra cagrilir.",
                parameters: {
                  type: "object",
                  properties: {
                    ad_soyad: { type: "string", description: "Arayanin adi ve soyadi" },
                    telefon: { type: "string", description: "E.164 formatinda telefon, orn. +905321234567" },
                    tarih_saat: { type: "string", description: "ISO 8601, orn. 2026-09-15T14:30:00+03:00" },
                    not: { type: "string", description: "Randevu ile ilgili serbest metin not" },
                  },
                  required: ["ad_soyad", "telefon", "tarih_saat"],
                },
              },
              server: { url: `${serverUrl}/vapi/tools` },
            },
          ]
        : [],
    },

    voice,

    // Gorusme hijyeni
    silenceTimeoutSeconds: 20,
    maxDurationSeconds: 600,
    backgroundSound: "off",
    endCallPhrases: ["hosca kalin", "iyi gunler dilerim", "gorusmek uzere"],
    startSpeakingPlan: { waitSeconds: 0.4 },

    // Tum olaylar (transcript, end-of-call-report, tool cagrilari) buraya dusler
    ...(serverUrl
      ? { server: { url: `${serverUrl}/vapi/webhook`, secret: serverSecret } }
      : {}),
  };
}
