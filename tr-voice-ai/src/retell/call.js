/**
 * Kendi numarani Retell uzerinden aratir.
 *
 *   npm run retell:call
 *   npm run retell:call -- +905321234567
 */
import { env, optionalEnv } from "../lib/http.js";
import { retell } from "./client.js";

const target = process.argv[2] || env("MY_TEST_NUMBER");

const call = await retell("/v2/create-phone-call", {
  method: "POST",
  body: {
    from_number: env("TR_DID_NUMBER"),
    to_number: target,
    override_agent_id: optionalEnv("RETELL_AGENT_ID") || undefined,
    retell_llm_dynamic_variables: {
      musteri_adi: optionalEnv("TEST_CUSTOMER_NAME", "degerli musterimiz"),
    },
  },
});

console.log(`Arama baslatildi: ${call.call_id} -> ${target}`);
console.log(`Durum: ${call.call_status}`);
