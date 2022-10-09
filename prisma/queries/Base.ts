import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export class Base {
  protected readonly prisma: PrismaClient;
  public constructor() {
    this.prisma = prisma;
  }
}
