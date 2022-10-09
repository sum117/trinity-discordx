import type {
  CommandInteraction,
  InteractionResponse,
  Message,
} from "discord.js";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";

import { Character } from "../../../prisma/queries/Character";
import { CommandInfo, ErrorMessage, Feedback } from "../../types/enums";

@Discord()
@SlashGroup({ description: CommandInfo.Playcard, name: "playcard" })
@SlashGroup("playcard")
export class Playcard {
  @Slash({ description: CommandInfo.Edit, name: "edit" })
  async edit(
    @SlashOption({
      description: CommandInfo.EditMessageOption,
      name: "message_id",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    messageId: string,
    @SlashOption({
      description: CommandInfo.EditContent,
      name: "content",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    content: string,
    interaction: CommandInteraction
  ): Promise<InteractionResponse<boolean> | Message<boolean> | void> {
    await interaction.deferReply({ ephemeral: true });
    return this._handleMessageRef("EDIT", messageId, interaction, content);
  }

  @Slash({ description: CommandInfo.Delete, name: "delete" })
  async delete(
    @SlashOption({
      description: CommandInfo.DeleteMessageOption,
      name: "message_id",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    messageId: string,
    interaction: CommandInteraction
  ): Promise<InteractionResponse<boolean> | Message<boolean> | void> {
    await interaction.deferReply({ ephemeral: true });
    return this._handleMessageRef("DELETE", messageId, interaction);
  }

  private async _handleMessageRef(
    method: "DELETE" | "EDIT",
    messageId: string,
    interaction: CommandInteraction,
    content?: string
  ): Promise<InteractionResponse<boolean> | Message<boolean> | void> {
    const characters = new Character();
    const messageRef = await characters.getPost(messageId);
    // Handle post credentials from database
    if (messageRef?.authorId !== interaction.user.id) {
      return interaction.editReply(ErrorMessage.NotPostOwner);
    }
    const databaseChannel = interaction.client.guilds.cache
      .get(messageRef.guildId)
      ?.channels.cache.get(messageRef.channelId);
    if (!databaseChannel?.isTextBased()) {
      return interaction.editReply(ErrorMessage.UnknownChannel);
    }

    const message = await databaseChannel.messages
      .fetch(messageRef.messageId)
      .catch(() => console.log(ErrorMessage.FetchError));
    if (!message) {
      return interaction.editReply(ErrorMessage.UnknownMessage);
    }

    if (method === "EDIT") {
      // Build embed from api component
      const embedToEdit = EmbedBuilder.from(message.embeds[0]);
      if (!content) {
        return interaction.editReply(ErrorMessage.NoEditContent);
      }
      // Append content to embed
      embedToEdit.setDescription(content);
      await interaction.editReply(Feedback.MessageEditted);
      return message.edit({ embeds: [embedToEdit] });
    } else if (method === "DELETE") {
      await characters
        .deletePost(messageId)
        .catch(() => console.log(ErrorMessage.DatabaseError));
      await message
        .delete()
        .catch(() => console.log(ErrorMessage.UnknownMessage));
      await interaction.editReply(Feedback.PostDeleted);
    }
  }
}
