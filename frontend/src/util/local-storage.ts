export namespace AppLocalStorage {
  export function getLanguage(): string {
    return localStorage.getItem("language") || "en";
  }

  export function setLanguage(value: string) {
    localStorage.setItem("language", value);
  }
}
