import fetch from "node-fetch";
import { xml2js } from "xml-js";

export type Journal = {
  id: number;
  created_on: string;
  details: {
    property: string;
    name: string;
    old_value: string | null;
    new_value: string;
  }[];
  notes: string;
};

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

export async function getStatusMapping(config: {
  url: string;
  api_key: string;
}): Promise<{
  issue_statuses: {
    id: number;
    name: string;
    is_closed: boolean;
  }[];
}> {
  const resp = await fetch(config.url + "/issue_statuses.json", {
    headers: {
      "X-Redmine-API-Key": config.api_key,
    },
  });
  return await resp.json();
}

export async function getIssue(
  id: number,
  config: {
    url: string;
    api_key: string;
  }
): Promise<{
  issue: {
    id: number;
    author: { id: number; name: string };
    project: { id: number; name: string };
    subject: string;
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
}> {
  const issueUrl =
    config.url +
    "/issues/" +
    id.toString() +
    ".json?" +
    new URLSearchParams({
      include: "journals",
    });

  const issueResp = await fetch(issueUrl, {
    headers: {
      "X-Redmine-API-Key": config.api_key,
    },
  });
  return await issueResp.json();
}

export async function fetchUpdatedSince(params: {
  since?: Date;
  maxIssues?: number;
  url: string;
  api_key: string;
}) {
  const LIMIT = 100;

  let issuesCount = 0;
  const changes: { journal: Journal; issue: any }[] = [];
  try {
    for (let offset = 0; ; offset += LIMIT) {
      const listingUrl =
        params.url +
        "/issues.json?" +
        new URLSearchParams({
          offset: offset.toString(),
          limit: LIMIT.toString(),
          status_id: "*",
          sort: "updated_on",
          ...(params.since
            ? {
                updated_on:
                  ">=" + params.since.toISOString().split(".")[0] + "Z",
              }
            : {}),
        });
      const listingResp = await fetch(listingUrl, {
        headers: {
          "X-Redmine-API-Key": params.api_key,
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
          project: { id: number; name: string };
        }[];
        limit: number;
        offset: number;
        total_count: number;
      };

      for (const issue of listingBody.issues) {
        const issueBody = await getIssue(issue.id, {
          url: params.url,
          api_key: params.api_key,
        });

        issueBody.issue.journals
          .filter((item) =>
            params.since
              ? new Date(item.created_on).getTime() >= params.since.getTime()
              : true
          )
          .forEach((item) => {
            changes.push({
              journal: item,
              issue: issue,
            });
          });

        issuesCount++;
        if (params.maxIssues && issuesCount == params.maxIssues) {
          return changes;
        }
      }
      if (listingBody.offset + LIMIT >= listingBody.total_count) {
        break;
      }
    }
  } catch (e) {
    console.log(e);
  }

  return changes;
}
