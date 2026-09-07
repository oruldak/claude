import "dotenv/config";

export function env(name, fallback = undefined) {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === "") {
    throw new Error(`.env dosyasinda ${name} tanimli degil`);
  }
  return value;
}

export function optionalEnv(name, fallback = "") {
  const value = process.env[name];
  return value === undefined || value === "" ? fallback : value;
}

/**
 * Vapi ve Retell REST API'leri icin ince bir fetch sarmalayicisi.
 * Hata durumunda govdeyi de mesaja koyar; API hatalarini kor kor yutmaz.
 */
export async function apiRequest(baseUrl, path, { method = "GET", apiKey, body } = {}) {
  const response = await fetch(new URL(path, baseUrl), {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await response.text();
  const payload = text ? safeJson(text) : null;

  if (!response.ok) {
    throw new Error(`${method} ${path} -> ${response.status}\n${text}`);
  }
  return payload;
}

function safeJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export function printIds(title, pairs) {
  console.log(`\n=== ${title} ===`);
  for (const [key, value] of Object.entries(pairs)) {
    console.log(`${key}=${value}`);
  }
  console.log("Yukaridaki satirlari .env dosyana kopyala.\n");
}
