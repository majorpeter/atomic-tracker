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

export async function fetchUpdatedSince(
  since: Date | undefined,
  config: {
    url: string;
    api_key: string;
  }
) {
  const LIMIT = 100;
  const changes = [];
  try {
    for (let offset = 0; ; offset += LIMIT) {
      const listingUrl =
        config.url +
        "/issues.json?" +
        new URLSearchParams({
          offset: offset.toString(),
          limit: LIMIT.toString(),
          status_id: "*",
          sort: "updated_on",
          ...(since
            ? {
                updated_on: ">=" + since.toISOString().split(".")[0] + "Z",
              }
            : {}),
        });
      const listingResp = await fetch(listingUrl, {
        headers: {
          "X-Redmine-API-Key": config.api_key,
        },
      });
      const listingBody = (await listingResp.json()) as {
        issues: {
          id: number;
          subject: string;
          description: string;
          created_on: string; // iso date
          updated_on: string; // iso date
          status: { id: number; name: string };
        }[];
        limit: number;
        offset: number;
        total_count: number;
      };

      for (const issue of listingBody.issues) {
        const issueUrl =
          config.url +
          "/issues/" +
          issue.id.toString() +
          ".json?" +
          new URLSearchParams({
            include: "journals",
          });

        const issueResp = await fetch(issueUrl, {
          headers: {
            "X-Redmine-API-Key": config.api_key,
          },
        });
        const issueBody = (await issueResp.json()) as {
          issue: {
            id: number;
            journals: {
              id: number;
              created_on: string;
              details: {
                property: string;
                name: string;
                old_value: string | null;
                new_value: string;
              }[];
              notes: string;
            }[];
          };
        };

        issueBody.issue.journals
          .filter((item) =>
            since
              ? new Date(item.created_on).getTime() >= since.getTime()
              : true
          )
          .every((item) => {
            changes.push({
              journal_created: new Date(item.created_on),
              issue_updated: new Date(issue.updated_on),
              journal: item,
              issue: issue,
            });
          });
      }
      if (listingBody.offset + LIMIT >= listingBody.total_count) {
        break;
      }
    }
  } catch (e) {
    console.log(e);
  }

  return;
}
