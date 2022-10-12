import type { Server as Guild } from "@prisma/client";

import { Base } from "./Base";

export class Server extends Base {
  constructor() {
    super();
  }

  public get(id: string): Promise<Guild | null> {
    return this.prisma.server.findUnique({
      where: {
        id,
      },
    });
  }
  public set(id: string, isOffTopicDeleting: boolean): Promise<Guild> {
    return this.prisma.server.upsert({
      create: {
        id,
        isOffTopicDeleting,
      },
      update: {
        isOffTopicDeleting,
      },
      where: {
        id,
      },
    });
  }
}
