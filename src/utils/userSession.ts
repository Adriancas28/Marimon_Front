export function getSessionValue(key: string): string {
  return sessionStorage.getItem(key) || localStorage.getItem(key) || "";
}

export function getUserName(): string {
  const nombre = getSessionValue("nombre");
  if (nombre) return nombre;

  const correo = getSessionValue("correo");
  if (correo) {
    return correo.split('@')[0]; // Muestra la parte anterior al @
  }

  return "Cliente";
}

export function isAuthenticated(): boolean {
  return Boolean(getSessionValue("token"));
}
