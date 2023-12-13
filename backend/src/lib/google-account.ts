import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

/**
 * @see https://github.com/googleapis/google-api-nodejs-client/blob/main/samples/oauth2.js
 */
export function generateAuthUrl(options: {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}) {
  const client = new google.auth.OAuth2(options);
  return client.generateAuthUrl({ access_type: "offline", scope: SCOPES });
}

export async function getTokenFromCode(params: {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  code: string;
}): Promise<string> {
  const client = new google.auth.OAuth2({
    clientId: params.clientId,
    clientSecret: params.clientSecret,
    redirectUri: params.redirectUri,
  });
  const { tokens } = await client.getToken(params.code);
  return tokens.refresh_token!;
}

export async function authorize(params: {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}): Promise<OAuth2Client> {
  const client = new google.auth.OAuth2({
    clientId: params.clientId,
    clientSecret: params.clientSecret,
  });
  client.credentials.refresh_token = params.refreshToken;
  return client;
}

/**
 * Lists the next 100 events on the user's primary calendar.
 */
export async function listEvents(auth: OAuth2Client) {
  const calendar = google.calendar({ version: "v3", auth });
  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin: new Date().toISOString(),
    maxResults: 100,
    singleEvents: true,
    orderBy: "startTime",
  });
  return res.data.items;
}
