export namespace Api {
  export namespace Auth {
    export namespace Login {
      export const path = "/api/auth/login";
      export type post_type = {
        userName: string;
        password: string;
      };
    }

    export namespace Logout {
      export const path = "/api/auth/logout";
    }

    export namespace Me {
      export const path = "/api/auth/me";
      export type type = {
        name: string;
        language: string;
      };
    }
  }

  export namespace Habits {
    export const path = "/api/habits";

    export type type = {
      id: number;
      name: string;
      iconName: string | null;
      value: number;
      targetValue: number;
      historicalPercent: number;
    }[];
  }

  export namespace Habit {
    export const path = "/api/habit/:id";
    export type get_params = { id: number };

    export type type = {
      name: string;
      iconName: string | null;
      targetValue: number;
      periodLength: number;
      historyLength: number;
      activities: { id: number; name: string }[];
      trackedInPeriod: {
        value: number;
        count: number;
      };
      history: {
        id: number;
        activityName: string;
        value: number;
        date: string;
      }[];
    };

    export namespace Track {
      export const path = "/api/habit/track";
      export const pathWithId = "/api/habit/track/:id";
      export type deleteParams = { id: number };

      export type post_type = {
        activityId: number;
        date: string;
      };
      export type post_resp = {
        id: number;
      };
    }
  }

  export namespace Todos {
    export const path = "/api/todos";

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
    export const path = "/api/calendar";

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
    export const path = "/api/journal";
    export type type = {
      today: {
        text: string;
        count: number;
      };
      history: {
        date: string;
        count: number;
      }[];
    };

    export namespace Date {
      export const pathWithDate = "/api/journal/:date";
      export type params = { date: string };

      export type type = { text: string };
    }
  }

  export namespace Projects {
    export const path = "/api/projects/inprogress";
    export type get_query = { dummy?: unknown };

    export type type = {
      inprogress: {
        id: number;
        subject: string;
        donePercent: number;
        createdAt: string;
        updatedAt: string;
        url?: string;
      }[];
      url?: string;
      board_url?: string;
    };
  }

  export namespace Config {
    export namespace Habits {
      export const path = "/api/config/habits";

      export type HabitDescriptor = {
        id?: number;
        name: string;
        iconName: string | null;
        targetValue: number;
        periodLength: number;
        historyLength: number;
        activities: {
          id?: number;
          name: string;
          value: number;
        }[];
        archivedActivites: {
          id: number;
          name: string;
        }[];
      };

      export type get_type = {
        habits: HabitDescriptor[];
        archived: { id: number; name: string }[];
      };

      export type post_type =
        | { action: "archive"; id: number }
        | { action: "unarchive"; id: number }
        | { action: "add"; habit: HabitDescriptor }
        | {
            action: "edit";
            habit: HabitDescriptor & Pick<HabitDescriptor, "id">;
          }
        | { action: "move"; direction: "up" | "down"; id: number }
        | { action: "delete"; id: number };
    }
  }
}
