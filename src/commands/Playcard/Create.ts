import type {
  CommandInteraction,
  Message,
  ModalSubmitInteraction,
} from "discord.js";
import { Discord, ModalComponent, Slash, SlashGroup } from "discordx";

import { Character } from "../../../prisma/queries/Character";
import { TrinityModal } from "../../components/TrinityModal";
import { CommandInfo, ErrorMessage, Feedback } from "../../types/enums";
import { Util } from "../../util/Util";

@Discord()
@SlashGroup({
  description: CommandInfo.ManagePlaycard,
  name: "char",
  root: "playcard",
})
@SlashGroup("char", "playcard")
export class Playcard {
  @Slash({
    description: CommandInfo.Create,
    name: "create",
  })
  public create(interaction: CommandInteraction): Promise<void> {
    const modal = new TrinityModal().char();
    return interaction.showModal(modal);
  }

  @ModalComponent({ id: "char_modal" })
  public async receive(
    interaction: ModalSubmitInteraction
  ): Promise<Message<boolean>> {
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
        content: ErrorMessage.Color,
      });
    } else if (imageExists) {
      return interaction.editReply({
        content: ErrorMessage.Image,
      });
    } else if (prefixExists) {
      return interaction.editReply({
        content: ErrorMessage.Prefix,
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
        content: Feedback.CharacterCreated,
      });
    }
    return interaction.editReply(ErrorMessage.DatabaseError);
  }
}
