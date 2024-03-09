import session from "express-session";

declare module "express-session" {
  interface SessionData {
    passport: {
      user: {
        id: number;
        name: string;
        userName: string;
        lang: string;
      };
    };
    loginMethod?: "local" | "google";
    userAgent: string;
    pendingConfig: {
      gCal?: {
        client_id: string;
        client_secret: string;
        redirect_uri: string;
      };
    };
  }
}
