//TODO
export const LANG = "en";

export function formatTime(d: Date, needSeconds: boolean = false) {
  return d.toLocaleTimeString(LANG, {
    hour: "2-digit",
    minute: "2-digit",
    second: needSeconds ? "2-digit" : undefined,
  });
}
