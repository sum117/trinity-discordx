import type {
  BaseMessageOptions,
  CommandInteraction,
  InteractionResponse,
  Message,
} from "discord.js";
import {
  ApplicationCommandOptionType,
  AttachmentBuilder,
  EmbedBuilder,
} from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";

import { Character, UserLocale } from "../../../prisma/queries";
import { i18n } from "../../util/i18n";
import { Util } from "../../util/Util";

@Discord()
@SlashGroup({
  description: i18n.__("commandInfo.playcard"),
  descriptionLocalizations: {
    "en-US": i18n.__("commandInfo.playcard"),
    "pt-BR": i18n.__({ locale: "pt_br", phrase: "commandInfo.playcard" }),
  },
  name: "playcard",
})
@SlashGroup("playcard")
export class Playcard {
  @Slash({
    description: i18n.__("commandInfo.edit"),
    descriptionLocalizations: {
      "en-US": i18n.__("commandInfo.edit"),
      "pt-BR": i18n.__({ locale: "pt_br", phrase: "commandInfo.edit" }),
    },
    name: "edit",
  })
  async edit(
    @SlashOption({
      description: i18n.__("commandInfo.editMessageOption"),
      descriptionLocalizations: {
        "en-US": i18n.__("commandInfo.editMessageOption"),
        "pt-BR": i18n.__({
          locale: "pt_br",
          phrase: "commandInfo.editMessageOption",
        }),
      },
      name: "message_id",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    messageId: string,
    @SlashOption({
      description: i18n.__("commandInfo.editContent"),
      descriptionLocalizations: {
        "en-US": i18n.__("commandInfo.editContent"),
        "pt-BR": i18n.__({
          locale: "pt_br",
          phrase: "commandInfo.editContent",
        }),
      },
      name: "content",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    content: string,
    interaction: CommandInteraction
  ): Promise<InteractionResponse | Message | void> {
    await interaction.deferReply({ ephemeral: true });
    return this._handleMessageRef("EDIT", messageId, interaction, content);
  }

  @Slash({
    description: i18n.__("commandInfo.deletePost"),
    descriptionLocalizations: {
      "en-US": i18n.__("commandInfo.deletePost"),
      "pt-BR": i18n.__({ locale: "pt_br", phrase: "commandInfo.deletePost" }),
    },
    name: "delete_post",
  })
  async delete(
    @SlashOption({
      description: i18n.__("commandInfo.deleteMessageOption"),
      descriptionLocalizations: {
        "en-US": i18n.__("commandInfo.deleteMessageOption"),
        "pt-BR": i18n.__({
          locale: "pt_br",
          phrase: "commandInfo.deleteMessageOption",
        }),
      },
      name: "message_id",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    messageId: string,
    interaction: CommandInteraction
  ): Promise<InteractionResponse | Message | void> {
    await interaction.deferReply({ ephemeral: true });
    return this._handleMessageRef("DELETE", messageId, interaction);
  }

  private async _handleMessageRef(
    method: "DELETE" | "EDIT",
    messageId: string,
    interaction: CommandInteraction,
    content?: string
  ): Promise<InteractionResponse | Message | void> {
    const locale =
      (await new UserLocale().get(interaction.user.id)) ??
      interaction.guild?.preferredLocale ??
      "en";
    const characters = new Character();
    const messageRef = await characters.getPost(messageId);
    // Handle post credentials from database
    if (messageRef?.authorId !== interaction.user.id) {
      return interaction.editReply(
        i18n.__({
          locale,
          phrase: "errorMessage.notPostOwner",
        })
      );
    }
    const databaseChannel = interaction.client.guilds.cache
      .get(messageRef.guildId)
      ?.channels.cache.get(messageRef.channelId);
    if (!databaseChannel?.isTextBased()) {
      return interaction.editReply(
        i18n.__({
          locale,
          phrase: "errorMessage.unknownChannel",
        })
      );
    }

    const message = await databaseChannel.messages
      .fetch(messageRef.messageId)
      .catch(() =>
        console.log(
          i18n.__({
            locale,
            phrase: "errorMessage.fetchError",
          })
        )
      );
    if (!message) {
      return interaction.editReply(
        i18n.__({
          locale,
          phrase: "errorMessage.unknownMessage",
        })
      );
    }

    if (method === "EDIT") {
      // Build embed from api component
      const embedToEdit = EmbedBuilder.from(message.embeds[0]);
      if (!content) {
        return interaction.editReply(
          i18n.__({ locale, phrase: "errorMessage.noEditContent" })
        );
      }
      // Append content to embed
      embedToEdit.setDescription(content);
      await interaction.editReply(
        i18n.__({ locale, phrase: "feedback.messageEditted" })
      );

      // In case attachment exists, handle it too
      const reply = Util.handleAttachment(embedToEdit);
      return message.edit(reply);
    } else if (method === "DELETE") {
      await characters
        .deletePost(messageId)
        .catch(() =>
          console.log(i18n.__({ locale, phrase: "errorMessage.databaseError" }))
        );
      await message
        .delete()
        .catch(() =>
          console.log(
            i18n.__({ locale, phrase: "errorMessage.unknownMessage" })
          )
        );
      await interaction.editReply(
        i18n.__({ locale, phrase: "feedback.postDeleted" })
      );
    }
  }
}
