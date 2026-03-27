export function getSessionValue(key: string): string {
  return sessionStorage.getItem(key) || localStorage.getItem(key) || "";
}

export function getUserName(): string {
  return getSessionValue("nombre") || "Cliente";
}

export function isAuthenticated(): boolean {
  return Boolean(getSessionValue("token"));
}
