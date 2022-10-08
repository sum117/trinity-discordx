import type { GifInteraction } from "@prisma/client";
import type { CommandInteraction, GuildMember, Message } from "discord.js";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";

import { GifInteractionCounter } from "../../prisma/queries";
import { hug } from "../resources/json/gifs";
import { CommandInfo, Feedback } from "../types/enums";
import type { GifInteractionOptions } from "../types/interfaces";
import { Util } from "../util/Util";

@Discord()
export class Interact {
  @Slash({ description: CommandInfo.InteractHug, name: "hug" })
  public async hug(
    @SlashOption({
      description: CommandInfo.InteractUserOption,
      name: "target",
      required: true,
      type: ApplicationCommandOptionType.User,
    })
    target: GuildMember,
    interaction: CommandInteraction
  ): Promise<Message<boolean>> {
    await interaction.deferReply();
    const embed = await this._createInteractEmbed({
      interactionName: "hug",
      target: target.user,
      user: interaction.user,
    });
    return interaction.editReply({ embeds: [embed] });
  }

  private async _createInteractEmbed(options: GifInteractionOptions) {
    options.interactionName = options?.interactionName ?? "hug";
    const { interactionName, target, user } = options;

    const counters = new GifInteractionCounter(user, target);
    const counter = await counters.get("target");

    const counterString = `${interactionName}Count` as keyof GifInteraction;
    const counterValue = (counter?.[counterString] ?? 0).toString();
    await counters.increment("target", counterString);
    const embed = new EmbedBuilder();
    const reply = Feedback[
      Util.titleCase(interactionName) as keyof typeof Feedback
    ]
      .replaceAll("{user}", user.username)
      .replaceAll("{target}", target.username)
      .replaceAll("{counter}", counterValue);

    embed.setDescription(reply);
    embed.setImage(hug.random);
    embed.setColor("Random");

    return embed;
  }
}
