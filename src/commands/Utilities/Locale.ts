import type { CommandInteraction, InteractionResponse } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";
import { Discord, Slash, SlashChoice, SlashOption } from "discordx";

import { UserLocale } from "../../../prisma/queries";
import { i18n } from "../../util/i18n";

@Discord()
export class Utilities {
  @Slash({
    description: i18n.__("commandInfo.locale"),
    descriptionLocalizations: {
      "en-US": i18n.__("commandInfo.locale"),
      "pt-BR": i18n.__({ locale: "pt_br", phrase: "commandInfo.locale" }),
    },
    name: "locale",
  })
  public async locale(
    @SlashChoice({ name: "english", value: "en" })
    @SlashChoice({ name: "portuguese", value: "pt_br" })
    @SlashOption({
      description: i18n.__("commandInfo.localeOption"),
      descriptionLocalizations: {
        "en-US": i18n.__("commandInfo.localeOption"),
        "pt-BR": i18n.__({
          locale: "pt_br",
          phrase: "commandInfo.localeOption",
        }),
      },
      name: "locale",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    locale: string,
    interaction: CommandInteraction
  ): Promise<InteractionResponse> {
    await new UserLocale().set(interaction.user.id, locale);
    return interaction.reply(
      i18n.__({ locale, phrase: "feedback.localeSuccess" })
    );
  }
}
