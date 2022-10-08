export class Util {
  public static delay = (ms: number): Promise<void> =>
    new Promise((res) => {
      setTimeout(res, ms);
    });

  public static randomIndex = (arr: any[]): any =>
    arr[Math.floor(Math.random() * arr.length)];

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
