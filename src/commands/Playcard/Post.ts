import type { Message } from "discord.js";
import { AttachmentBuilder } from "discord.js";
import type { ArgsOf } from "discordx";
import { Discord, On } from "discordx";

import { Character } from "../../../prisma/queries/Character";
import { CharEmbedBuilder } from "../../components/CharEmbed";
import { ErrorMessage } from "../../types/enums";
import type { MultiPostMessageOptions } from "../../types/interfaces";
import { Util } from "../../util/Util";

@Discord()
export class Playcard {
  @On({ event: "messageCreate" })
  public async post([
    message,
  ]: ArgsOf<"messageCreate">): Promise<Message<boolean> | void> {
    // Handle attachments
    const attachments =
      message.attachments.size > 0
        ? message.attachments.map((attachment, index) => {
          const extension = attachment.name?.split(".").pop();
          const attachmentName = `image_${index}.${extension ?? "png"}`;
          return new AttachmentBuilder(attachment.attachment).setName(
            attachmentName
          );
        })
        : undefined;

    const characters = new Character();
    const charDatabase = await characters.getAll(message.author.id);
    const charPrefixes = charDatabase.map((char) => char.prefix + ":");
    const splitRegex = new RegExp(charPrefixes.join("|"), "g");
    const charActions = message.content.split(splitRegex).slice(1);
    const charMatches = message.content.match(splitRegex);

    if (charMatches) {
      // Iterate through each match
      const replies = charMatches.map((charMatch, index) => {
        const charAction = charActions[index];
        const attachment = attachments?.at(index);
        const reply = {} as MultiPostMessageOptions;

        if (charAction?.length < 1) {
          return;
        }
        const character = charDatabase.find(
          (char) => char.prefix === charMatch.slice(0, -1)
        );

        // Build the reply
        if (character) {
          const charEmbed = new CharEmbedBuilder(message.author, character);
          if (attachment) {
            reply.files = [attachment];
            charEmbed.setImage(`attachment://${attachment.name}`);
          }
          reply.embeds = [charEmbed.post(charAction)];
          reply.characterId = character.id;
          reply.index = index;

          return reply;
        }
      });
      // Send in order of matches by index
      const sorted = replies.sort((a, b) => {
        if (a?.index && b?.index) {
          return a?.index - b?.index;
        }
        return 0;
      });
      sorted.forEach(async (reply, index) => {
        // Delay each message by 200ms to prevent weird Discord behavior
        await Util.delay(index * 200);
        if (reply) {
          const sentMessage = await message.channel.send(reply);
          if (sentMessage.inGuild()) {
            await characters.createPost(
              message.author.id,
              sentMessage.channelId,
              reply.characterId,
              sentMessage.guildId,
              sentMessage.id,
              sentMessage.content.length
            );
          }
          // Delete the original message when the replies are sent.
          if (index === replies.length - 1) {
            await message.delete().catch(() => {
              return console.log(ErrorMessage.UnknownMessage);
            });
          }
        }
      });
    }
  }
}
