import { Pagination, PaginationType } from "@discordx/pagination";
import type {
  BaseMessageOptions,
  CommandInteraction,
  GuildMember,
  InteractionResponse,
} from "discord.js";
import {
  ApplicationCommandOptionType,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";

import { Character, UserLocale } from "../../../prisma/queries";
import type { CharListOptions } from "../../types/interfaces";
import { i18n } from "../../util/i18n";

@Discord()
@SlashGroup("char", "playcard")
export class Playcard {
  @Slash({
    description: i18n.__("commandInfo.list"),
    descriptionLocalizations: {
      "en-US": i18n.__("commandInfo.list"),
      "pt-BR": i18n.__({ locale: "pt_br", phrase: "commandInfo.list" }),
    },
    name: "list",
  })
  public async list(
    @SlashOption({
      description: i18n.__("commandInfo.listOption"),
      descriptionLocalizations: {
        "en-US": i18n.__("commandInfo.listOption"),
        "pt-BR": i18n.__({ locale: "pt_br", phrase: "commandInfo.listOption" }),
      },
      name: "user",
      type: ApplicationCommandOptionType.User,
    })
    member: GuildMember,
    interaction: CommandInteraction
  ): Promise<InteractionResponse | void> {
    member = member ?? interaction.member;
    const locale =
      (await new UserLocale().get(member.id)) ??
      interaction.guild?.preferredLocale ??
      "en";
    const getListFormat = ({
      id,
      name,
      prefix,
      letterCount,
      postCount,
      likeCount,
      isMostUsed,
    }: CharListOptions) =>
      `**#${id}** (${prefix}) ${name} ${
        isMostUsed ? "🌠" : ""
      } \n ❤️ ${likeCount} 🔤 ${letterCount} 📘 ${postCount}`;
    const characters = await new Character().getAll(member.id);
    if (!characters) {
      return console.log(i18n.__(locale, "errorMessage.characterNotFound"));
    }
    const charList = characters
      .sort((a, b) => {
        if (b.letters && a.letters) {
          return b.letters - a.letters;
        }
        return 0;
      })
      .map((sortedChar, index) => {
        const char = {
          id: sortedChar.id,
          isMostUsed: index === 0,
          letterCount: sortedChar.letters,
          likeCount: JSON.parse(sortedChar.likes)?.length ?? 0,
          name: sortedChar.name,
          postCount: sortedChar.posts.length,
          prefix: sortedChar.prefix,
        };
        return getListFormat(char);
      });

    // For each 10 characters, create a new page
    const pages = [];
    for (let i = 0; i < charList.length; i += 10) {
      pages.push(charList.slice(i, i + 10));
    }

    const embeds = [];
    const replies = [] as BaseMessageOptions[];
    for (const page of pages) {
      const embed = new EmbedBuilder();
      embed.setTitle(
        `📚 ${i18n.__mf(
          { locale, phrase: "commandInfo.listTitle" },
          { user: member.user.username }
        )}`
      );
      embed.setColor("Random");
      embed.setFooter({
        text: `${i18n.__mf(
          { locale, phrase: "commandInfo.listFooter" },
          { user: member.user.username }
        )}`,
      });
      embed.setTimestamp(Date.now());
      embed.setDescription(page.join("\n\n"));
      embed.setThumbnail(member.displayAvatarURL({ size: 512 }));
      embed.setAuthor({
        iconURL: interaction.client.user.displayAvatarURL({ size: 128 }),
        name: interaction.client.user.username,
        url: "https://discord.gg/qc6eKhvN9Z",
      });
      embeds.push(embed);
      replies.push({ embeds: [embed] });
    }
    if (replies.length < 1) {
      return interaction.reply(
        i18n.__({ locale, phrase: "errorMessage.characterNotFound" })
      );
    }
    const pagination = new Pagination(interaction, replies, {
      next: {
        label: i18n.__mf({ locale, phrase: "commandInfo.listNext" }),
        style: ButtonStyle.Success,
      },
      previous: {
        label: i18n.__mf({ locale, phrase: "commandInfo.listPrevious" }),
        style: ButtonStyle.Success,
      },
      showStartEnd: false,
      type: PaginationType.Button,
    });
    pagination.send();
  }
}
