import type { AutocompleteInteraction } from "discord.js";

import { Character } from "../../prisma/queries";

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

  public static hexColorValidator = (color: string): boolean => {
    const reg = /^#([0-9A-F]{3}){1,2}$/i;
    return reg.test(color);
  };

  public static imageValidator = (url: string): boolean => {
    const reg = /^(http(s?):)([/.\w\s-])*\.(?:jpg|gif|png)/;
    return reg.test(url);
  };

  public static youtubeValidator = (url: string): boolean => {
    const reg =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/;
    return reg.test(url);
  };

  public static getCharAutoComplete = (
    interaction: AutocompleteInteraction
  ): void => {
    new Character().getAll(interaction.user.id).then((chars) => {
      const charSelector = chars.map((char) => {
        if (!char) {
          return { name: "N/A", value: 0 };
        }
        const formattedCharName =
          char.name.length > 100 ? char.name.slice(0, 94) + "..." : char.name;
        return {
          name: formattedCharName,
          value: char.id,
        };
      });
      interaction.respond(charSelector);
    });
  };
  public static diffPercentage = (
    newInput: string,
    oldInput: string
  ): number => {
    const firstArray = oldInput.split("");
    const secondArray = newInput.split("");

    const biggestArray =
      firstArray.length > secondArray.length ? firstArray : secondArray;
    const smallestArray =
      secondArray === biggestArray ? firstArray : secondArray;

    let count = 0;
    for (const letter of smallestArray) {
      if (biggestArray.includes(letter)) {
        count++;
      }
    }

    return Math.floor((count / biggestArray.length) * 100);
  };
}
