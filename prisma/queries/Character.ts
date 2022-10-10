import type { Char, CharTitle, Post } from "@prisma/client";
import type { Snowflake } from "discord.js";

import type {
  CharProfileQueryOptions,
  CharUpdateOptions,
} from "../../src/types/interfaces";
import { Base } from "./Base";

export class Character extends Base {
  constructor() {
    super();
  }

  public async createChar(
    userId: Snowflake,
    name: string,
    prefix: string,
    image: string,
    description?: string,
    color?: string
  ): Promise<Char> {
    const author = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!author) {
      await this.prisma.user.create({
        data: {
          id: userId,
        },
      });
    }
    const char = await this.prisma.char.create({
      data: {
        authorId: userId,
        color: color,
        description: description,
        image: image,
        name: name,
        prefix: prefix,
      },
    });
    return char;
  }
  public async deleteChar(userId: Snowflake, charId: number): Promise<void> {
    const char = await this.getOne(userId, charId);
    const posts = await this.prisma.post.findMany({
      where: {
        charId: charId,
      },
    });
    const title = await this.prisma.charTitle.findFirst({
      where: {
        charId: charId,
      },
    });
    if (char) {
      if (posts) {
        await this.prisma.post.deleteMany({
          where: {
            charId: charId,
          },
        });
      }
      if (title) {
        await this.prisma.charTitle.delete({
          where: {
            charId: charId,
          },
        });
      }
      await this.prisma.char.delete({
        where: {
          id: charId,
        },
      });
    }
  }
  public async getOne(
    userId: Snowflake,
    charId: number,
    ownerProtection = true
  ): Promise<
    | (Char & {
        posts: Post[];
        title: CharTitle | null;
      })
    | null
    | null
  > {
    let where: CharProfileQueryOptions = {
      id: charId,
    };
    if (ownerProtection) {
      where = {
        AND: [
          {
            authorId: userId,
          },
          {
            id: charId,
          },
        ],
      };
    }
    const char = await this.prisma.char.findFirst({
      include: {
        posts: true,
        title: true,
      },
      where: where,
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
  public async addLike(
    targetCharId: number,
    userId: Snowflake
  ): Promise<
    | (Char & {
        posts: Post[];
        title: CharTitle | null;
      })
    | void
  > {
    const currentLikes = await this.prisma.char.findFirst({
      select: {
        likes: true,
      },
      where: {
        id: targetCharId,
      },
    });
    if (!currentLikes) {
      return;
    }
    const parsedLikes: Array<string> = JSON.parse(currentLikes?.likes);
    if (parsedLikes.includes(userId)) {
      return;
    }
    parsedLikes.push(userId);
    const updatedChar = await this.prisma.char.update({
      data: {
        likes: JSON.stringify(parsedLikes),
      },
      include: {
        posts: true,
        title: true,
      },
      where: {
        id: targetCharId,
      },
    });
    return updatedChar;
  }
  public async createPost(
    userId: Snowflake,
    channelId: Snowflake,
    charId: number,
    guildId: Snowflake,
    messageId: Snowflake,
    contentLength: number
  ): Promise<void> {
    await this.prisma.post.create({
      data: {
        authorId: userId,
        channelId: channelId,
        charId: charId,
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
        id: charId,
      },
    });
  }
  public async getPost(messageId: Snowflake): Promise<Post | null> {
    const post = await this.prisma.post.findFirst({
      where: {
        messageId: messageId,
      },
    });
    return post;
  }

  public async deletePost(messageId: Snowflake): Promise<void> {
    const post = await this.getPost(messageId);
    if (post) {
      await this.prisma.post.delete({
        where: {
          messageId: messageId,
        },
      });
    }
  }
  public async updateChar(
    userId: Snowflake,
    charId: number,
    options: CharUpdateOptions
  ): Promise<
    | (Char & {
        posts: Post[];
        title: CharTitle | null;
      })
    | void
  > {
    const char = await this.getOne(userId, charId);
    if (char) {
      if (options.title?.name && options.title?.iconURL) {
        await this.prisma.charTitle.upsert({
          create: {
            charId: charId,
            iconURL: options.title.iconURL,
            name: options.title.name,
          },
          update: {
            iconURL: options.title.iconURL,
            name: options.title.name,
          },
          where: {
            charId: charId,
          },
        });
        delete options.title;
      }
      const updatedChar = await this.prisma.char.update({
        data: {
          color: options.color,
          description: options.description,
          image: options.image,
          music: options.music,
          name: options.name,
          prefix: options.prefix,
        },
        include: {
          posts: true,
          title: true,
        },
        where: {
          id: charId,
        },
      });
      return updatedChar;
    }
  }
}
