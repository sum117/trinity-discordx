import type { CommandInteraction, InteractionResponse } from "discord.js";
import { bold, EmbedBuilder, inlineCode } from "discord.js";
import { Discord, MetadataStorage, Slash } from "discordx";

import { UserLocale } from "../../../prisma/queries";
import { i18n } from "../../util/i18n";

@Discord()
export class Utilities {
  @Slash({
    description: i18n.__("commandInfo.help"),
    descriptionLocalizations: {
      "en-US": i18n.__("commandInfo.help"),
      "pt-BR": i18n.__({
        locale: "pt_br",
        phrase: "commandInfo.help",
      }),
    },
    name: "help",
  })
  public async help(
    interaction: CommandInteraction
  ): Promise<InteractionResponse> {
    const locale =
      (await new UserLocale().get(interaction.user.id)) ??
      interaction.guild?.preferredLocale ??
      "en";
    const getHelpFormat = (commandName: string, commandDescription: string) =>
      `${inlineCode("/" + commandName)}: ${commandDescription}`;

    const string = this._commandByGroups(locale, getHelpFormat);

    const helpEmbed = new EmbedBuilder()
      .setTitle(i18n.__({ locale, phrase: "helpEmbed.title" }))
      .setColor("Random")
      .setFooter({
        text: i18n.__({ locale, phrase: "helpEmbed.footerText" }),
      })
      .setDescription(
        i18n.__({ locale, phrase: "helpEmbed.roleplay" }) + "\n\n" + string
      )
      .setThumbnail(interaction.client.user.displayAvatarURL({ size: 512 }));

    return interaction.reply({
      embeds: [helpEmbed],
    });
  }

  private _commandByGroups(
    locale: string,
    getHelpFormat: (commandName: string, commandDescription: string) => string
  ) {
    const formattedLocale =
      locale === "en"
        ? "en-US"
        : locale === "pt_br"
        ? "pt-BR"
        : (locale as "en-US" | "pt-BR");

    const commandGroups =
      MetadataStorage.instance.applicationCommandSlashGroups.map((group) => ({
        name: group.name,
      }));
    const subGroups =
      MetadataStorage.instance.applicationCommandSlashSubGroups.map(
        (subGroup) => ({ name: subGroup.name, root: subGroup.root })
      );
    const commands = MetadataStorage.instance.applicationCommandSlashesFlat.map(
      (command) => ({
        description:
          command.descriptionLocalizations?.[formattedLocale] ??
          command.description,
        group: command.group,
        name: command.name,
        subgroup: command.subgroup,
      })
    );

    const commandsByGroup = commandGroups.map((group) => ({
      ...group,
      commands: commands
        .filter((command) => command.group === group.name && !command.subgroup)
        .map((command) => ({
          description: command.description,
          name: command.name,
        })),
      subgroups: subGroups
        .filter((subgroup) => subgroup.root === group.name)
        .map((subgroup) => ({
          ...subgroup,
          commands: commands
            .filter((command) => command.subgroup === subgroup.name)
            .map((command) => ({
              description: command.description,
              name: command.name,
            })),
        })),
    }));
    const string = commandsByGroup
      .map((group) => {
        const groupCommands = group.commands
          .map((command) => getHelpFormat(command.name, command.description))
          .join("\n");
        const subgroups = group.subgroups
          .map((subgroup) => {
            const subgroupCommands = subgroup.commands
              .map(
                (command, index, array) =>
                  `${index === array.length - 1 ? "⠀└──" : "⠀├──"}` +
                  getHelpFormat(command.name, command.description).replace(
                    "/",
                    ""
                  )
              )
              .join("\n");
            return `${
              "\n└── `/" +
              (subgroup.root ? subgroup.root : "") +
              " " +
              subgroup.name +
              "`"
            }\n${subgroupCommands}\n`;
          })
          .join("\n");
        return `${bold(
          group.name
        ).toUpperCase()}\n${groupCommands}\n${subgroups}`;
      })
      .join("\n");
    return string;
  }
}
