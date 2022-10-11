import type { GifInteraction } from "@prisma/client";
import type { CommandInteraction, GuildMember, Message } from "discord.js";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import type { SlashOptionOptions } from "discordx";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";

import { GifInteractionCounter, UserLocale } from "../../prisma/queries";
import { interactions } from "../resources/json/gifs";
import type { GifInteractionOptions } from "../types/interfaces";
import { i18n } from "../util/i18n";
import { Util } from "../util/Util";

const slashOptions: SlashOptionOptions<"target", string> = {
  description: i18n.__("commandInfo.interactUserOption"),
  descriptionLocalizations: {
    "en-US": i18n.__("commandInfo.interactUserOption"),
    "pt-BR": i18n.__({
      locale: "pt_br",
      phrase: "commandInfo.interactUserOption",
    }),
  },
  name: "target",
  required: true,
  type: ApplicationCommandOptionType.User,
};

@Discord()
@SlashGroup({
  description: i18n.__("commandInfo.interact"),
  descriptionLocalizations: {
    "en-US": i18n.__("commandInfo.interact"),
    "pt-BR": i18n.__({ locale: "pt_br", phrase: "commandInfo.interact" }),
  },
  name: "interact",
})
@SlashGroup("interact")
export class Interact {
  @Slash({
    description: i18n.__("commandInfo.interactHug"),
    descriptionLocalizations: {
      "en-US": i18n.__("commandInfo.interactHug"),
      "pt-BR": i18n.__({ locale: "pt_br", phrase: "commandInfo.interactHug" }),
    },
    name: "hug",
  })
  public async hug(
    @SlashOption(slashOptions)
    target: GuildMember,
    interaction: CommandInteraction
  ): Promise<Message> {
    await interaction.deferReply();
    const embed = await this._createInteractEmbed({
      interactionName: "hug",
      target: target.user,
      user: interaction.user,
    });
    return interaction.editReply({ embeds: [embed] });
  }

  @Slash({
    description: i18n.__("commandInfo.interactKiss"),
    descriptionLocalizations: {
      "en-US": i18n.__("commandInfo.interactKiss"),
      "pt-BR": i18n.__({ locale: "pt_br", phrase: "commandInfo.interactKiss" }),
    },
    name: "kiss",
  })
  public async kiss(
    @SlashOption(slashOptions)
    target: GuildMember,
    interaction: CommandInteraction
  ): Promise<Message> {
    await interaction.deferReply();
    const embed = await this._createInteractEmbed({
      interactionName: "kiss",
      target: target.user,
      user: interaction.user,
    });
    return interaction.editReply({ embeds: [embed] });
  }

  @Slash({
    description: i18n.__("commandInfo.interactSlap"),
    descriptionLocalizations: {
      "en-US": i18n.__("commandInfo.interactSlap"),
      "pt-BR": i18n.__({ locale: "pt_br", phrase: "commandInfo.interactSlap" }),
    },
    name: "slap",
  })
  public async slap(
    @SlashOption(slashOptions)
    target: GuildMember,
    interaction: CommandInteraction
  ): Promise<Message> {
    await interaction.deferReply();
    const embed = await this._createInteractEmbed({
      interactionName: "slap",
      target: target.user,
      user: interaction.user,
    });
    return interaction.editReply({ embeds: [embed] });
  }

  @Slash({
    description: i18n.__("commandInfo.interactPunch"),
    descriptionLocalizations: {
      "en-US": i18n.__("commandInfo.interactPunch"),
      "pt-BR": i18n.__({ locale: "pt_br", phrase: "commandInfo.interactPunch" }),
    },
    name: "punch"
  })
  public async punch(
    @SlashOption(slashOptions)
    target: GuildMember,
    interaction: CommandInteraction
  ): Promise<Message> {
    await interaction.deferReply();
    const embed = await this._createInteractEmbed({
      interactionName: "punch",
      target: target.user,
      user: interaction.user,
    });
    return interaction.editReply({ embeds: [embed] });
  }

  @Slash({
    description: i18n.__("commandInfo.interactBite"),
    descriptionLocalizations: {
      "en-US": i18n.__("commandInfo.interactBite"),
      "pt-BR": i18n.__({ locale: "pt_br", phrase: "commandInfo.interactBite" }),
    },
    name: "bite",
  })
  public async bite(
    @SlashOption(slashOptions)
    target: GuildMember,
    interaction: CommandInteraction
  ): Promise<Message> {
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
    const locale = (await new UserLocale().get(user.id)) ?? "en";
    const counters = new GifInteractionCounter(user, target);
    const counterString = `${interactionName}Count` as keyof GifInteraction;
    const counter = await counters.increment("target", counterString);
    const counterValue = (counter?.[counterString] ?? 0).toString();
    const embed = new EmbedBuilder();
    const reply = i18n
      .__({ locale, phrase: `feedback.${interactionName}` })
      .replaceAll("{user}", user.username)
      .replaceAll("{target}", target.username)
      .replaceAll("{counter}", counterValue);

    embed.setDescription(reply);
    embed.setImage(Util.randomIndex(interactions[interactionName]));
    embed.setColor("Random");

    return embed;
  }
}
