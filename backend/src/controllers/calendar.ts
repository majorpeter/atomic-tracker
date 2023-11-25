import { Express } from "express";
import { Api } from "../lib/api";
import { listEvents } from "../lib/google-account";
import { calendar_v3 } from "googleapis";

function filterEvents(
  events: calendar_v3.Schema$Event[],
  start: Date,
  end?: Date
): Api.Calendar.type["today"] {
  const filtered = events
    .filter((e) => {
      const d = new Date(e.start!.dateTime || e.start!.date!);
      return start <= d && (!end || d < end);
    })
    .map((item) => ({
      summary: item.summary!,
      dateTime: item.start?.dateTime!,
      date: item.start?.date!,
      url: item.htmlLink ?? undefined,
    }));

  return filtered.length ? filtered : undefined;
}

export default function (app: Express) {
  app.get<{}, Api.Calendar.type>(Api.Calendar.path, async (_, res) => {
    const events = await listEvents();

    const startToday = new Date();
    startToday.setHours(0, 0, 0, 0);

    const tonight = new Date();
    tonight.setHours(0, 0, 0, 0);
    tonight.setDate(tonight.getDate() + 1);

    const endWeek = new Date(startToday);
    endWeek.setDate(endWeek.getDate() - endWeek.getDay() + 7 + 1); // +1 for starting on Monday

    const endNextWeek = new Date(endWeek);
    endNextWeek.setDate(endNextWeek.getDate() + 7);

    const endThisMonth = new Date(startToday);
    endThisMonth.setDate(1);
    endThisMonth.setMonth(endThisMonth.getMonth() + 1);

    const endNextMonth = new Date(endThisMonth);
    endNextMonth.setMonth(endNextMonth.getMonth() + 1);
    console.log(endNextMonth);

    /*
     * may not be the most efficient way of iterating but good enough for the amount of data I'm handling
     */
    res.send({
      today: filterEvents(events!, startToday, tonight),
      thisWeek: filterEvents(events!, tonight, endWeek),
      nextWeek: filterEvents(events!, endWeek, endNextWeek),
      thisMonth: filterEvents(events!, endNextWeek, endThisMonth), // "end < start" maybe
      nextMonth: filterEvents(events!, endThisMonth, endNextMonth),
      later: filterEvents(events!, endNextMonth),
    });
  });
}
