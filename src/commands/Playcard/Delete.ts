import type { CommandInteraction, Message } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";

import { Character } from "../../../prisma/queries/Character";
import { CommandInfo, Feedback } from "../../types/enums";
import { Util } from "../../util/Util";

@Discord()
@SlashGroup("char", "playcard")
export class Playcard {
  @Slash({
    description: CommandInfo.Delete,
    name: "delete",
  })
  public async delete(
    @SlashOption({
      autocomplete: Util.getCharAutoComplete,
      description: CommandInfo.DeleteCharOption,
      name: "char",
      required: true,
      type: ApplicationCommandOptionType.Integer,
    })
    charId: number,
    interaction: CommandInteraction
  ): Promise<Message<boolean>> {
    await interaction.deferReply({ ephemeral: true });
    new Character().deleteChar(interaction.user.id, charId);
    return interaction.editReply({
      content: Feedback.CharacterDeleted,
    });
  }
}
