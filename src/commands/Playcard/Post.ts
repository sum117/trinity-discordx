import type { Message } from "discord.js";
import { AttachmentBuilder } from "discord.js";
import type { ArgsOf } from "discordx";
import { Discord, On } from "discordx";

import { Character, UserLocale } from "../../../prisma/queries";
import { CharEmbedBuilder } from "../../components/CharEmbed";
import type { MultiPostMessageOptions } from "../../types/interfaces";
import { i18n } from "../../util/i18n";
import { Util } from "../../util/Util";

@Discord()
export class Playcard {
  @On({ event: "messageCreate" })
  public async post([
    message,
  ]: ArgsOf<"messageCreate">): Promise<Message | void> {
    // Handle attachments
    const attachments =
      message.attachments.size > 0
        ? message.attachments.map((attachment, index) => {
            const extension: string = attachment.name?.split(".").pop() ?? "";
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
      sorted.map(async (reply, index) => {
        // Delay each message by 200ms to prevent weird Discord behavior
        await Util.delay(index * 200);
        if (reply) {
          const sentMessage = await message.channel.send(reply);
          const embedDescLength =
            sentMessage.embeds[0].description?.length ?? 0;
          if (sentMessage.inGuild()) {
            await characters.createPost(
              message.author.id,
              sentMessage.channelId,
              reply.characterId,
              sentMessage.guildId,
              sentMessage.id,
              embedDescLength
            );
          }
          // Delete the original message when the replies are sent.
          if (index === replies.length - 1) {

            await message.delete().catch(async() => {
              const locale = await new UserLocale().get(message.author.id);
              return console.log(i18n.__({locale, phrase:"errorMessage.unknownMessage"}));
            });
          }
        }
      });
    }
  }
}
