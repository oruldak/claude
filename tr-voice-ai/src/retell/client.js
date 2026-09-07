import { apiRequest, env, optionalEnv } from "../lib/http.js";

const baseUrl = optionalEnv("RETELL_BASE_URL", "https://api.retellai.com");

export function retell(path, options = {}) {
  return apiRequest(baseUrl, path, { ...options, apiKey: env("RETELL_API_KEY") });
}
