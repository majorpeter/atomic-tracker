import fetch from "node-fetch";
import { xml2js } from "xml-js";

function getElementText(key: string, element: any): string | null {
  const item = element.elements.find((item: any) => item.name == key);
  if (!item) {
    return null;
  }
  return item.elements[0].text;
}

export async function fetchInProgress(config: {
  url: string;
  api_key: string;
  inprogress_status_id: number;
}): Promise<{
  inprogress: {
    id: number;
    subject: string;
    donePercent: number;
    createdAt: string;
    updatedAt: string;
    url: string;
  }[];
} | null> {
  const url =
    config.url +
    "/issues.xml?" +
    new URLSearchParams({
      status_id: config.inprogress_status_id.toString(),
    });
  try {
    const resp = await fetch(
      url,

      {
        headers: {
          "X-Redmine-API-Key": config.api_key,
        },
      }
    );
    const body = xml2js(resp.body.read().toString());
    const js: any[] | undefined = body.elements[0].elements;

    if (js) {
      return {
        inprogress: js.map((item) => ({
          id: parseInt(getElementText("id", item) ?? "-1"),
          subject: getElementText("subject", item) as string,
          donePercent: parseInt(getElementText("done_ratio", item) ?? "0"),
          createdAt: getElementText("created_on", item) as string,
          updatedAt: getElementText("updated_on", item) as string,
          url: config.url + "/issues/" + getElementText("id", item),
        })),
      };
    } else if (body.elements[0].attributes.total_count == 0) {
      return { inprogress: [] };
    }
  } catch (e) {
    console.error(e);
  }

  return null;
}
