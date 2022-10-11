import type { Snowflake } from "discord.js";

import { Base } from "./Base";

export class UserLocale extends Base {
  constructor() {
    super();
  }
  public async get(id: Snowflake): Promise<string> {
    const user = await this.prisma.user.findUnique({
      select: { locale: true },
      where: { id },
    });
    return user?.locale ?? "en";
  }
  public async set(id: Snowflake, locale: string): Promise<void> {
    await this.prisma.user.update({ data: { locale }, where: { id } });
  }
}
