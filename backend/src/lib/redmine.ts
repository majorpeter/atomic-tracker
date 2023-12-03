import fs from "fs/promises";
import path from "path";

import fetch from "node-fetch";
import { xml2js } from "xml-js";

async function getConfig(): Promise<{
  url: string;
  board_url?: string;
  api_key: string;
  inprogress_status_id: number;
} | null> {
  try {
    return JSON.parse(
      (
        await fs.readFile(
          path.resolve(__dirname, "..", "..", "dist", "redmine.json")
        )
      ).toString()
    );
  } catch {
    return null;
  }
}

function getElementText(key: string, element: any): string {
  const item = element.elements.find((item: any) => item.name == key);
  return item.elements[0].text;
}

export async function fetchInProgress(): Promise<{
  inprogress: {
    id: number;
    subject: string;
    donePercent: number;
    createdAt: string;
    updatedAt: string;
    url: string;
  }[];
  url: string;
  board_url?: string;
} | null> {
  const config = await getConfig();
  if (config) {
    const url =
      config.url +
      "/issues.xml?" +
      new URLSearchParams({
        status_id: config.inprogress_status_id.toString(),
      });
    const resp = await fetch(
      url,

      {
        headers: {
          "X-Redmine-API-Key": config.api_key,
        },
      }
    );
    const body = resp.body.read().toString();
    const js: any[] = xml2js(body).elements[0].elements;

    return {
      inprogress: js.map((item) => ({
        id: parseInt(getElementText("id", item)),
        subject: getElementText("subject", item),
        donePercent: parseInt(getElementText("done_ratio", item)),
        createdAt: getElementText("created_on", item),
        updatedAt: getElementText("updated_on", item),
        url: config.url + "/issues/" + getElementText("id", item),
      })),
      url: config.url,
      board_url: config.board_url,
    };
  }
  return null;
}
