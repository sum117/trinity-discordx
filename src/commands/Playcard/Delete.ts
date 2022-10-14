import type { CommandInteraction, Message } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";

import { Character, UserLocale } from "../../../prisma/queries";
import { i18n } from "../../util/i18n";
import { Util } from "../../util/Util";

@Discord()
@SlashGroup("char", "playcard")
export class Playcard {
  @Slash({
    description: i18n.__("commandInfo.deletePost"),
    descriptionLocalizations: {
      "en-US": i18n.__("commandInfo.deletePost"),
      "pt-BR": i18n.__({ locale: "pt_br", phrase: "commandInfo.deletePost" }),
    },
    name: "delete_post",
  })
  public async delete(
    @SlashOption({
      autocomplete: Util.getCharAutoComplete,
      description: i18n.__("commandInfo.deleteCharOption"),
      descriptionLocalizations: {
        "en-US": i18n.__("commandInfo.deleteCharOption"),
        "pt-BR": i18n.__({
          locale: "pt_br",
          phrase: "commandInfo.deleteCharOption",
        }),
      },
      name: "char",
      required: true,
      type: ApplicationCommandOptionType.Integer,
    })
    charId: number,
    interaction: CommandInteraction
  ): Promise<Message> {
    const locale =
      (await new UserLocale().get(interaction.user.id)) ??
      interaction.guild?.preferredLocale ??
      "en";
    await interaction.deferReply({ ephemeral: true });
    await new Character().deleteChar(interaction.user.id, charId);
    return interaction.editReply({
      content: i18n.__({
        locale,
        phrase: "feedback.characterDeleted",
      }),
    });
  }
}
