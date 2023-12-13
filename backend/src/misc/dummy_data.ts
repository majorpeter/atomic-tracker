import { Api } from "../lib/api";

export const DUMMY_TODOS: Api.Todos.type = {
  todos: [
    { uid: "1", summary: "Testing", repeats: false, due: "2023-10-01" },
    {
      uid: "2",
      summary: "Documentation",
      repeats: false,
      due: "2023-11-01",
    },
    {
      uid: "3",
      summary: "Water plants",
      repeats: true,
      due: "2023-11-30",
    },
    {
      uid: "4",
      summary: "Grocery shopping",
      repeats: false,
      due: "2023-12-01",
    },
    {
      uid: "5",
      summary: "Wash car",
      repeats: true,
      due: "2023-12-02",
    },
    {
      uid: "6",
      summary: "Select wall paint color",
      repeats: false,
    },
  ],
};

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

export const DUMMY_PROJECTS: {
  title: string;
  progressPercent: number;
  lastChangedDaysAgo: number;
}[] = [
  { title: "Read Atomic Habits", lastChangedDaysAgo: 10, progressPercent: 95 },
  { title: "Reorganize furniture", lastChangedDaysAgo: 6, progressPercent: 30 },
  {
    title: "Automate lights in living room",
    lastChangedDaysAgo: 2,
    progressPercent: 50,
  },
  {
    title: "Develop habit tracker site",
    progressPercent: 5,
    lastChangedDaysAgo: 0,
  },
];
