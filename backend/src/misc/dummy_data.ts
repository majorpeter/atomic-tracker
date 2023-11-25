import { Api } from "../lib/api";

export const DUMMY_CALENDAR: Api.Calendar.type = {
  today: [
    {
      dateTime: "2023-11-01 08:00",
      summary: "Work",
    },
    {
      dateTime: "2023-11-01 14:00",
      summary: "Important meeting",
    },
  ],
  thisWeek: [
    {
      dateTime: "2023-11-05 09:00",
      summary: "Kickoff meeting",
    },
    { dateTime: "2023-11-06 12:00", summary: "Lunch with John" },
    { dateTime: "2023-11-07 18:30", summary: "Movies" },
  ],
  nextWeek: [
    {
      dateTime: "2023-12-02 19:00",
      summary: "Birtday party",
    },
  ],
};
