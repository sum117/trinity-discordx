import type { Char, CharTitle, Post } from "@prisma/client";
import type { ColorResolvable, User } from "discord.js";
import { EmbedBuilder } from "discord.js";

import { i18n } from "../util/i18n";

export class CharEmbedBuilder extends EmbedBuilder {
  public constructor(
    public readonly owner: User,
    public readonly char: Char & { posts: Post[]; title: CharTitle | null }
  ) {
    super();

    this.setTitle(char.name);
    this.setThumbnail(char?.image);
    if (char.color) {
      this.setColor(char.color as ColorResolvable);
    }
    this.setFooter({
      iconURL: owner.displayAvatarURL({ size: 128 }),
      text: owner.username + " | ID: #" + char.id,
    });
    this.setURL(char.music ?? null);
    this.setTimestamp(Date.now());
  }

  private _getTime(locale = "en") {
    // Time in days
    const formatter = new Intl.RelativeTimeFormat(locale);
    return formatter.format(
      Math.floor(
        (Date.now() - this.char.createdAt.getTime()) / 1000 / 60 / 60 / 24
      ),
      "days"
    );
  }
  public post(post: string): this {
    this.setDescription(post);
    if (this.char?.title?.name && this.char?.title?.iconURL) {
      this.setAuthor({
        iconURL: this.char.title.iconURL,
        name: this.char.title.name,
      });
    }
    return this;
  }
  public profile(locale = "en"): this {
    if (this.char?.title?.name && this.char?.title?.iconURL) {
      this.setAuthor({
        iconURL: this.char.title.iconURL,
        name: this.char.title.name,
      });
    }
    this.setThumbnail(null);
    this.setTitle(null);
    this.setURL(null);
    this.setImage(this.char.image);

    this.addFields([
      { inline: true, name: "ID", value: "#" + this.char.id },
      {
        inline: true,
        name: i18n.__({ locale, phrase: "charEmbedField.name"}),
        value: this.char.name,
      },
      {
        inline: true,
        name: i18n.__({locale, phrase: "charEmbedField.posts"}),
        value: this.char.posts.length.toString(),
      },
      {
        inline: true,
        name: i18n.__({locale, phrase: "charEmbedField.letterCount"}),
        value: this.char.letters.toString(),
      },
      {
        inline: true,
        name: i18n.__({locale, phrase: "charEmbedField.createdAt"}),
        value: this._getTime(locale),
      },
      {
        inline: true,
        name: i18n.__({locale, phrase: "charEmbedField.likes"}),
        value: JSON.parse(this.char.likes)?.length?.toString() ?? "0",
      },
    ]);
    if (this.char.music) {
      this.addFields({
        name: i18n.__({locale, phrase: "charEmbedField.music"}),
        value: this.char.music,
      });
    }
    if (this.char.description) {
      this.setDescription(this.char.description);
    }
    return this;
  }
}
