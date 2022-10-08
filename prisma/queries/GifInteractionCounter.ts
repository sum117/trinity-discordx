import type { GifInteraction } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import type { User } from "discord.js";

const prisma = new PrismaClient();

export class GifInteractionCounter {
  public constructor(
    private readonly user: User,
    private readonly target: User
  ) {
    this.target = target;
    this.user = user;
  }
  public async get(which: "target" | "user"): Promise<GifInteraction | null> {
    const interaction = await prisma.gifInteraction.findUnique({
      where: {
        userId: this[which].id,
      },
    });
    return interaction;
  }
  public async increment(
    whichUser: "target" | "user",
    value: keyof GifInteraction
  ): Promise<GifInteraction | null> {
    const increment = await prisma.gifInteraction.upsert({
      create: {
        user: {
          connectOrCreate: {
            create: {
              id: this[whichUser].id,
            },
            where: {
              id: this[whichUser].id,
            },
          },
        },
      },
      update: {
        [value]: {
          increment: 1,
        },
      },
      where: {
        userId: this[whichUser].id,
      },
    });
    return increment;
  }
}
