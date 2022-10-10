import type { GifInteraction } from "@prisma/client";
import type { CommandInteraction, GuildMember, Message } from "discord.js";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import type { SlashOptionOptions } from "discordx";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";

import { GifInteractionCounter } from "../../prisma/queries";
import { interactions } from "../resources/json/gifs";
import { CommandInfo, Feedback } from "../types/enums";
import type { GifInteractionOptions } from "../types/interfaces";
import { Util } from "../util/Util";

const slashOptions: SlashOptionOptions<
  "target",
  CommandInfo.InteractUserOption
> = {
  description: CommandInfo.InteractUserOption,
  name: "target",
  required: true,
  type: ApplicationCommandOptionType.User,
};

@Discord()
@SlashGroup({ description: CommandInfo.Interact, name: "interact" })
@SlashGroup("interact")
export class Interact {
  @Slash({ description: CommandInfo.InteractHug, name: "hug" })
  public async hug(
    @SlashOption(slashOptions)
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

  @Slash({ description: CommandInfo.InteractKiss, name: "kiss" })
  public async kiss(
    @SlashOption(slashOptions)
    target: GuildMember,
    interaction: CommandInteraction
  ): Promise<Message<boolean>> {
    await interaction.deferReply();
    const embed = await this._createInteractEmbed({
      interactionName: "kiss",
      target: target.user,
      user: interaction.user,
    });
    return interaction.editReply({ embeds: [embed] });
  }

  @Slash({ description: CommandInfo.InteractSlap, name: "slap" })
  public async slap(
    @SlashOption(slashOptions)
    target: GuildMember,
    interaction: CommandInteraction
  ): Promise<Message<boolean>> {
    await interaction.deferReply();
    const embed = await this._createInteractEmbed({
      interactionName: "slap",
      target: target.user,
      user: interaction.user,
    });
    return interaction.editReply({ embeds: [embed] });
  }

  @Slash({ description: CommandInfo.InteractPunch, name: "punch" })
  public async punch(
    @SlashOption(slashOptions)
    target: GuildMember,
    interaction: CommandInteraction
  ): Promise<Message<boolean>> {
    await interaction.deferReply();
    const embed = await this._createInteractEmbed({
      interactionName: "punch",
      target: target.user,
      user: interaction.user,
    });
    return interaction.editReply({ embeds: [embed] });
  }

  @Slash({ description: CommandInfo.InteractBite, name: "bite" })
  public async bite(
    @SlashOption(slashOptions)
    target: GuildMember,
    interaction: CommandInteraction
  ): Promise<Message<boolean>> {
    await interaction.deferReply();
    const embed = await this._createInteractEmbed({
      interactionName: "bite",
      target: target.user,
      user: interaction.user,
    });
    return interaction.editReply({ embeds: [embed] });
  }

  private async _createInteractEmbed(options: GifInteractionOptions) {
    const { interactionName, target, user } = options;

    const counters = new GifInteractionCounter(user, target);
    const counterString = `${interactionName}Count` as keyof GifInteraction;
    const counter = await counters.increment("target", counterString);
    const counterValue = (counter?.[counterString] ?? 0).toString();
    const embed = new EmbedBuilder();
    const reply = Feedback[
      Util.titleCase(interactionName) as keyof typeof Feedback
    ]
      .replaceAll("{user}", user.username)
      .replaceAll("{target}", target.username)
      .replaceAll("{counter}", counterValue);

    embed.setDescription(reply);
    embed.setImage(Util.randomIndex(interactions[interactionName]));
    embed.setColor("Random");

    return embed;
  }
}
