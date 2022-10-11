import type {
  CommandInteraction,
  GuildMember,
  InteractionResponse,
} from "discord.js";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";

import { i18n } from "../../util/i18n";

@Discord()
export class Utilities {
  @Slash({
    description: i18n.__("commandInfo.avatar"),
    descriptionLocalizations: {
      "en-US": i18n.__("commandInfo.avatar"),
      "pt-BR": i18n.__({ locale: "pt_br", phrase: "commandInfo.avatar" }),
    },
    name: "avatar",
  })
  public avatar(
    @SlashOption({
      description: i18n.__("commandInfo.avatarOption"),
      descriptionLocalizations: {
        "en-US": i18n.__("commandInfo.avatarOption"),
        "pt-BR": i18n.__({
          locale: "pt_br",
          phrase: "commandInfo.avatarOption",
        }),
      },
      name: "member",
      required: false,
      type: ApplicationCommandOptionType.User,
    })
    member: GuildMember,
    interaction: CommandInteraction
  ): Promise<InteractionResponse> {
    const user = member?.user ?? interaction.user;
    const userAvatar = user.displayAvatarURL({ size: 1024 });

    const embed = new EmbedBuilder();
    embed.setTitle(`${user.username}`);
    embed.setImage(userAvatar);
    embed.setColor("Random");

    return interaction.reply({ embeds: [embed] });
  }
}
