export class Util {
  public static delay = (ms: number): Promise<void> =>
    new Promise((res) => {
      setTimeout(res, ms);
    });

  public static random = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  public static titleCase = (str: string): string =>
    str
      .split(" ")
      .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
      .join(" ");

  public static hastebin = (str: string): Promise<string> =>
    fetch("https://hastebin.com/documents", { body: str, method: "POST" })
      .then((res) => res.json())
      .then((body) => `https://hastebin.com/raw/${body.key}`);
}
