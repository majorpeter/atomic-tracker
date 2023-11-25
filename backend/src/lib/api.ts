export namespace Api {
  export namespace Todos {
    export const path = "/todos";

    export type type = {
      todos: {
        uid: string;
        summary?: string;
        description?: string;
        due?: string;
        repeats?: boolean;
      }[];
    };

    export type get_query = { dummy?: unknown };
  }

  export namespace Calendar {
    export const path = "/calendar";

    type EventList = {
      summary: string;
      /// date, in the format "yyyy-mm-dd", if this is an all-day event
      date?: string;
      /// ISO datetime str
      dateTime?: string;
      url?: string;
    }[];

    export type type = {
      today?: EventList;
      thisWeek?: EventList;
      nextWeek?: EventList;
      thisMonth?: EventList;
      nextMonth?: EventList;
      later?: EventList;
    };

    export type get_query = { dummy?: unknown };
  }

  export namespace Journal {
    export const path = "/journal";

    export type type = { items: string[] };
  }
}
