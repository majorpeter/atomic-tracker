import { QueryClient, useMutation, useQuery } from "react-query";
import { Api } from "@api";

const API_URL = "http://localhost:8080";

export const queryClient = new QueryClient();

export const queryKeys = {
  habits: ["habits"],
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

export function useApiMutation_journal() {
  return useMutation<unknown, unknown, Api.Journal.type>({
    mutationFn: async (variables) => {
      // optimistic update
      queryClient.setQueryData<Api.Journal.type>(queryKeys.journal, variables);

      try {
        await fetch(API_URL + Api.Journal.path, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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

export async function fetchHabit(id: number): Promise<Api.Habit.type> {
  return (await fetch(API_URL + "/habit/" + id)).json();
}
