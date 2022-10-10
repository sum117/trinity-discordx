import type {
  ButtonInteraction,
  CommandInteraction,
  InteractionResponse,
  Message,
  ModalSubmitInteraction,
} from "discord.js";
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import {
  ButtonComponent,
  Discord,
  ModalComponent,
  Slash,
  SlashGroup,
  SlashOption,
} from "discordx";

import { Character } from "../../../prisma/queries/Character";
import { CharEmbedBuilder } from "../../components/CharEmbed";
import {
  CharModalLabel,
  CharUpdateButtonLabel,
  CharUpdateModalPlaceholder,
  CommandInfo,
  ErrorMessage,
  Feedback,
  TrinityModalTitle,
} from "../../types/enums";
import { Util } from "../../util/Util";

@Discord()
@SlashGroup("char", "playcard")
export class Playcard {
  @Slash({ description: CommandInfo.Update, name: "update" })
  public async update(
    @SlashOption({
      autocomplete: Util.getCharAutoComplete,
      description: CommandInfo.UpdateCharOption,
      name: "character",
      required: true,
      type: ApplicationCommandOptionType.Integer,
    })
    char: number,
    interaction: CommandInteraction
  ): Promise<Message<boolean>> {
    await interaction.deferReply({ ephemeral: true });
    const characterDatabase = new Character();
    const character = await characterDatabase.getOne(interaction.user.id, char);
    if (!character) {
      return interaction.editReply({
        content: ErrorMessage.CharacterNotFound,
      });
    }
    const embed = new CharEmbedBuilder(interaction.user, character).profile();

    const getBtnCustomId = (option: string) =>
      `char_update_modal_${option.toLowerCase()}_${char}`;
    const firstRow = new ActionRowBuilder<ButtonBuilder>().setComponents([
      new ButtonBuilder()
        .setCustomId(getBtnCustomId("name"))
        .setLabel(CharUpdateButtonLabel.Name)
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(getBtnCustomId("prefix"))
        .setLabel(CharUpdateButtonLabel.Prefix)
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(getBtnCustomId("image"))
        .setLabel(CharUpdateButtonLabel.Image)
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(getBtnCustomId("description"))
        .setLabel(CharUpdateButtonLabel.Description)
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(getBtnCustomId("color"))
        .setLabel(CharUpdateButtonLabel.Color)
        .setStyle(ButtonStyle.Primary),
    ]);
    const secondRow = new ActionRowBuilder<ButtonBuilder>().setComponents([
      new ButtonBuilder()
        .setCustomId(getBtnCustomId("title"))
        .setLabel(CharUpdateButtonLabel.Title)
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(getBtnCustomId("music"))
        .setLabel(CharUpdateButtonLabel.Music)
        .setStyle(ButtonStyle.Primary),
    ]);
    const feedback = Feedback.CharacterUpdateMenu.replace(
      "{character}",
      character.name
    ).replace("{user}", interaction.user.toString());
    return interaction.editReply({
      components: [firstRow, secondRow],
      content: feedback,
      embeds: [embed],
    });
  }
  @ButtonComponent({ id: /char_update_modal_.+/ })
  public updateButton(interaction: ButtonInteraction): Promise<void> {
    const [option, charId] = interaction.customId
      .replace("char_update_modal_", "")
      .split("_");
    const formattedOption = Util.titleCase(
      option
    ) as keyof typeof CharModalLabel;

    // Title Input
    if (formattedOption === "Title") {
      const titleInputs = [
        new TextInputBuilder()
          .setCustomId("char_update_modal_title_name")
          .setLabel(CharModalLabel.Title)
          .setPlaceholder(CharUpdateModalPlaceholder.Title)
          .setMinLength(1)
          .setMaxLength(256)
          .setRequired(true)
          .setStyle(TextInputStyle.Short),
        new TextInputBuilder()
          .setCustomId("char_update_modal_title_icon")
          .setLabel(CharModalLabel.TitleIcon)
          .setPlaceholder(CharUpdateModalPlaceholder.TitleIcon)
          .setMinLength(1)
          .setMaxLength(256)
          .setRequired(true)
          .setStyle(TextInputStyle.Short),
      ].map((input) =>
        new ActionRowBuilder<TextInputBuilder>().setComponents(input)
      );
      const modal = new ModalBuilder()
        .setComponents(titleInputs)
        .setTitle(TrinityModalTitle.UpdateChar)
        .setCustomId("char_update_modal_title_" + charId);
      return interaction.showModal(modal);
    }
    // Normal input
    const isDescription = formattedOption === "Description";
    const normalInput = new ActionRowBuilder<TextInputBuilder>().setComponents([
      new TextInputBuilder()
        .setRequired(true)
        .setCustomId(interaction.customId)
        .setLabel(CharModalLabel[formattedOption])
        .setPlaceholder(CharUpdateModalPlaceholder[formattedOption])
        .setMinLength(1)
        .setMaxLength(isDescription ? 4000 : 256)
        .setStyle(
          isDescription ? TextInputStyle.Paragraph : TextInputStyle.Short
        ),
    ]);

    const modalCustomId = `char_update_modal_${formattedOption.toLowerCase()}_${charId}`;
    const modal = new ModalBuilder()
      .setCustomId(modalCustomId)
      .setTitle(TrinityModalTitle.UpdateChar)
      .setComponents(normalInput);
    return interaction.showModal(modal);
  }
  @ModalComponent({ id: /char_update_modal_.+/ })
  public async updateModal(
    interaction: ModalSubmitInteraction
  ): Promise<InteractionResponse<boolean>> {
      const [option, charId] = interaction.customId
        .replace("char_update_modal_", "")
        .split("_");
      const characterDatabase = new Character();

      if (option === "title") {
        const [title, titleIcon] = [
          "char_update_modal_title_name",
          "char_update_modal_title_icon",
        ].map((customId) => interaction.fields.getTextInputValue(customId));
        const imageExists = Util.imageValidator(titleIcon);
        if (!imageExists) {
          return interaction.reply({
              content: ErrorMessage.Image,
              ephemeral: true,
          });
        }
        const updatedChar = await characterDatabase.updateChar(
          interaction.user.id,
          Number(charId),
          {
            title: {
              iconURL: titleIcon,
              name: title,
            },
          }
        );
        if (!updatedChar) {
          return interaction.reply({content: ErrorMessage.DatabaseError, ephemeral: true});
        }
        const embed = new CharEmbedBuilder(
          interaction.user,
          updatedChar
        ).profile();
        return interaction.reply({
          content: Feedback.CharacterUpdated,
          embeds: [embed],
          ephemeral: true,
        });
      }

      if (option === "color") {
        const colorExists = Util.hexColorValidator(
          interaction.fields.getTextInputValue(interaction.customId)
        );
        if (!colorExists) {
          return interaction.reply({
              content: ErrorMessage.Color,
              ephemeral: true
          });
        }
      } else if (option === "image") {
        const imageExists = Util.imageValidator(
          interaction.fields.getTextInputValue(interaction.customId)
        );
        if (!imageExists) {
          return interaction.reply({
              content: ErrorMessage.Image,
              ephemeral: true
          });
        }
      } else if (option === "music") {
          const musicExists = Util.youtubeValidator(
              interaction.fields.getTextInputValue(interaction.customId)
          );
          if (!musicExists) {
              return interaction.reply({
                  content: ErrorMessage.Music,
                  ephemeral: true
              });
          }
      } else if (option === "prefix") {
          const prefix = interaction.fields.getTextInputValue(interaction.customId);
          const prefixExists = (await characterDatabase.getAll(interaction.user.id))
          .map((char) => char.prefix)
              .includes(prefix);
          if (prefixExists) {
              return interaction.reply({
                  content: ErrorMessage.Prefix,
                  ephemeral: true
              });
          }
      }
      const updatedChar = await characterDatabase.updateChar(
        interaction.user.id,
        Number(charId),
        {
          [option]: interaction.fields.getTextInputValue(interaction.customId),
        }
      );
      if (!updatedChar) {
        return interaction.reply({content: ErrorMessage.DatabaseError, ephemeral: true});
      }
      const embed = new CharEmbedBuilder(interaction.user, updatedChar).profile();
      return interaction.reply({
        content: Feedback.CharacterUpdated,
        embeds: [embed],
        ephemeral: true,
      });
  }
}
