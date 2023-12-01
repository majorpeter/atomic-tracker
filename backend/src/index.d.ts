import session from "express-session";

declare module "express-session" {
  interface SessionData {
    userId: number;
    userName: string;
    interfaceLanguage: string;
  }
}
