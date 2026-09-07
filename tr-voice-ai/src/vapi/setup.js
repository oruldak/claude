/**
 * Vapi tarafini bastan kurar:
 *   1) TR operatorunun SIP trunk'ini "byo-sip-trunk" kimlik bilgisi olarak tanitir
 *   2) Turkce asistani olusturur
 *   3) TR DID numarasini "byo-phone-number" olarak baglar (inbound + outbound ayni credential)
 *
 * Kullanim: npm run vapi:setup
 * Ciktidaki ID'leri .env dosyasina yaz; ikinci calistirmada var olanlar atlanir.
 */
import { env, optionalEnv, printIds } from "../lib/http.js";
import { vapi } from "./client.js";
import { buildAssistant } from "./assistant.config.js";

const publicUrl = optionalEnv("PUBLIC_URL").replace(/\/$/, "");
const serverSecret = optionalEnv("VAPI_SERVER_SECRET");

async function createSipCredential() {
  const existing = optionalEnv("VAPI_CREDENTIAL_ID");
  if (existing) {
    console.log(`SIP credential zaten var: ${existing}`);
    return existing;
  }

  const realm = optionalEnv("SIP_REALM");
  const credential = await vapi("/credential", {
    method: "POST",
    body: {
      provider: "byo-sip-trunk",
      name: "TR SIP Trunk",
      gateways: [
        {
          ip: env("SIP_GATEWAY_HOST"),
          port: Number(optionalEnv("SIP_GATEWAY_PORT", "5060")),
          inboundEnabled: true,
          outboundEnabled: true,
        },
      ],
      // TR operatorleri numarayi +90'li (E.164) bekler
      outboundLeadingPlusEnabled: true,
      outboundAuthenticationPlan: {
        authUsername: env("SIP_USERNAME"),
        authPassword: env("SIP_PASSWORD"),
        // Operator REGISTER istiyorsa realm'i ver; sadece IP/static trunk ise gerekmez
        ...(realm ? { sipRegisterPlan: { realm } } : {}),
      },
    },
  });

  console.log(`SIP credential olusturuldu: ${credential.id}`);
  return credential.id;
}

async function createAssistant() {
  const existing = optionalEnv("VAPI_ASSISTANT_ID");
  if (existing) {
    console.log(`Asistan zaten var: ${existing}`);
    return existing;
  }

  const assistant = await vapi("/assistant", {
    method: "POST",
    body: buildAssistant({ serverUrl: publicUrl || undefined, serverSecret }),
  });

  console.log(`Asistan olusturuldu: ${assistant.id}`);
  return assistant.id;
}

async function attachPhoneNumber({ credentialId, assistantId }) {
  const existing = optionalEnv("VAPI_PHONE_NUMBER_ID");
  if (existing) {
    console.log(`Numara zaten bagli: ${existing}`);
    return existing;
  }

  const phoneNumber = await vapi("/phone-number", {
    method: "POST",
    body: {
      provider: "byo-phone-number",
      name: "TR DID",
      number: env("TR_DID_NUMBER"),
      // 0850 / 444 gibi numaralarda E.164 dogrulamasi takilabilir
      numberE164CheckEnabled: false,
      credentialId,
      // Inbound: bu numaraya gelen aramayi bu asistan karsilar
      assistantId,
      ...(publicUrl ? { server: { url: `${publicUrl}/vapi/webhook`, secret: serverSecret } } : {}),
    },
  });

  console.log(`Numara baglandi: ${phoneNumber.id}`);
  return phoneNumber.id;
}

const credentialId = await createSipCredential();
const assistantId = await createAssistant();
const phoneNumberId = await attachPhoneNumber({ credentialId, assistantId });

printIds("Vapi kurulumu tamam", {
  VAPI_CREDENTIAL_ID: credentialId,
  VAPI_ASSISTANT_ID: assistantId,
  VAPI_PHONE_NUMBER_ID: phoneNumberId,
});

console.log(
  [
    "Inbound icin son adim: operator panelinde bu DID'e gelen aramalari Vapi'ye yonlendir.",
    `  Hedef SIP URI:  {aranan_numara}@${credentialId}.sip.vapi.ai   (AB bolgesi icin: ${credentialId}.sip.eu.vapi.ai)`,
    "Operatorun 'gelen cagri yonlendirme / inbound routing' ekraninda bu adresi tanimlaman gerekir.",
  ].join("\n"),
);
