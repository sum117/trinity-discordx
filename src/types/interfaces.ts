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

export interface CharProfileQueryOptions {
  AND?: [
    {
      authorId?: string;
    },
    {
      id?: number;
    }
  ];
  id?: number;
}

export interface CharUpdateOptions {
  color?: string;
  description?: string;
  image?: string;
  music?: string;
  name?: string;
  prefix?: string;
  title?: {
    iconURL: string;
    name: string;
  };
}
