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

import { Character, UserLocale } from "../../../prisma/queries";
import { CharEmbedBuilder } from "../../components/CharEmbed";
import type { CharUpdateOptions } from "../../types/interfaces";
import { i18n } from "../../util/i18n";
import { Util } from "../../util/Util";

@Discord()
@SlashGroup("char", "playcard")
export class Playcard {
  @Slash({
    description: i18n.__("commandInfo.update"),
    descriptionLocalizations: {
      "en-US": i18n.__("commandInfo.update"),
      "pt-BR": i18n.__({ locale: "pt_br", phrase: "commandInfo.update" }),
    },
    name: "update",
  })
  public async update(
    @SlashOption({
      autocomplete: Util.getCharAutoComplete,
      description: i18n.__("commandInfo.updateCharOption"),
      descriptionLocalizations: {
        "en-US": i18n.__("commandInfo.updateCharOption"),
        "pt-BR": i18n.__({
          locale: "pt_br",
          phrase: "commandInfo.updateCharOption",
        }),
      },
      name: "character",
      required: true,
      type: ApplicationCommandOptionType.Integer,
    })
    char: number,
    interaction: CommandInteraction
  ): Promise<Message> {
    const locale =
      (await new UserLocale().get(interaction.user.id)) ??
      interaction.guild?.preferredLocale ??
      "en";
    await interaction.deferReply({ ephemeral: true });
    const characterDatabase = new Character();
    const character = await characterDatabase.getOne(interaction.user.id, char);
    if (!character) {
      return interaction.editReply({
        content: i18n.__({ locale, phrase: "errorMessage.characterNotFound" }),
      });
    }
    const embed = new CharEmbedBuilder(interaction.user, character).profile(
      locale
    );

    const getBtnCustomId = (option: string) =>
      `char_update_modal_${option}_${char}`;
    const firstRow = new ActionRowBuilder<ButtonBuilder>().setComponents([
      new ButtonBuilder()
        .setCustomId(getBtnCustomId("name"))
        .setLabel(i18n.__({ locale, phrase: "charUpdateButtonLabel.name" }))
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(getBtnCustomId("prefix"))
        .setLabel(i18n.__({ locale, phrase: "charUpdateButtonLabel.prefix" }))
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(getBtnCustomId("image"))
        .setLabel(i18n.__({ locale, phrase: "charUpdateButtonLabel.image" }))
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(getBtnCustomId("description"))
        .setLabel(
          i18n.__({ locale, phrase: "charUpdateButtonLabel.description" })
        )
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(getBtnCustomId("color"))
        .setLabel(i18n.__({ locale, phrase: "charUpdateButtonLabel.color" }))
        .setStyle(ButtonStyle.Primary),
    ]);
    const secondRow = new ActionRowBuilder<ButtonBuilder>().setComponents([
      new ButtonBuilder()
        .setCustomId(getBtnCustomId("title"))
        .setLabel(i18n.__({ locale, phrase: "charUpdateButtonLabel.title" }))
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(getBtnCustomId("music"))
        .setLabel(i18n.__({ locale, phrase: "charUpdateButtonLabel.music" }))
        .setStyle(ButtonStyle.Primary),
    ]);
    const thirdRow = new ActionRowBuilder<ButtonBuilder>().setComponents([
      new ButtonBuilder()
        .setCustomId(`char_remove_title_${char}`)
        .setLabel(i18n.__({ locale, phrase: "charUpdateButtonLabel.title" }))
        .setDisabled(!character.title?.name)
        .setEmoji("🗑️")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId(`char_remove_music_${char}`)
        .setLabel(i18n.__({ locale, phrase: "charUpdateButtonLabel.music" }))
        .setDisabled(!character.music)
        .setEmoji("🗑️")
        .setStyle(ButtonStyle.Danger),
    ]);
    const feedback = i18n
      .__({ locale, phrase: "feedback.characterUpdateMenu" })
      .replace("{character}", character.name)
      .replace("{user}", interaction.user.toString());
    return interaction.editReply({
      components: [firstRow, secondRow, thirdRow],
      content: feedback,
      embeds: [embed],
    });
  }
  @ButtonComponent({ id: /char_update_modal_.+/ })
  public async updateButton(interaction: ButtonInteraction): Promise<void> {
    const locale =
      (await new UserLocale().get(interaction.user.id)) ??
      interaction.guild?.preferredLocale ??
      "en";
    const [option, charId] = interaction.customId
      .replace("char_update_modal_", "")
      .split("_");

    // Title Input
    if (option === "title") {
      const titleInputs = [
        new TextInputBuilder()
          .setCustomId("char_update_modal_title_name")
          .setLabel(i18n.__({ locale, phrase: "charModalLabel.title" }))
          .setPlaceholder(i18n.__("charUpdateModalPlaceholder.title"))
          .setMinLength(1)
          .setMaxLength(256)
          .setRequired(true)
          .setStyle(TextInputStyle.Short),
        new TextInputBuilder()
          .setCustomId("char_update_modal_title_icon")
          .setLabel(i18n.__({ locale, phrase: "charModalLabel.titleIcon" }))
          .setPlaceholder(
            i18n.__({ locale, phrase: "charUpdateModalPlaceholder.titleIcon" })
          )
          .setMinLength(1)
          .setMaxLength(256)
          .setRequired(true)
          .setStyle(TextInputStyle.Short),
      ].map((input) =>
        new ActionRowBuilder<TextInputBuilder>().setComponents(input)
      );
      const modal = new ModalBuilder()
        .setComponents(titleInputs)
        .setTitle(i18n.__({ locale, phrase: "trinityModalTitle.updateChar" }))
        .setCustomId("char_update_modal_title_" + charId);
      return interaction.showModal(modal);
    }
    // Normal input
    const isDescription = option === "description";
    const label = i18n.__({ locale, phrase: `charModalLabel.${option}` });
    const placeholder = i18n.__({
      locale,
      phrase: `charUpdateModalPlaceholder.${option}`,
    });
    const normalInput = new ActionRowBuilder<TextInputBuilder>().setComponents([
      new TextInputBuilder()
        .setRequired(true)
        .setCustomId(interaction.customId)
        .setLabel(label)
        .setPlaceholder(placeholder)
        .setMinLength(1)
        .setMaxLength(isDescription ? 4000 : 256)
        .setStyle(
          isDescription ? TextInputStyle.Paragraph : TextInputStyle.Short
        ),
    ]);

    const modalCustomId = `char_update_modal_${option}_${charId}`;
    const modal = new ModalBuilder()
      .setCustomId(modalCustomId)
      .setTitle(i18n.__({ locale, phrase: "trinityModalTitle.updateChar" }))
      .setComponents(normalInput);
    return interaction.showModal(modal);
  }
  @ButtonComponent({ id: /char_remove_.+/ })
  public async removeButton(
    interaction: ButtonInteraction
  ): Promise<Message | void> {
    await interaction.deferReply({ ephemeral: true });
    const locale =
      (await new UserLocale().get(interaction.user.id)) ??
      interaction.guild?.preferredLocale ??
      "en";
    const [option, charId] = interaction.customId
      .replace("char_remove_", "")
      .split("_");

    const charUpdateOptions = {} as CharUpdateOptions;
    if (option === "title") {
      charUpdateOptions[option] = null;
    } else if (option === "music") {
      charUpdateOptions[option] = null;
    }

    const updatedChar = await new Character().updateChar(
      interaction.user.id,
      parseInt(charId),
      charUpdateOptions
    );
    if (!updatedChar) {
      return interaction.editReply({
        content: i18n.__({ locale, phrase: "errorMessage.databaseError" }),
      });
    }
    const embed = new CharEmbedBuilder(interaction.user, updatedChar).profile(
      locale
    );
    return interaction.editReply({
      content: i18n.__({ locale, phrase: "feedback.characterUpdated" }),
      embeds: [embed],
    });
  }
  @ModalComponent({ id: /char_update_modal_.+/ })
  public async updateModal(
    interaction: ModalSubmitInteraction
  ): Promise<InteractionResponse> {
    const locale = (await new UserLocale().get(interaction.user.id)) ?? "en";
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
          content: i18n.__({ locale, phrase: "errorMessage.image" }),
          ephemeral: true,
        });
      }
      const updatedChar = await characterDatabase.updateChar(
        interaction.user.id,
        parseInt(charId),
        {
          title: {
            iconURL: titleIcon,
            name: title,
          },
        }
      );
      if (!updatedChar) {
        return interaction.reply({
          content: i18n.__({ locale, phrase: "errorMessage.databaseError" }),
          ephemeral: true,
        });
      }
      const embed = new CharEmbedBuilder(interaction.user, updatedChar).profile(
        locale
      );
      return interaction.reply({
        content: i18n.__({ locale, phrase: "feedback.characterUpdated" }),
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
          content: i18n.__({ locale, phrase: "errorMessage.color" }),
          ephemeral: true,
        });
      }
    } else if (option === "image") {
      const imageExists = Util.imageValidator(
        interaction.fields.getTextInputValue(interaction.customId)
      );
      if (!imageExists) {
        return interaction.reply({
          content: i18n.__({ locale, phrase: "errorMessage.image" }),
          ephemeral: true,
        });
      }
    } else if (option === "music") {
      const musicExists = Util.youtubeValidator(
        interaction.fields.getTextInputValue(interaction.customId)
      );
      if (!musicExists) {
        return interaction.reply({
          content: i18n.__({ locale, phrase: "errorMessage.music" }),
          ephemeral: true,
        });
      }
    } else if (option === "prefix") {
      const prefix = interaction.fields.getTextInputValue(interaction.customId);
      const prefixExists = (await characterDatabase.getAll(interaction.user.id))
        .map((char) => char.prefix)
        .includes(prefix);
      if (prefixExists) {
        return interaction.reply({
          content: i18n.__({ locale, phrase: "errorMessage.prefix" }),
          ephemeral: true,
        });
      }
    }
    const updatedChar = await characterDatabase.updateChar(
      interaction.user.id,
      parseInt(charId),
      {
        [option]: interaction.fields.getTextInputValue(interaction.customId),
      }
    );
    if (!updatedChar) {
      return interaction.reply({
        content: i18n.__({ locale, phrase: "errorMessage.databaseError" }),
        ephemeral: true,
      });
    }
    const embed = new CharEmbedBuilder(interaction.user, updatedChar).profile(
      locale
    );
    return interaction.reply({
      content: i18n.__({ locale, phrase: "feedback.characterUpdated" }),
      embeds: [embed],
      ephemeral: true,
    });
  }
}
