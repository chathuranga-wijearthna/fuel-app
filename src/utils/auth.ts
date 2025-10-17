import { jwtDecode } from 'jwt-decode';
import {AppRole, Authority, JwtPayload} from "../interfaces/types";

export function setToken(token: string) {
    localStorage.setItem('token', token);
}

export function getToken(): string | null {
    return localStorage.getItem('token');
}

export function clearToken() {
    localStorage.removeItem('token');
}

export function getJwtPayload(token: string): JwtPayload | null {
    try {
        return jwtDecode<JwtPayload>(token);
    } catch {
        return null;
    }
}

export function getRolesFromToken(token: string): AppRole[] {

    const payload = getJwtPayload(token);

    const raw: Authority[] = payload?.roles || [];

    const normalized = raw.map(r => r.authority.startsWith('ROLE_') ? r.authority.slice(5) : r.authority);

    const allowed: AppRole[] = ['AIRCRAFT_OPERATOR', 'OPERATIONS_MANAGER'];

    return normalized.filter(role => (allowed as string[]).includes(role)) as AppRole[];
}

export function hasAnyRole(token: string | null, roles: AppRole[]): boolean {
    if (!token) return false;
    const userRole = getRolesFromToken(token);
    return roles.some(role => userRole.includes(role));
}


export function isAuthenticated(): boolean {
    const token = getToken();

    if (!token) return false;

    const p = getJwtPayload(token);

    if (!p?.exp) return true;

    return Date.now() < p.exp * 1000;
}