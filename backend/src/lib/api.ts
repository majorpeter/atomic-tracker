export namespace Api {
  export namespace Habits {
    export const path = "/habits";

    export type type = {
      id: number;
      name: string;
      iconName: string;
      value: number;
      targetValue: number;
      historicalPercent: number;
    }[];
  }

  export namespace Habit {
    export const path = "/habit/:id";
    export type get_params = { id: number };

    export type type = {
      name: string;
      iconName: string;
      targetValue: number;
      periodLength: number;
      historyLength: number;
      trackedInPeriod: number;
      history: {
        id: number;
        date: string;
      }[];
    };

    export namespace Track {
      export const path = "/habit/track";
      export const pathWithId = "/habit/track/:id";
      export type deleteParams = { id: number };

      export type post_type = {
        habitId: number;
        date: string;
      };
      export type post_resp = {
        id: number;
      };
    }
  }

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
      webui?: string;
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
    export type type = {
      textToday: string;
      history: {
        date: string;
        count: number;
      }[];
    };

    export namespace Date {
      export const pathWithDate = "/journal/:date";
      export type params = { date: string };

      export type type = { text: string };
    }
  }
}
