import { QueryClient, useMutation, useQuery } from "react-query";
import { Api } from "@api";

const API_URL = "http://localhost:8080";

export const queryClient = new QueryClient();

export const queryKeys = {
  habits: ["habits"],
  habit_n: (id: number) => ["habits", id.toString()],
  todos: ["todos"],
  calendar: ["calendar"],
  journal: ["journal"],
};

export function useApiQuery_habits() {
  return useQuery<Api.Habits.type>({
    queryKey: queryKeys.habits,
    queryFn: async () => {
      return await (await fetch(API_URL + Api.Habits.path)).json();
    },
  });
}

export function apiQuery_habit_n(id: number) {
  return {
    queryKey: queryKeys.habit_n(id),
    queryFn: async () => {
      return await (
        await fetch(API_URL + Api.Habit.path.replace(":id", id.toString()))
      ).json();
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
      return await (await fetch(API_URL + Api.Todos.path)).json();
    },
  });
}

export function useApiQuery_calendar() {
  return useQuery<Api.Calendar.type>({
    queryKey: queryKeys.calendar,
    queryFn: async () => {
      return await (await fetch(API_URL + Api.Calendar.path)).json();
    },
  });
}

export function useApiQuery_journal() {
  return useQuery<Api.Journal.type>({
    queryKey: queryKeys.journal,
    queryFn: async () => {
      return await (await fetch(API_URL + Api.Journal.path)).json();
    },
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

      try {
        return (
          await fetch(API_URL + Api.Habit.Track.path, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(variables),
          })
        ).json();
      } catch {
        // no check for now
      }
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

export function useApiMutation_journal() {
  return useMutation<unknown, unknown, Api.Journal.type>({
    mutationFn: async (variables) => {
      // optimistic update
      queryClient.setQueryData<Api.Journal.type>(queryKeys.journal, variables);

      try {
        await fetch(API_URL + Api.Journal.path, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(variables),
        });
      } catch {
        // no action (invalidate is called either way)
      }

      // refetch to sync either way
      queryClient.invalidateQueries(queryKeys.journal);
    },
  });
}
