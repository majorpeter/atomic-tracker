import { QueryClient, useMutation, useQuery } from "react-query";
import { Api } from "@api";

const API_URL = "http://localhost:8080";

export const queryClient = new QueryClient();

namespace QueryKey {
  export const Todos = ["todos"];
  export const Calendar = ["calendar"];
  export const Journal = ["journal"];
}

export namespace useApiQuery {
  export function todos() {
    return useQuery<Api.Todos.type>({
      queryKey: QueryKey.Todos,
      queryFn: async () => {
        return await (await fetch(API_URL + Api.Todos.path)).json();
      },
    });
  }

  export function calendar() {
    return useQuery<Api.Calendar.type>({
      queryKey: QueryKey.Calendar,
      queryFn: async () => {
        return await (await fetch(API_URL + Api.Calendar.path)).json();
      },
    });
  }

  export function journal() {
    return useQuery<Api.Journal.type>({
      queryKey: QueryKey.Journal,
      queryFn: async () => {
        return await (await fetch(API_URL + Api.Journal.path)).json();
      },
    });
  }
}

export namespace useApiMutation {
  export function journal() {
    return useMutation<unknown, unknown, Api.Journal.type>({
      mutationFn: async (variables) => {
        // optimistic update
        queryClient.setQueryData<Api.Journal.type>(QueryKey.Journal, variables);

        try {
          await fetch(API_URL + Api.Journal.path, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(variables),
          });
        } catch {}

        // refetch to sync either way
        queryClient.invalidateQueries(QueryKey.Journal);
      },
    });
  }
}
