// Demo credentials. In production replace with NextAuth + institutional SSO + bcrypt-hashed creds in DB.
export const ADMIN_USERNAME = "admin";
export const ADMIN_PASSWORD = "ChangeMe@123";
export const SESSION_KEY = "ymc_admin_session_v1";

export function loginValid(u: string, p: string) {
  return u.trim() === ADMIN_USERNAME && p === ADMIN_PASSWORD;
}
