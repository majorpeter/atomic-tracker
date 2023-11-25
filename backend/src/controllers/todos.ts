import { DAVObject, createDAVClient } from "tsdav";
import { Express } from "express";

import fs from "fs/promises";
import path from "path";
import { Api } from "../lib/api";

function findAttribute(object: DAVObject, path: string[]): string | undefined {
  const currentPath = [];
  for (const row of (object.data as string).split("\n")) {
    if (row.startsWith("BEGIN:")) {
      currentPath.push(row.substring("BEGIN:".length));
      continue;
    }

    if (row.startsWith("END:")) {
      currentPath.pop();
    }

    if (currentPath.length == path.length - 1) {
      if (currentPath.every((item, index) => item == path[index])) {
        if (row.startsWith(path[path.length - 1] + ":")) {
          return row
            .substring(path[path.length - 1].length + 1)
            .replace(/\\,/g, ",") // ',' is escaped in DAVObject
            .replace(/\\n/g, "\n");
        } else if (row.startsWith(path[path.length - 1] + ";")) {
          return row.substring(row.indexOf(":") + 1);
        }
      }
    }
  }
}

function timestampToIso(t: string | undefined): string | undefined {
  if (t === undefined) {
    return undefined;
  }

  if (t.indexOf("T") == 8) {
    return (
      t.substring(0, 4) +
      "-" +
      t.substring(4, 6) +
      "-" +
      t.substring(6, 8) +
      "T" +
      t.substring(9, 11) +
      ":" +
      t.substring(11, 13) +
      ":" +
      t.substring(13, 15)
    );
  }

  return t.substring(0, 4) + "-" + t.substring(4, 6) + "-" + t.substring(6, 8);
}

async function fetchCalendarObjects(): Promise<DAVObject[]> {
  const config: { serverUrl: string; user: string; token: string } = JSON.parse(
    (await fs.readFile(path.resolve(__dirname, "..", "todos.json"))).toString()
  );

  const client = await createDAVClient({
    serverUrl: config.serverUrl,
    credentials: {
      username: config.user,
      password: config.token,
    },
    authMethod: "Basic",
    defaultAccountType: "caldav",
  });

  const calendars = await client.fetchCalendars();
  const calendarObjects = await client.fetchCalendarObjects({
    calendar: calendars[0],
    filters: [
      {
        "comp-filter": {
          _attributes: {
            name: "VCALENDAR",
          },
        },
      },
    ],
  });

  return calendarObjects;
}

function sortConvFn(todo: Api.Todos.type["todos"][0]): number {
  const MAX_TIME = 10000000000000; // Date value from 2286-11-20

  if (todo.due) {
    return new Date(todo.due).getTime();
  }

  // TODO sort these based on priority/creation date
  return MAX_TIME;
}

export default function (app: Express) {
  app.get<{}, Api.Todos.type>(Api.Todos.path, async (_, res) => {
    const todos: Api.Todos.type["todos"] = (await fetchCalendarObjects())
      .map((i) => ({
        uid: findAttribute(i, ["VCALENDAR", "VTODO", "UID"])!,
        summary: findAttribute(i, ["VCALENDAR", "VTODO", "SUMMARY"]),
        description: findAttribute(i, ["VCALENDAR", "VTODO", "DESCRIPTION"]),
        due: timestampToIso(findAttribute(i, ["VCALENDAR", "VTODO", "DUE"])),
        repeats:
          findAttribute(i, ["VCALENDAR", "VTODO", "RRULE"]) !== undefined,
        done: findAttribute(i, ["VCALENDAR", "VTODO", "STATUS"]) == "COMPLETED",
        __data: i.data,
      }))
      .filter((i) => !i.done)
      .sort((a, b) => sortConvFn(a) - sortConvFn(b));

    res.send({
      todos,
    });
  });
}
