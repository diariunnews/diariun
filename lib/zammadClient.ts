// /lib/zammadClient.ts
export type ZammadTicket = {
  id: number;
  number?: string;
  title: string;
  state?: string;
  created_at?: string;
};

function getConfig() {
  const base = process.env.ZAMMAD_URL;
  const token = process.env.ZAMMAD_TOKEN;
  if (!base || !token) return { base: null, token: null };
  return { base, token };
}

export async function zammadFetch(path: string, init: RequestInit = {}) {
  const { base, token } = getConfig();
  if (!base || !token) {
    // Mock si no hay configuración para no romper el UI
    if (init.method === "GET" || !init.method) {
      return {
        tickets: [
          { id: 1, title: "Ejemplo (configura ZAMMAD_URL/TOKEN)", state: "new", created_at: new Date().toISOString() },
        ],
      };
    }
    throw new Error("Zammad no configurado");
  }

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Token token=${token}`,
    ...(init.headers || {}),
  } as Record<string, string>;

  const res = await fetch(`${base}${path}`, { ...init, headers });
  const text = await res.text();

  let json: any = null;
  try { json = text ? JSON.parse(text) : null; } catch {
    throw new Error(`Zammad respondió no-JSON (${res.status})`);
  }
  if (!res.ok) {
    const msg = (json && (json.message || json.error)) || `Error ${res.status}`;
    throw new Error(msg);
  }
  return json;
}

// Helpers opcionales
export async function listTickets(page = 1) {
  return zammadFetch(`/tickets?per_page=25&page=${page}`, { method: "GET" });
}

export async function ticketDetail(id: number) {
  return zammadFetch(`/tickets/${id}?include=articles`, { method: "GET" });
}

export async function createTicket(payload: {
  title: string;
  group?: string | number;
  customer?: string; // email del cliente
  article: { body: string; type?: string; internal?: boolean };
}) {
  return zammadFetch(`/tickets`, { method: "POST", body: JSON.stringify(payload) });
}

export async function replyTicket(payload: {
  ticket_id: number;
  body: string;
  type?: string;
  internal?: boolean;
}) {
  return zammadFetch(`/ticket_articles`, { method: "POST", body: JSON.stringify(payload) });
}
