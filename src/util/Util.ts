import type {
  AutocompleteInteraction,
  BaseMessageOptions,
  EmbedBuilder,
} from "discord.js";
import { AttachmentBuilder } from "discord.js";

import { Character } from "../../prisma/queries";

export class Util {
  public static delay = (ms: number): Promise<void> =>
    new Promise((res) => {
      setTimeout(res, ms);
    });

  public static randomIndex = (arr: any[]): any =>
    arr[Math.floor(Math.random() * arr.length)];

  public static escapeRegExp(toEscape: string): string {
    return toEscape.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&"); // $& significa a correspondência inteira
  }

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
    const userInput = interaction.options.getFocused();
    new Character().getAll(interaction.user.id).then((chars) => {
      const charSelector = chars
        .filter((char) => char.name.includes(userInput))
        .map((char) => {
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
  public static diffPercentage = (str1: string, str2: string): number => {
    const matchDestructively = (str1 = "", str2 = "") => {
      str1 = str1.toLowerCase();
      str2 = str2.toLowerCase();
      const arr = [];
      for (let i = 0; i <= str1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= str2.length; j++) {
          if (i === 0) {
            arr[j] = j;
          } else if (j > 0) {
            let newValue = arr[j - 1];
            if (str1.charAt(i - 1) !== str2.charAt(j - 1)) {
              newValue = Math.min(Math.min(newValue, lastValue), arr[j]) + 1;
            }
            arr[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
        if (i > 0) {
          arr[str2.length] = lastValue;
        }
      }
      return arr[str2.length];
    };

    const calculateSimilarity = (str1 = "", str2 = "") => {
      // Get the length of the strings
      let longer = str1;
      let shorter = str2;
      if (str1.length < str2.length) {
        longer = str2;
        shorter = str1;
      }
      const longerLength = longer.length;
      if (longerLength === 0) {
        return 1;
      }
      // Calculate the edit distance
      return +(
        ((longerLength - matchDestructively(longer, shorter)) / longerLength) *
        100
      ).toFixed(2);
    };

    return calculateSimilarity(str1, str2);
  };

  public static handleAttachment = (
    embedToEdit: EmbedBuilder
  ): BaseMessageOptions => {
    const reply: BaseMessageOptions = {};
    if (embedToEdit.data.image?.url) {
      const attachment = new AttachmentBuilder(
        embedToEdit.data.image.url
      ).setName(embedToEdit.data.image.url.split("/").pop() ?? "new_image.png");
      reply.files = [attachment];
      embedToEdit.setImage(`attachment://${attachment.name}`);
    }
    reply.embeds = [embedToEdit];
    return reply;
  };
}
