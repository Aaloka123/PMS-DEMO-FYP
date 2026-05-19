const TOKEN_KEY = "token";
const ROLE_KEY = "role";

export type AuthRole = "admin" | "user";

export function getAuth(): { token: string | null; role: AuthRole | null } {
  const token = localStorage.getItem(TOKEN_KEY);
  const role = localStorage.getItem(ROLE_KEY) as AuthRole | null;
  if (role !== "admin" && role !== "user") {
    return { token, role: null };
  }
  return { token, role };
}

export function setAuth(token: string, role: AuthRole): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role);
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
}
