/**
 * Find available locale for parameter or fall back to default
 * @param lang IETF BCP 47 language tag, e.g. 'en', 'de', 'hu'
 * @see https://en.wikipedia.org/wiki/IETF_language_tag
 * @note quite trivial since only Hungarian translation is available now
 */
export function findLocaleForBcp47LangTag(lang: string) {
  if (lang == "hu") {
    return lang;
  }
  return "en";
}
