import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

import { i18n } from "../util/i18n";

export class TrinityModal extends ModalBuilder {
  constructor() {
    super();
  }

  public char(locale = "en"): this {
    this.setCustomId("char_modal");
    this.setTitle(i18n.__("trinityModalTitle.createChar"));
    const inputs = [
      new TextInputBuilder()
        .setCustomId("char_modal_name")
        .setLabel(i18n.__({ locale, phrase: "charModalLabel.name" }))
        .setPlaceholder(
          i18n.__({ locale, phrase: "charModalPlaceholder.name" })
        )
        .setMaxLength(256)
        .setRequired(true)
        .setStyle(TextInputStyle.Short),
      new TextInputBuilder()
        .setCustomId("char_modal_prefix")
        .setLabel(i18n.__({ locale, phrase: "charModalLabel.prefix" }))
        .setPlaceholder(
          i18n.__({ locale, phrase: "charModalPlaceholder.prefix" })
        )
        .setMaxLength(32)
        .setRequired(true)
        .setStyle(TextInputStyle.Short),
      new TextInputBuilder()
        .setCustomId("char_modal_image")
        .setLabel(i18n.__({ locale, phrase: "charModalLabel.image" }))
        .setPlaceholder(
          i18n.__({ locale, phrase: "charModalPlaceholder.image" })
        )
        .setMaxLength(256)
        .setRequired(true)
        .setStyle(TextInputStyle.Short),
      new TextInputBuilder()
        .setCustomId("char_modal_description")
        .setLabel(i18n.__({ locale, phrase: "charModalLabel.description" }))
        .setPlaceholder(
          i18n.__({ locale, phrase: "charModalPlaceholder.description" })
        )
        .setMaxLength(4000)
        .setRequired(false)
        .setStyle(TextInputStyle.Paragraph),

      new TextInputBuilder()
        .setCustomId("char_modal_color")
        .setLabel(i18n.__({ locale, phrase: "charModalLabel.color" }))
        .setPlaceholder(
          i18n.__({ locale, phrase: "charModalPlaceholder.color" })
        )
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
