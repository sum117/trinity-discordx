import type { User } from "discord.js";

export interface GifInteractionOptions {
  interactionName: "hug" | "kiss" | "slap" | "punch" | "bite";
  target: User;
  user: User;
}
