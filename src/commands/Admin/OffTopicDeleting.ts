import type { CommandInteraction, InteractionResponse } from "discord.js";
import type { ArgsOf } from "discordx";
import { Discord, On, Slash, SlashGroup } from "discordx";

import { Server, UserLocale } from "../../../prisma/queries";
import { i18n } from "../../util/i18n";

@Discord()
@SlashGroup({
  description: i18n.__("commandInfo.admin"),
  descriptionLocalizations: {
    "en-US": i18n.__("commandInfo.admin"),
    "pt-BR": i18n.__({ locale: "pt_br", phrase: "commandInfo.admin" }),
  },
  name: "admin",
})
@SlashGroup("admin")
export class Admin {
  @Slash({
    description: i18n.__("commandInfo.toggleDeleteOffTopic"),
    descriptionLocalizations: {
      "en-US": i18n.__("commandInfo.toggleDeleteOffTopic"),
      "pt-BR": i18n.__({
        locale: "pt_br",
        phrase: "commandInfo.toggleDeleteOffTopic",
      }),
    },
    name: "toggle_delete_off_topic",
  })
  public async toggleDeleteOffTopic(
    interaction: CommandInteraction
  ): Promise<InteractionResponse | void> {
    const locale =
      (await new UserLocale().get(interaction.user.id)) ??
      interaction.guild?.preferredLocale ??
      "en";
    const isGuildManager = interaction.memberPermissions?.has("ManageGuild");
    if (!isGuildManager) {
      return interaction.reply({
        content: i18n.__({ locale, phrase: "errorMessage.noPermission" }),
      });
    }
    if (interaction.guildId) {
      const servers = new Server();
      const currentState = (await servers.get(interaction.guildId)) ?? {
        isOffTopicDeleting: false,
      };
      await new Server().set(
        interaction.guildId,
        !currentState.isOffTopicDeleting
      );
      const offLocale = locale === "en" ? "on" : "ligado";
      const onLocale = locale === "en" ? "off" : "desligado";
      return interaction.reply({
        content: i18n.__mf(
          {
            locale,
            phrase: "feedback.toggleDeleteOffTopic",
          },
          { toggle: !currentState.isOffTopicDeleting ? offLocale : onLocale }
        ),
      });
    }
  }

  @On({ event: "messageCreate" })
  public async onOffTopicMessage([
    message,
  ]: ArgsOf<"messageCreate">): Promise<void> {
    if (message.channel.isTextBased()) {
      const offTopic =
        message.content.startsWith("/") ||
        message.content.startsWith("\\") ||
        message.content.startsWith("[") ||
        message.content.startsWith("]") ||
        message.content.startsWith("(") ||
        message.content.startsWith(")");
      if (offTopic && message.guildId) {
        const server = await new Server().get(message.guildId);
        if (server?.isOffTopicDeleting) {
          setTimeout(() => {
            message
              .delete()
              .catch(() =>
                console.log(
                  "Cannot delete unknown message, probably already deleted."
                )
              );
          }, 3 * 60 * 1000);
        }
      }
    }
  }
}
