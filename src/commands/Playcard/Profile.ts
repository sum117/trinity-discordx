import type {
  CommandInteraction,
  InteractionResponse,
  Message} from "discord.js";
import {
 ApplicationCommandOptionType,  userMention } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";

import { Character } from "../../../prisma/queries/Character";
import { CharEmbedBuilder } from "../../components/CharEmbed";
import { CommandInfo, ErrorMessage, Feedback } from "../../types/enums";
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
    const embed = new CharEmbedBuilder(interaction.user, character).profile();
    const feedback = Feedback.DisplayProfile.replace(
      "{character}",
      character.name
    ).replace("{user}", userMention(character.authorId));
    return interaction.editReply({ content: feedback, embeds: [embed] });
  }
}
