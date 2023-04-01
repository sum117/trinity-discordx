import type {
  CommandInteraction,
  GuildMember,
  InteractionResponse,
} from "discord.js";
import { ApplicationCommandOptionType, AttachmentBuilder } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";

import { Character } from "../../../prisma/queries";
import composeUserProfile from "../../util/composeUserProfile";
import { i18n } from "../../util/i18n";

@Discord()
export class Utilities {
  @Slash({
    description: i18n.__("commandInfo.userProfile"),
    descriptionLocalizations: {
      "en-US": i18n.__("commandInfo.userProfile"),
      "pt-BR": i18n.__({ locale: "pt_br", phrase: "commandInfo.userProfile" }),
    },
    name: "user_profile",
  })
  public async userProfile(
    @SlashOption({
      description: i18n.__("commandInfo.userProfileOption"),
      descriptionLocalizations: {
        "en-US": i18n.__("commandInfo.userProfileOption"),
        "pt-BR": i18n.__({
          locale: "pt_br",
          phrase: "commandInfo.userProfileOption",
        }),
      },
      name: "member",
      required: false,
      type: ApplicationCommandOptionType.User,
    })
    member: GuildMember,
    interaction: CommandInteraction
  ): Promise<InteractionResponse> {
    const user = member ?? interaction.member;
    const characters = new Character().getAll(user.user.id);
    const userStats = (await characters).reduce(
      (acc, curr) => {
        acc.characters++;
        acc.letters += curr.letters;
        acc.likes += JSON.parse(curr.likes).length;
        acc.posts += curr.posts.length;
        return acc;
      },
      {
        characters: 0,
        letters: 0,
        likes: 0,
        posts: 0,
      }
    );

    const userProfileBuffer = await composeUserProfile({
      avatar: user.user.displayAvatarURL({ extension: "png", size: 256 }),
      name: user.user.username + "#" + user.user.discriminator,
      ...userStats,
    });

    const attachment = new AttachmentBuilder(userProfileBuffer).setName(
      "user_profile.png"
    );

    return interaction.reply({
      files: [attachment],
    });
  }
}
