import type {
  ColorResolvable,
  CommandInteraction,
  InteractionResponse,
} from "discord.js";
import { EmbedBuilder, inlineCode } from "discord.js";
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
  }, name: "help" })
  public async help(interaction: CommandInteraction): Promise<InteractionResponse> {
    const locale = await (new UserLocale().get(interaction.user.id)) ?? interaction.guild?.preferredLocale ?? "en";
    const getHelpFormat = (commandName: string, commandDescription: string) =>
      `${inlineCode("/" + commandName)}: ${commandDescription}`;
    const commands = MetadataStorage.instance.applicationCommandSlashes.map(
      (command) => getHelpFormat(command.name, command.description)
    );

    // check if commands are duplicated
    const uniqueCommands = [...new Set(commands)].join("\n");

    const helpEmbed = new EmbedBuilder()
      .setTitle(i18n.__({locale, phrase: "helpEmbed.Title"}))
      .setColor(i18n.__({locale, phrase: "helpEmbed.Color"}) as ColorResolvable)
      .setFooter({
        text: i18n.__("helpEmbed.FooterText"),
      })
      .setDescription(i18n.__({locale, phrase: "helpEmbed.Roleplay"}) + "\n\n" + uniqueCommands)
      .setThumbnail(interaction.client.user.displayAvatarURL({ size: 512 }));

    return interaction.reply({
      embeds: [helpEmbed],
    });
  }
}
