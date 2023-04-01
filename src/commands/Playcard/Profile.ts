import type {
  APIButtonComponent,
  ButtonInteraction,
  CommandInteraction,
  InteractionResponse,
  Message,
  MessageContextMenuCommandInteraction,
} from "discord.js";
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ApplicationCommandType,
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

import { Character, UserLocale } from "../../../prisma/queries";
import { CharEmbedBuilder } from "../../components/CharEmbed";
import { i18n } from "../../util/i18n";
import { Util } from "../../util/Util";

@Discord()
@SlashGroup("char", "playcard")
export class Playcard {
  @Slash({
    description: i18n.__("commandInfo.profile"),
    descriptionLocalizations: {
      "en-US": i18n.__("commandInfo.profile"),
      "pt-BR": i18n.__({
        locale: "pt_br",
        phrase: "commandInfo.profile",
      }),
    },
    name: "profile",
  })
  public async profile(
    @SlashOption({
      autocomplete: Util.getCharAutoComplete,
      description: i18n.__("commandInfo.profileCharOption"),
      descriptionLocalizations: {
        "en-US": i18n.__("commandInfo.profileCharOption"),
        "pt-BR": i18n.__({
          locale: "pt_br",
          phrase: "commandInfo.profileCharOption",
        }),
      },
      name: "character",
      required: true,
      type: ApplicationCommandOptionType.Integer,
    })
    char: number,
    interaction: CommandInteraction
  ): Promise<Message | InteractionResponse> {
    const locale =
      (await new UserLocale().get(interaction.user.id)) ??
      interaction.guild?.preferredLocale ??
      "en";
    await interaction.deferReply({ ephemeral: false });
    const characters = new Character();
    const character = await characters.getOne(interaction.user.id, char, false);
    if (!character) {
      return interaction.editReply({
        content: i18n.__({ locale, phrase: "errorMessage.characterNotFound" }),
      });
    }
    const likeBtnCustomId = `char_like_${character.id}`;
    const likeBtn = new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setCustomId(likeBtnCustomId)
        .setLabel(i18n.__({ locale, phrase: "charLikeButton.like" }))
        .setEmoji(i18n.__({ locale, phrase: "charLikeButton.emoji" }))
        .setStyle(ButtonStyle.Danger)
    );
    const embed = new CharEmbedBuilder(interaction.user, character).profile(
      locale
    );

    const feedback = i18n.__mf(
      { locale, phrase: "feedback.displayProfile" },
      { character: character.name, user: userMention(character.authorId) }
    );
    return interaction.editReply({
      components: [likeBtn],
      content: feedback,
      embeds: [embed],
    });
  }

  @ButtonComponent({ id: /char_like_.+/ })
  public async like(interaction: ButtonInteraction): Promise<Message | void> {
    const locale =
      (await new UserLocale().get(interaction.user.id)) ??
      interaction.guild?.preferredLocale ??
      "en";
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
        content: i18n.__({ locale, phrase: "errorMessage.databaseError" }),
      });
    }
    // Disable like button
    const apiBtn = interaction.message.components[0]
      .components[0] as APIButtonComponent;
    const likeBtn = new ActionRowBuilder<ButtonBuilder>().setComponents(
      ButtonBuilder.from(apiBtn).setDisabled(false)
    );
    // Manage like
    const likedChar = await characters.addLike(charId, interaction.user.id);
    if (!likedChar) {
      return interaction.followUp({
        content:
          `<@${interaction.user.id}> ` +
          i18n.__({ locale, phrase: "errorMessage.alreadyLiked" }) +
          `: ${character.name}`,
      });
    }
    const embed = new CharEmbedBuilder(interaction.user, likedChar).profile(
      locale
    );
    const feedback = i18n
      .__("feedback.displayProfile")
      .replace("{character}", character.name)
      .replace("{user}", userMention(character.authorId));
    await interaction.followUp({
      content:
        `<@${interaction.user.id}> ` +
        i18n.__({ locale, phrase: "feedback.characterLiked" }) +
        `: ${character.name}`,
      ephemeral: false,
    });
    return interaction.editReply({
      components: [likeBtn],
      content: feedback,
      embeds: [embed],
    });
  }

  @ContextMenu({
    name: "Like this character",
    type: ApplicationCommandType.Message,
  })
  public async likeContext(
    interaction: MessageContextMenuCommandInteraction
  ): Promise<InteractionResponse> {
    const locale =
      (await new UserLocale().get(interaction.user.id)) ??
      interaction.guild?.preferredLocale ??
      "en";
    const embedFooterText = interaction.targetMessage.embeds?.[0]?.footer?.text;
    if (!embedFooterText) {
      return interaction.reply({
        content: i18n.__({ locale, phrase: "errorMessage.cannotLikeMessage" }),
        ephemeral: true,
      });
    }
    const idRegex = new RegExp(/ID: #(\d+)/);
    const charId = parseInt(embedFooterText.match(idRegex)?.[1] ?? "");
    if (!charId) {
      return interaction.reply({
        content: i18n.__({ locale, phrase: "errorMessage.cannotLikeMessage" }),
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
        content: i18n.__({ locale, phrase: "errorMessage.characterNotFound" }),
        ephemeral: true,
      });
    }
    const likedChar = await characters.addLike(charId, interaction.user.id);
    if (!likedChar) {
      return interaction.reply({
        content: i18n.__({ locale, phrase: "errorMessage.alreadyLiked" }),
        ephemeral: true,
      });
    }
    return interaction.reply({
      content: i18n.__({ locale, phrase: "feedback.characterLiked" }),
      ephemeral: true,
    });
  }
}
