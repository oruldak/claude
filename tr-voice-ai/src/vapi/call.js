/**
 * Kendi numarani (veya verilen numarayi) Vapi uzerinden aratir.
 *
 *   npm run vapi:call                 -> .env icindeki MY_TEST_NUMBER'i arar
 *   npm run vapi:call -- +905321234567
 */
import { env, optionalEnv } from "../lib/http.js";
import { vapi } from "./client.js";

const target = process.argv[2] || env("MY_TEST_NUMBER");

if (!/^\+90\d{10}$/.test(target)) {
  console.warn(
    `Uyari: ${target} standart bir TR numarasina benzemiyor. Beklenen format: +905321234567`,
  );
}

const call = await vapi("/call", {
  method: "POST",
  body: {
    phoneNumberId: env("VAPI_PHONE_NUMBER_ID"),
    assistantId: env("VAPI_ASSISTANT_ID"),
    customer: { number: target, numberE164CheckEnabled: false },
    // Asistan promptunda {{musteri_adi}} gibi degiskenler kullanabilirsin
    assistantOverrides: {
      variableValues: {
        musteri_adi: optionalEnv("TEST_CUSTOMER_NAME", "degerli musterimiz"),
      },
    },
  },
});

console.log(`Arama baslatildi: ${call.id} -> ${target}`);
console.log(`Durum: ${call.status}`);
console.log(`Kayit ve transcript: https://dashboard.vapi.ai/calls/${call.id}`);
