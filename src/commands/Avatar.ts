import type {
  CommandInteraction,
  GuildMember,
  InteractionResponse,
} from "discord.js";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";

import { CommandInfo } from "../types/enums";

@Discord()
export class Utilities {
  @Slash({ description: CommandInfo.Avatar, name: "avatar" })
  public avatar(
    @SlashOption({
      description: CommandInfo.AvatarOption,
      name: "member",
      required: false,
      type: ApplicationCommandOptionType.User,
    })
    member: GuildMember,
    interaction: CommandInteraction
  ): Promise<InteractionResponse<boolean>> {
    const user = member?.user ?? interaction.user;
    const userAvatar = user.displayAvatarURL({ size: 1024 });

    const embed = new EmbedBuilder();
    embed.setTitle(`${user.username}`);
    embed.setImage(userAvatar);
    embed.setColor("Random");

    return interaction.reply({ embeds: [embed] });
  }
}
