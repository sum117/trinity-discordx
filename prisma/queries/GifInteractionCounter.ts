import type { GifInteraction } from "@prisma/client";
import type { User } from "discord.js";

import { Base } from "./Base";

export class GifInteractionCounter extends Base {
  public constructor(
    private readonly user: User,
    private readonly target: User
  ) {
    super();
    this.target = target;
    this.user = user;
  }
  public get(which: "target" | "user"): Promise<GifInteraction | null> {
    return this.prisma.gifInteraction.findUnique({
      where: {
        userId: this[which].id,
      },
    });
  }
  public increment(
    whichUser: "target" | "user",
    value: keyof GifInteraction
  ): Promise<GifInteraction | null> {
    return this.prisma.gifInteraction.upsert({
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
        [value]: 1,
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
  }
}
