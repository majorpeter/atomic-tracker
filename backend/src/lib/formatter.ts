/**
 * @return date formatted in ISO format, e.g. "2023-12-31"
 */
export function getIsoDate(d: Date) {
  const date = new Date(d);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toJSON().slice(0, 10);
}
