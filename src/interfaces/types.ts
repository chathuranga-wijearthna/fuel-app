export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'

export interface OrderResponse {
  id: string
  tailNumber: string
  airportIcao: string
  requestedFuelVolume: number
  deliveryWindowStart: string
  deliveryWindowEnd: string
  status: OrderStatus
  createdAt: string
}

export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export type AppRole = 'AIRCRAFT_OPERATOR' | 'OPERATIONS_MANAGER'

export interface JwtPayload {
    sub: string;
    roles?: Authority[];
    exp?: number;
    [key: string]: any;
}

export interface Authority {
    authority: string
}