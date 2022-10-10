import {
  APIButtonComponent,
  ApplicationCommandType,
  ButtonInteraction,
  CommandInteraction,
  InteractionResponse,
  Message,
  MessageContextMenuCommandInteraction,
} from "discord.js";
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  userMention,
} from "discord.js";
import {
  ButtonComponent,
  ContextMenu,
  Discord,
  Slash,
  SlashGroup,
  SlashOption,
} from "discordx";

import { Character } from "../../../prisma/queries/Character";
import { CharEmbedBuilder } from "../../components/CharEmbed";
import {
  CharLikeButton,
  CommandInfo,
  ErrorMessage,
  Feedback,
} from "../../types/enums";
import { Util } from "../../util/Util";

@Discord()
@SlashGroup("char", "playcard")
export class Playcard {
  @Slash({ description: CommandInfo.Profile, name: "profile" })
  public async profile(
    @SlashOption({
      autocomplete: Util.getCharAutoComplete,
      description: CommandInfo.ProfileCharOption,
      name: "character",
      required: true,
      type: ApplicationCommandOptionType.Integer,
    })
    char: number,
    interaction: CommandInteraction
  ): Promise<Message<boolean> | InteractionResponse<boolean>> {
    await interaction.deferReply({ ephemeral: true });
    const characters = new Character();
    const character = await characters.getOne(interaction.user.id, char, false);
    if (!character) {
      return interaction.editReply({
        content: ErrorMessage.CharacterNotFound,
      });
    }
    const likeBtnCustomId = `char_like_${character.id}`;
    const likeBtn = new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId(likeBtnCustomId)
        .setLabel(CharLikeButton.Like)
        .setEmoji(CharLikeButton.Emoji)
        .setStyle(ButtonStyle.Danger)
    );
    const embed = new CharEmbedBuilder(interaction.user, character).profile();

    const feedback = Feedback.DisplayProfile.replace(
      "{character}",
      character.name
    ).replace("{user}", userMention(character.authorId));
    return interaction.editReply({
      components: [likeBtn],
      content: feedback,
      embeds: [embed],
    });
  }

  @ButtonComponent({ id: /char_like_.+/ })
  public async like(
    interaction: ButtonInteraction
  ): Promise<Message<boolean> | void> {
    await interaction.deferUpdate();
    const characters = new Character();
    const charId = parseInt(interaction.customId.split("_")[2]);
    const character = await characters.getOne(
      interaction.user.id,
      charId,
      false
    );
    if (!character) {
      return interaction.editReply({
        content: ErrorMessage.DatabaseError,
      });
    }
    // Disable like button
    const apiBtn = interaction.message.components[0]
      .components[0] as APIButtonComponent;
    const likeBtn = new ActionRowBuilder<ButtonBuilder>().setComponents(
      ButtonBuilder.from(apiBtn).setDisabled(true)
    );
    // Manage like
    const likedChar = await characters.addLike(charId, interaction.user.id);
    if (!likedChar) {
      return interaction.followUp({
        content: ErrorMessage.AlreadyLiked,
      });
    }
    const embed = new CharEmbedBuilder(interaction.user, likedChar).profile();
    const feedback = Feedback.DisplayProfile.replace(
      "{character}",
      character.name
    ).replace("{user}", userMention(character.authorId));
    await interaction.followUp({
      content: Feedback.CharacterLiked,
      ephemeral: true,
    });
    return interaction.editReply({
      components: [likeBtn],
      content: feedback,
      embeds: [embed],
    });
  }

  @ContextMenu({
    name: "Like this character",
    type:ApplicationCommandType.Message
  })
  public async likeContext(interaction: MessageContextMenuCommandInteraction) {
    const embedFooterText = interaction.targetMessage.embeds?.[0]?.footer?.text;
    if (!embedFooterText) {
      return interaction.reply({
        content: ErrorMessage.CannotLikeMessage,
        ephemeral: true,
      });
    }
    const idRegex = new RegExp(/ID: #(\d+)/);
    const charId = parseInt(embedFooterText.match(idRegex)?.[1] ?? "");
    if (!charId) {
      return interaction.reply({
        content: ErrorMessage.CannotLikeMessage,
        ephemeral: true,
      });
    }
    const characters = new Character();
    const character = await characters.getOne(
      interaction.user.id,
      charId,
      false
    );
    if (!character) {
      return interaction.reply({
        content: ErrorMessage.CharacterNotFound,
        ephemeral: true,
      });
    }
    const likedChar = await characters.addLike(charId, interaction.user.id);
    if (!likedChar) {
      return interaction.reply({
        content: ErrorMessage.AlreadyLiked,
        ephemeral: true,
      });
    }
    return interaction.reply({
      content: Feedback.CharacterLiked,
      ephemeral: true,
    });

  }
}
