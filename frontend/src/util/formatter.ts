//TODO
export const LANG = "en";

export function formatTime(d: Date, needSeconds: boolean = false) {
  return d.toLocaleTimeString(LANG, {
    hour: "2-digit",
    minute: "2-digit",
    second: needSeconds ? "2-digit" : undefined,
  });
}

export function formatDate(d: Date) {
  return d.toLocaleDateString(LANG);
}

/**
 * @return date formatted in ISO format, e.g. "2023-12-31"
 */
export function getIsoDate(d: Date) {
  const date = new Date(d);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toJSON().slice(0, 10);
}
