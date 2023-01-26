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
  music?: string | null;
  name?: string;
  prefix?: string;
  title?: {
    iconURL: string;
    name: string;
  } | null;
}

export interface CharListOptions {
  id: number;
  isMostUsed?: boolean;
  letterCount: number;
  likeCount: number;
  name: string;
  postCount: number;
  prefix: string;
}

export interface UserProfileProps {
  avatar: string;
  characters: number;
  letters: number;
  likes: number;
  name: string;
  posts: number;
}
