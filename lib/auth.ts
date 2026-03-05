import { cookies } from "next/headers";

const SECRET = process.env.JWT_SECRET;;

let _cachedKey: CryptoKey | null = null;

function base64urlEncode(data: Uint8Array): string {
  let binary = "";
  data.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function base64urlDecode(str: string): Uint8Array<ArrayBuffer> {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const buf = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function getKey(): Promise<CryptoKey> {
  if (_cachedKey) return _cachedKey;
  _cachedKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  return _cachedKey;
}

export async function signToken(payload: Record<string, unknown>): Promise<string> {
  const header = base64urlEncode(
    new TextEncoder().encode(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  );
  const body = base64urlEncode(
    new TextEncoder().encode(JSON.stringify(payload))
  );
  const key = await getKey();
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${header}.${body}`)
  );
  return `${header}.${body}.${base64urlEncode(new Uint8Array(sig))}`;
}

export async function verifyToken(
  token: string
): Promise<Record<string, unknown> | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, body, sig] = parts;
    const key = await getKey();
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64urlDecode(sig),
      new TextEncoder().encode(`${header}.${body}`)
    );
    if (!valid) return null;
    const payload = JSON.parse(
      new TextDecoder().decode(base64urlDecode(body))
    );
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<{ userId: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload?.sub) return null;
  return { userId: payload.sub as string };
}
