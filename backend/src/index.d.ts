import session from "express-session";

declare module "express-session" {
  interface SessionData {
    userId: number;
    userName: string;
    interfaceLanguage: string;
    pendingConfig: {
      gCal?: {
        client_id: string;
        client_secret: string;
        redirect_uri: string;
      };
    };
  }
}
