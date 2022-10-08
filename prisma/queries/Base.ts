import { PrismaClient } from "@prisma/client";

export class Base {
  protected readonly prisma: PrismaClient;
  public constructor() {
    this.prisma = new PrismaClient();
  }
}
