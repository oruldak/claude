import { apiRequest, env, optionalEnv } from "../lib/http.js";

const baseUrl = optionalEnv("VAPI_BASE_URL", "https://api.vapi.ai");

export function vapi(path, options = {}) {
  return apiRequest(baseUrl, path, { ...options, apiKey: env("VAPI_API_KEY") });
}
