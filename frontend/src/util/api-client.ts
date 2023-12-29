import {
  QueryCache,
  QueryClient,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { Api } from "@api";
import { getIsoDate } from "./formatter";
import { loginRoute } from "../pages/LoginPage";

const API_URL = "";

/**
 * wrapper for fetch() that throws `AuthorizationError` on status 401
 * @param input API path, inlcudes "/api" prefix
 * @param init init object to pass to fetch()
 * @returns parsed JSON on success
 */
async function apiFetchJson(input: string, init?: RequestInit): Promise<any> {
  const resp = await fetch(input, init);
  if (!resp.ok) {
    if (resp.status == 401) {
      throw new AuthorizationError();
    }

    throw resp;
  }
  return resp.json();
}

class AuthorizationError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onError: (err) => {
      if (err instanceof AuthorizationError) {
        // repload the whole appication by navigating this way
        window.location.href = loginRoute.path!;
      }
    },
  }),
});

export const queryKeys = {
  habits: ["habits"],
  habit_n: (id: number) => ["habits", id.toString()],
  todos: ["todos"],
  calendar: ["calendar"],
  journal_overview: ["journal"],
  journal_day: (date: Date) => ["journal", getIsoDate(date)],
  projects: ["projects"],
  projects_inprogress: ["projects", "inprogress"],
  projects_recent: ["projects", "recent"],
  weather: ["weather"],
  radio: ["radio"],
  config_habits: ["habits", "config"],
  config_todos: ["todos", "config"],
  config_projects: ["projects", "config"],
  config_radio: ["radio", "config"],
  config_agenda_state: ["calendar", "state"],
  config_sessions: ["config", "sessions"],
};

export function useApiQuery_habits() {
  return useQuery<Api.Habits.type>({
    queryKey: queryKeys.habits,
    queryFn: async () => {
      return apiFetchJson(Api.Habits.path);
    },
  });
}

export function apiQuery_habit_n(id: number) {
  return {
    queryKey: queryKeys.habit_n(id),
    queryFn: async () => {
      return apiFetchJson(Api.Habit.path.replace(":id", id.toString()));
    },
  };
}

export function useApiQuery_habit_n(id: number) {
  return useQuery<Api.Habit.type>(apiQuery_habit_n(id));
}

export function useApiQuery_todos() {
  return useQuery<Api.Todos.type>({
    queryKey: queryKeys.todos,
    queryFn: async () => {
      return apiFetchJson(Api.Todos.path);
    },
  });
}

export function useApiQuery_calendar() {
  return useQuery<Api.Calendar.type>({
    queryKey: queryKeys.calendar,
    queryFn: async () => {
      return apiFetchJson(Api.Calendar.path);
    },
  });
}

export function useApiQuery_journalOverview() {
  return useQuery<Api.Journal.type>({
    queryKey: queryKeys.journal_overview,
    queryFn: async () => {
      return apiFetchJson(Api.Journal.path);
    },
  });
}

export function useApiQuery_journal_day(date: Date) {
  return useQuery<Api.Journal.Date.type>({
    queryKey: queryKeys.journal_day(date),
    queryFn: async () => {
      return apiFetchJson(
        Api.Journal.Date.pathWithDate.replace(":date", getIsoDate(date))
      );
    },
  });
}

export function useApiQuery_projectsInProgress() {
  return useQuery<Api.Projects.InProgress.type>({
    queryKey: queryKeys.projects_inprogress,
    queryFn: async () => {
      return apiFetchJson(Api.Projects.InProgress.path);
    },
  });
}

export function useApiQuery_projectsRecent() {
  return useQuery<Api.Projects.Recent.get_type>({
    queryKey: queryKeys.projects_recent,
    queryFn: async () => {
      return apiFetchJson(Api.Projects.Recent.path);
    },
  });
}

export function useApiQuery_weather() {
  return useQuery<Api.Weather.type>({
    queryKey: queryKeys.weather,
    queryFn: async () => {
      return apiFetchJson(Api.Weather.path);
    },
  });
}

export const apiQuery_radio = {
  queryKey: queryKeys.radio,
  queryFn: async () => {
    return apiFetchJson(Api.Radio.path);
  },
};

export function useApiQuery_radio() {
  return useQuery<Api.Radio.type>(apiQuery_radio);
}

export function useApiQuery_config_habits(
  onSuccess?: (data: Api.Config.Habits.get_type) => void
) {
  return useQuery<Api.Config.Habits.get_type>({
    queryKey: queryKeys.config_habits,
    queryFn: async () => {
      const result = await apiFetchJson(Api.Config.Habits.path);
      if (onSuccess) {
        onSuccess(result);
      }
      return result;
    },
  });
}

export function useApiQuery_config_todos() {
  return useQuery<Api.Config.Todos.type>({
    queryKey: queryKeys.config_todos,
    queryFn: async () => {
      return apiFetchJson(Api.Config.Todos.path);
    },
  });
}

export function useApiQuery_config_agenda_state() {
  return useQuery<Api.Config.Agenda.get_resp>({
    queryKey: queryKeys.config_agenda_state,
    queryFn: async () => {
      return apiFetchJson(Api.Config.Agenda.path);
    },
  });
}

export async function apiFetchGoogleCalendarAuthUrl(
  options: Api.Config.Agenda.AuthorizeGoogleAccount.post_req
): Promise<Api.Config.Agenda.AuthorizeGoogleAccount.post_resp> {
  return apiFetchJson(Api.Config.Agenda.AuthorizeGoogleAccount.path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options),
  });
}

export function useApiQuery_config_projects() {
  return useQuery<Api.Config.Projects.type>({
    queryKey: queryKeys.config_projects,
    queryFn: async () => {
      return apiFetchJson(Api.Config.Projects.path);
    },
  });
}

export function useApiQuery_config_radios() {
  return useQuery<Api.Config.Radio.type>({
    queryKey: queryKeys.config_radio,
    queryFn: async () => {
      return apiFetchJson(Api.Config.Radio.path);
    },
  });
}

export function useApiQuery_config_sessions() {
  return useQuery<Api.Auth.Sessions.type>({
    queryKey: queryKeys.config_sessions,
    queryFn: async () => apiFetchJson(Api.Auth.Sessions.path),
  });
}

export function useApiMutation_login(
  onSuccess?: (me: Required<Api.Auth.Me.type>) => void
) {
  return useMutation<
    Required<Api.Auth.Me.type>,
    unknown,
    Api.Auth.Login.post_type
  >({
    mutationFn: async (payload) => {
      // not using apiFetchJson, we're not getting a JSON back
      const resp = await fetch(API_URL + Api.Auth.Login.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) {
        throw new Error("Failed to log in");
      }
      return resp.json();
    },
    onSuccess,
  });
}

export async function apiFetchLoginParams(): Promise<Api.Auth.Login.get_resp> {
  const resp = await fetch(API_URL + Api.Auth.Login.path);
  if (!resp.ok) {
    throw new Error();
  }
  return resp.json();
}

export async function apiFetchLogout(): Promise<boolean> {
  queryClient.clear();
  const resp = await fetch(API_URL + Api.Auth.Logout.path);
  return resp.ok;
}

export function useApiMutation_install(onSuccess: () => void) {
  return useMutation<unknown, unknown, Api.Install.post_type>({
    mutationFn: async (payload) => {
      return fetch(API_URL + Api.Install.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    },
    onSuccess,
  });
}

export function useApiMutation_habit_track() {
  return useMutation<
    Api.Habit.Track.post_resp,
    unknown,
    Api.Habit.Track.post_type
  >({
    mutationFn: async (variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.habits });

      return apiFetchJson(Api.Habit.Track.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(variables),
      });
    },
  });
}

export function useApiMutation_habit_track_delete() {
  return useMutation<unknown, unknown, { id: number }>({
    mutationFn: async ({ id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.habits });

      try {
        await fetch(
          API_URL + Api.Habit.Track.pathWithId.replace(":id", id.toString()),
          {
            method: "DELETE",
          }
        );
      } catch {}
    },
  });
}

export function useApiMutation_journal(onSuccess?: () => void) {
  return useMutation<
    unknown,
    unknown,
    { payload: Api.Journal.Date.type; date: Date }
  >({
    mutationFn: async ({ payload, date }) => {
      await fetch(
        API_URL +
          Api.Journal.Date.pathWithDate.replace(":date", getIsoDate(date)),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      // invalidate all journals in case 'today' was edited
      queryClient.invalidateQueries({ queryKey: queryKeys.journal_overview });
    },
    onSuccess,
  });
}

export function useApiMutation_projectsRecentDismiss(onSuccess?: () => void) {
  return useMutation<unknown, Error, Api.Projects.Recent.post_req["dismiss"]>({
    mutationFn: async (params) => {
      const body: Api.Projects.Recent.post_req = { dismiss: params };
      await fetch(API_URL + Api.Projects.Recent.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      queryClient.invalidateQueries({ queryKey: queryKeys.projects_recent });
    },
    onSuccess,
  });
}

export function useApiMutation_config_user(
  onSuccess: (me: Required<Api.Auth.Me.type>) => void
) {
  return useMutation<Required<Api.Auth.Me.type>, unknown, Api.Auth.Me.type>({
    mutationFn: async (me) => {
      return apiFetchJson(Api.Auth.Me.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(me),
      });
    },
    onSuccess,
  });
}

export function useApiMutation_config_habits_add() {
  return useMutation<unknown, unknown, Api.Config.Habits.HabitDescriptor>({
    mutationFn: async (habit) => {
      const body: Api.Config.Habits.post_type = { action: "add", habit };
      await fetch(API_URL + Api.Config.Habits.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      queryClient.invalidateQueries({ queryKey: queryKeys.habits });
    },
  });
}

export function useApiMutation_config_habits_edit() {
  return useMutation<
    unknown,
    unknown,
    Api.Config.Habits.HabitDescriptor &
      Pick<Api.Config.Habits.HabitDescriptor, "id">
  >({
    mutationFn: async (habit) => {
      const body: Api.Config.Habits.post_type = { action: "edit", habit };
      await fetch(API_URL + Api.Config.Habits.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      queryClient.invalidateQueries({ queryKey: queryKeys.habits });
    },
  });
}

export function useApiMutation_config_habits_archive() {
  return useMutation<unknown, unknown, number>({
    mutationFn: async (id) => {
      const body: Api.Config.Habits.post_type = { action: "archive", id };
      await fetch(API_URL + Api.Config.Habits.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      queryClient.invalidateQueries({ queryKey: queryKeys.habits });
    },
  });
}

export function useApiMutation_config_habits_unarchive() {
  return useMutation<unknown, unknown, number>({
    mutationFn: async (id) => {
      const body: Api.Config.Habits.post_type = { action: "unarchive", id };
      await fetch(API_URL + Api.Config.Habits.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      queryClient.invalidateQueries({ queryKey: queryKeys.habits });
    },
  });
}

export function useApiMutation_config_habits_move() {
  return useMutation<
    unknown,
    unknown,
    { id: number; direction: "up" | "down" }
  >({
    mutationFn: async ({ id, direction }) => {
      const body: Api.Config.Habits.post_type = {
        action: "move",
        id,
        direction,
      };
      await fetch(API_URL + Api.Config.Habits.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      queryClient.invalidateQueries({ queryKey: queryKeys.habits });
    },
  });
}

export function useApiMutation_config_habits_delete() {
  return useMutation<unknown, unknown, { id: number }>({
    mutationFn: async ({ id }) => {
      const body: Api.Config.Habits.post_type = {
        action: "delete",
        id,
      };
      await fetch(API_URL + Api.Config.Habits.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      queryClient.invalidateQueries({ queryKey: queryKeys.habits });
    },
  });
}

export function useApiMutation_config_todos() {
  return useMutation<unknown, unknown, Api.Config.Todos.type>({
    mutationFn: async (payload) => {
      await fetch(API_URL + Api.Config.Todos.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      queryClient.invalidateQueries({ queryKey: queryKeys.todos });
    },
  });
}

export function useApiMutation_config_agenda() {
  return useMutation<unknown, unknown, Api.Config.Agenda.post_req>({
    mutationFn: async (payload) => {
      await fetch(API_URL + Api.Config.Agenda.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      queryClient.invalidateQueries({ queryKey: queryKeys.calendar });
    },
  });
}

export function useApiMutation_config_projects() {
  return useMutation<unknown, unknown, Api.Config.Projects.type>({
    mutationFn: async (payload) => {
      await fetch(API_URL + Api.Config.Projects.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
    },
  });
}

export function useApiMutation_config_radios() {
  return useMutation<unknown, unknown, Api.Config.Radio.type>({
    mutationFn: async (payload) => {
      await fetch(API_URL + Api.Config.Radio.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      queryClient.invalidateQueries({ queryKey: queryKeys.radio });
    },
  });
}
