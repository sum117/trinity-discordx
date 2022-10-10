import type { Char, CharTitle, Post } from "@prisma/client";
import type { ColorResolvable, User } from "discord.js";
import { EmbedBuilder } from "discord.js";

import { CharEmbedField } from "../types/enums";

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
      text: owner.username + "| ID: #" + char.id,
    });
    this.setURL(char.music ?? null);
    this.setTimestamp(Date.now());
  }

  private _getTime() {
    // Time in days
    const formatter = new Intl.RelativeTimeFormat("pt-br");
    const time = formatter.format(
      Math.floor(
        (Date.now() - this.char.createdAt.getTime()) / 1000 / 60 / 60 / 24
      ),
      "days"
    );
    return time;
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
  public profile(): this {
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
      { inline: true, name: CharEmbedField.Name, value: this.char.name },
      {
        inline: true,
        name: CharEmbedField.Posts,
        value: this.char.posts.length.toString(),
      },
      {
        inline: true,
        name: CharEmbedField.LetterCount,
        value: this.char.letters.toString(),
      },
      { inline: true, name: CharEmbedField.CreatedAt, value: this._getTime() },
      {
        inline: true,
        name: CharEmbedField.Likes,
        value: this.char.likes.toString(),
      },
    ]);
    if (this.char.music) {
      this.addFields({ name: CharEmbedField.Music, value: this.char.music });
    }
    if (this.char.description) {
      this.setDescription(this.char.description);
    }
    return this;
  }
}
