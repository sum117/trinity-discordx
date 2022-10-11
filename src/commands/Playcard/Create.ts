import type {
  CommandInteraction,
  Message,
  ModalSubmitInteraction,
} from "discord.js";
import { Discord, ModalComponent, Slash, SlashGroup } from "discordx";

import { Character, UserLocale } from "../../../prisma/queries";
import { TrinityModal } from "../../components/TrinityModal";
import { i18n } from "../../util/i18n";
import { Util } from "../../util/Util";

@Discord()
@SlashGroup({
  description: "commandInfo.managePlaycard",
  descriptionLocalizations: {
    "en-US": i18n.__("commandInfo.managePlaycard"),
    "pt-BR": i18n.__({
      locale: "pt_br",
      phrase: "commandInfo.managePlaycard",
    }),
  },
  name: "char",
  root: "playcard",
})
@SlashGroup("char", "playcard")
export class Playcard {
  @Slash({
    description: i18n.__("commandInfo.create"),
    descriptionLocalizations: {
      "en-US": i18n.__("commandInfo.create"),
      "pt-BR": i18n.__({
        locale: "pt_br",
        phrase: "commandInfo.create",
      })
    },
    name: "create",
  })
  public async create(interaction: CommandInteraction): Promise<void> {
    const locale = (await new UserLocale().get(interaction.user.id)) ?? interaction.guild?.preferredLocale ?? "en";
    const modal = new TrinityModal().char(locale);
    return interaction.showModal(modal);
  }

  @ModalComponent({ id: "char_modal" })
  public async receive(interaction: ModalSubmitInteraction): Promise<Message> {
    const locale = (await new UserLocale().get(interaction.user.id)) ?? interaction.guild?.preferredLocale ?? "en";
    await interaction.deferReply({ ephemeral: true });
    const [name, prefix, image, description, color] = [
      "char_modal_name",
      "char_modal_prefix",
      "char_modal_image",
      "char_modal_description",
      "char_modal_color",
    ].map((id) => interaction.fields.getTextInputValue(id));
    const characters = new Character();
    const colorExists = color && !Util.hexColorValidator(color);
    const imageExists = image && !Util.imageValidator(image);

    // Check if prefix already exists in user's playcards
    const prefixExists = (await characters.getAll(interaction.user.id))
      .map((char) => char.prefix)
      .includes(prefix);

    if (colorExists) {
      return interaction.editReply({
        content: i18n.__({
          locale,
          phrase: "errorMessage.color",
        }),
      });
    } else if (imageExists) {
      return interaction.editReply({
        content: i18n.__({
          locale,
          phrase: "errorMessage.image",
        }),
      });
    } else if (prefixExists) {
      return interaction.editReply({
        content: i18n.__({
          locale,
          phrase: "errorMessage.prefix",
        }),
      });
    }

    const createdCharacter = await characters.createChar(
      interaction.user.id,
      name,
      prefix,
      image,
      description,
      color
    );
    if (createdCharacter) {
      return interaction.editReply({
        content: i18n.__({
          locale,
          phrase: "feedback.characterCreated",
        }),
      });
    }
    return interaction.editReply(i18n.__({
      locale,
      phrase: "errorMessage.databaseError",
    }));
  }
}
