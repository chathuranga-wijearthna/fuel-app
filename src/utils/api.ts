declare const __API_BASE__: string;

import type {
  OrderResponse,
  OrderStatus,
  PageResponse,
} from "../interfaces/types";

const BASE = __API_BASE__;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE}${path}`, init);
  } catch (e) {
    throw new Error('Unable to reach server');
  }
  if (!response.ok) await throwApiError(response);
  return response.json() as Promise<T>;
}

async function throwApiError(response: Response): Promise<never> {
  let message = `Request failed (${response.status})`;
  try {
    const data = await response.json();
    const candidates = [
      (data && data.message) as unknown,
      (data && data.error) as unknown,
      (data && data.detail) as unknown,
      (data && data.title) as unknown,
      (Array.isArray(data?.errors) && data.errors[0]?.message) as unknown,
    ].filter(Boolean) as string[];
    if (candidates.length > 0 && typeof candidates[0] === "string") {
      message = candidates[0];
    }
  } catch {
    try {
      const text = await response.text();
      if (text) message = text;
    } catch {
      // ignore
    }
  }
  throw new Error(message);
}

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
  if (!response.ok) await throwApiError(response);
  return response.json();
}

export async function login(email: string, password: string): Promise<string> {
  const response = await fetch(`${BASE}/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) await throwApiError(response);
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
  return request<OrderResponse>(`/v1/order`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
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

  return request<PageResponse<OrderResponse>>(`/v1/order/list?${param.toString()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
}

export async function updateStatus(
  id: string,
  status: OrderStatus
): Promise<OrderResponse> {
  return request<OrderResponse>(`/v1/order/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ status }),
  });
}
