export namespace AppLocalStorage {
  export function getLanguage(): string {
    return localStorage.getItem("language") || "en";
  }

  export function setLanguage(value: string) {
    localStorage.setItem("language", value);
  }

  export function getRadioIndex(): number {
    return parseInt(localStorage.getItem("radioIndex") || "0");
  }
  export function setRadioIndex(index: number) {
    localStorage.setItem("radioIndex", index.toString());
  }
}
