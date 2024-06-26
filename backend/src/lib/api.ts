import { WeatherSymbolCode } from "./weatherapi";

export namespace Api {
  export namespace Install {
    export const path = "/api/install";

    export type post_type = {
      userName: string;
      password: string;
    };
  }

  export namespace Auth {
    export namespace Login {
      export const path = "/api/auth/login";

      export type get_resp = {
        installed: boolean;
        social: {
          google: boolean;
        };
        // go to this url instead of displaying the login page
        redirect?: string;
      };

      export type post_type = {
        username: string;
        password: string;
      };

      export namespace Google {
        export const path = "/login/google";
        export const callbackPath = "/oauth2/redirect/google";
      }
    }

    export namespace Logout {
      export const path = "/api/auth/logout";
    }

    export namespace Me {
      export const path = "/api/auth/me";
      export type type = {
        name?: string;
        language?: string;
      };
    }

    export namespace Sessions {
      export const path = "/api/auth/sessions";
      export type type = {
        sessions: {
          loginMethod?: "local" | "google";
          userAgent: string;
          expiresIsoDate: string;
        }[];
      };
    }
  }

  export namespace Habits {
    export const path = "/api/habits";

    export type type = {
      id: number;
      name: string;
      type: "good" | "bad";
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
      type: "good" | "bad";
      iconName: string | null;
      targetValue: number;
      periodLength: number;
      historyLength: number;
      activities: {
        id: number;
        name: string;
        value: number;
        // ISO datetime string
        lastTracked: string;
      }[];
      trackedInPeriod: {
        value: number;
        count: number;
      };
      history: {
        id: number;
        activityName: string;
        value: number;
        date: string;
        project?: Projects.Activity;
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
    export type Activity = {
      projectActivityId: number;
      issueSubject: string;
      url: string;
      progressChanged?: { from: number; to: number };
      statusChanged?: { from: string; to: string; closed: boolean };
      otherChanged?: { name: string; from: string | null; to: string | null }[];
      when: string; // ISO datetime
    };

    export namespace InProgress {
      export const path = "/api/projects/inprogress";

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

    export namespace Recent {
      export const path = "/api/projects/recent";

      export type get_type = {
        projectActivity?: Activity;
        activities?: {
          id: number;
          name: string;
        }[];
        importStatus?: { processedIssues: number; totalIssues: number };
      };

      export type post_req =
        | {
            action: "dismiss";
            id: number;
          }
        | {
            action: "track";
            id: number;
            activityId: number;
          };
    }
  }

  export namespace Weather {
    export const path = "/api/weather";
    export type type = {
      temp_celsius?: number;
      weather_symbol?: WeatherSymbolCode;
    };
  }

  export namespace Radio {
    export const path = "/api/radio";
    export type type = {
      stations: { name: string; url: string }[];
    };
  }

  export namespace Config {
    export namespace Habits {
      export const path = "/api/config/habits";

      export type HabitDescriptor = {
        id?: number;
        name: string;
        type: "good" | "bad";
        iconName: string | null;
        targetValue: number;
        periodLength: number;
        historyLength: number;
        projectId: number | null;
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

      export namespace Projects {
        export const path = "/api/config/habits/projects";
        export type type = { id: number; name: string }[];
      }
    }

    export namespace Todos {
      export const path = "/api/config/todos";

      export type type = {
        schema: 1;
        nextcloud?: {
          serverUrl: string;
          user: string;
          token: string;
        };
      };
    }

    export namespace Agenda {
      export const path = "/api/config/agenda";
      export type get_resp = {
        provider: null | "google";
      };
      export type post_req = {
        google?: {
          code: string;
        };
      };

      export namespace AuthorizeGoogleAccount {
        export const path = "/api/config/agenda/google-auth";
        export type post_req = {
          client_id: string;
          client_secret: string;
          redirect_uri: string;
        };
        export type post_resp = {
          url: string;
        };
      }
    }

    export namespace Projects {
      export const path = "/api/config/projects";

      export type type = {
        schema: 1;
        redmine?: {
          url: string;
          api_key: string;
          inprogress_status_id: number;
          board_url?: string;
        };
        status?: {
          linkedProjects: boolean;
        };
      };
    }

    export namespace Radio {
      export const path = "/api/config/radio";
      export type type = {
        schema: 1;
      } & Api.Radio.type;
    }
  }
}
