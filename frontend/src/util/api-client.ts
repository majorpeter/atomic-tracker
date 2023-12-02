import { QueryClient, useMutation, useQuery } from "react-query";
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
      onError: (err) => {
        if (err instanceof AuthorizationError) {
          // repload the whole appication by navigating this way
          window.location.href = loginRoute.path!;
        }
      },
    },
  },
});

export const queryKeys = {
  habits: ["habits"],
  habit_n: (id: number) => ["habits", id.toString()],
  todos: ["todos"],
  calendar: ["calendar"],
  journal_overview: ["journal"],
  journal_day: (date: Date) => ["journal", getIsoDate(date)],
  projects_inprogress: ["projects", "inprogress"],
  config_habits: ["habits", "config"],
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
  return useQuery<Api.Projects.type>({
    queryKey: queryKeys.projects_inprogress,
    queryFn: async () => {
      return apiFetchJson(Api.Projects.path);
    },
  });
}

export function useApiQuery_config_habits(
  onSuccess?: (data: Api.Config.Habits.get_type) => void
) {
  return useQuery<Api.Config.Habits.get_type>({
    queryKey: queryKeys.config_habits,
    queryFn: async () => {
      return apiFetchJson(Api.Config.Habits.path);
    },
    onSuccess,
  });
}

export function useApiMutation_login(onSuccess: () => void) {
  return useMutation<unknown, unknown, Api.Auth.Login.post_type>({
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
      queryClient.invalidateQueries(queryKeys.habits);

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
      queryClient.invalidateQueries(queryKeys.habits);

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
      queryClient.invalidateQueries(queryKeys.journal_overview);
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

      queryClient.invalidateQueries(queryKeys.habits);
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

      queryClient.invalidateQueries(queryKeys.habits);
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

      queryClient.invalidateQueries(queryKeys.habits);
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

      queryClient.invalidateQueries(queryKeys.habits);
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

      queryClient.invalidateQueries(queryKeys.habits);
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

      queryClient.invalidateQueries(queryKeys.habits);
    },
  });
}
