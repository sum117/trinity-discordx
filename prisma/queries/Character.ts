import type { Char, CharTitle, Post } from "@prisma/client";
import type { Snowflake } from "discord.js";

import { Base } from "./Base";

export class Character extends Base {
  constructor() {
    super();
  }
  public async getOne(
    userId: Snowflake,
    charId: number
  ): Promise<
    | (Char & {
        posts: Post[];
        title: CharTitle | null;
      })
    | null
    | null
  > {
    const char = await this.prisma.char.findFirst({
      include: {
        posts: true,
        title: true,
      },
      where: {
        AND: [
          {
            authorId: userId,
          },
          {
            id: charId,
          },
        ],
      },
    });
    return char;
  }
  public async getAll(userId: Snowflake): Promise<
    (Char & {
      posts: Post[];
      title: CharTitle | null;
    })[]
  > {
    const chars = await this.prisma.char.findMany({
      include: {
        posts: true,
        title: true,
      },
      where: {
        authorId: userId,
      },
    });
    return chars;
  }

  public async createPost(
    userId: Snowflake,
    channelId: Snowflake,
    charId: number,
    guildId: Snowflake,
    messageId: Snowflake,
    contentLength: number
  ): Promise<void> {
    const char = await this.getOne(userId, charId);
    if (char) {
      await this.prisma.post.create({
        data: {
          authorId: userId,
          channelId: channelId,
          charId: char.id,
          guildId: guildId,
          messageId: messageId,
        },
      });
      await this.prisma.char.update({
        data: {
          letters: {
            increment: contentLength,
          },
        },
        where: {
          id: char.id,
        },
      });
    }
  }
}