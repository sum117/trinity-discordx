import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

import {
  CharModalLabel,
  CharModalPlaceholder,
  TrinityModalTitle,
} from "../types/enums";

export class TrinityModal extends ModalBuilder {
  constructor() {
    super();
  }

  public char(): this {
    this.setCustomId("char_modal");
    this.setTitle(TrinityModalTitle.CreateChar);
    const inputs = [
      new TextInputBuilder()
        .setCustomId("char_modal_name")
        .setLabel(CharModalLabel.Name)
        .setPlaceholder(CharModalPlaceholder.Name)
        .setMaxLength(256)
        .setRequired(true)
        .setStyle(TextInputStyle.Short),
      new TextInputBuilder()
        .setCustomId("char_modal_prefix")
        .setLabel(CharModalLabel.Prefix)
        .setPlaceholder(CharModalPlaceholder.Prefix)
        .setMaxLength(32)
        .setRequired(true)
        .setStyle(TextInputStyle.Short),
      new TextInputBuilder()
        .setCustomId("char_modal_image")
        .setLabel(CharModalLabel.Image)
        .setPlaceholder(CharModalPlaceholder.Image)
        .setMaxLength(256)
        .setRequired(true)
        .setStyle(TextInputStyle.Short),
      new TextInputBuilder()
        .setCustomId("char_modal_description")
        .setLabel(CharModalLabel.Description)
        .setPlaceholder(CharModalPlaceholder.Description)
        .setMaxLength(4000)
        .setRequired(false)
        .setStyle(TextInputStyle.Paragraph),

      new TextInputBuilder()
        .setCustomId("char_modal_color")
        .setLabel(CharModalLabel.Color)
        .setPlaceholder(CharModalPlaceholder.Color)
        .setMaxLength(7)
        .setRequired(false)
        .setStyle(TextInputStyle.Short),
    ];
    const rows = inputs.map((input) =>
      new ActionRowBuilder<TextInputBuilder>().addComponents(input)
    );

    this.addComponents(rows);
    return this;
  }
}
