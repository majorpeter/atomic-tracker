import fs from "fs/promises";
import path from "path";

import fetch from "node-fetch";
import { xml2js } from "xml-js";

async function getConfig(): Promise<{
  url: string;
  api_key: string;
  inprogress_status_id: number;
}> {
  return JSON.parse(
    (
      await fs.readFile(
        path.resolve(__dirname, "..", "..", "dist", "redmine.json")
      )
    ).toString()
  );
}

function getElementText(key: string, element: any): string {
  const item = element.elements.find((item: any) => item.name == key);
  return item.elements[0].text;
}

export async function fetchInProgress(): Promise<
  {
    id: number;
    subject: string;
    donePercent: number;
    createdAt: string;
    updatedAt: string;
  }[]
> {
  const config = await getConfig();
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

  return js.map((item) => ({
    id: parseInt(getElementText("id", item)),
    subject: getElementText("subject", item),
    donePercent: parseInt(getElementText("done_ratio", item)),
    createdAt: getElementText("created_on", item),
    updatedAt: getElementText("updated_on", item),
  }));
}
