import type { BaseMessageOptions, User } from "discord.js";

export interface GifInteractionOptions {
  interactionName: "hug" | "kiss" | "slap" | "punch" | "bite";
  target: User;
  user: User;
}

export interface MultiPostMessageOptions extends BaseMessageOptions {
  characterId: number;
  index: number;
}