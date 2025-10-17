declare const __API_BASE__: string;

import type {
  OrderResponse,
  OrderStatus,
  PageResponse,
} from "../interfaces/types";

const BASE = __API_BASE__;

export async function register(
  email: string,
  password: string,
  userRole: string
) {
  const response = await fetch(`${BASE}/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, userRole }),
  });
  if (!response.ok) throw await response.json();
  return response.json();
}

export async function login(email: string, password: string): Promise<string> {
  const response = await fetch(`${BASE}/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw await response.json();
  const data = await response.json();
  return data.token as string;
}

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function createOrder(payload: {
  tailNumber: string;
  airportIcao: string;
  requestedFuelVolume: number;
  deliveryWindowStart: string;
  deliveryWindowEnd: string;
}): Promise<OrderResponse> {
  const response = await fetch(`${BASE}/v1/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw await response.json();
  return response.json();
}

export async function listOrders(
  payload: {
    airportIcao: string;
    tailNumber?: string;
    status?: OrderStatus;
  },
  params: { page?: number; size?: number } = {}
): Promise<PageResponse<OrderResponse>> {
  const param = new URLSearchParams({
    page: String(params.page ?? 0),
    size: String(params.size ?? 10),
  });

  const response = await fetch(
    `${BASE}/v1/orders/list-order?${param.toString()}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) throw await response.json();
  return response.json();
}

export async function updateStatus(
  id: string,
  status: OrderStatus
): Promise<OrderResponse> {
  const response = await fetch(`${BASE}/v1/orders/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw await response.json();
  return response.json();
}
