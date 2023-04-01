import type { Message, TextChannel } from "discord.js";
import { AttachmentBuilder, EmbedBuilder } from "discord.js";
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
    const locale = await new UserLocale().get(message.author.id);
    // Handle attachments
    const attachments =
      message.attachments.size > 0
        ? message.attachments.map((attachment, index) => {
            const extension: string = attachment.name?.split(".").pop() ?? "";
            const attachmentName = `image_${index}.${extension ?? "png"}`;
            return new AttachmentBuilder(attachment.url).setName(
              attachmentName
            );
          })
        : undefined;

    const characters = new Character();
    const charDatabase = await characters.getAll(message.author.id);
    const charPrefixes = charDatabase.map(
      (char) => Util.escapeRegExp(char.prefix) + ":"
    );
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
      // If there's only one character, try to use the dynamic edit feature
      if (replies.length === 1) {
        const replyEmbed = replies[0]?.embeds?.[0] as CharEmbedBuilder;
        const editedMessages = await this.dynamicEdit(
          message.channel as TextChannel,
          message,
          replyEmbed?.data.description ?? ""
        );
        if (editedMessages.length > 0) {
          const unknownMessageError = i18n.__({
            locale,
            phrase: "errorMessage.unknownMessage",
          });
          const feedback = await message.reply(
            i18n.__({
              locale,
              phrase: "feedback.messageDiffEdit",
            })
          );
          setTimeout(() => {
            message.delete().catch(() => console.log(unknownMessageError));
            feedback.delete().catch(() => console.log(unknownMessageError));
          }, 2500);
          return;
        }
      }
      // if there's more than one character, send in order of matches by index - This feature is still in development, but is available for testing. It is not recommended to use it with attachments as it may cause issues with the posts
      const sortedReplies = replies.sort((a, b) => {
        if (a?.index && b?.index) {
          return a?.index - b?.index;
        }
        return 0;
      });
      sortedReplies.map(async (reply, index) => {
        // Delay each message by 400ms to prevent weird Discord behavior
        await Util.delay(index * 400);
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
          // Delete the original message when the replies are sent
          if (index === replies.length - 1) {
            await message.delete().catch(() => {
              return console.log(
                i18n.__({ locale, phrase: "errorMessage.unknownMessage" })
              );
            });
          }
        }
      });
    }
  }
  private async dynamicEdit(
    channel: TextChannel,
    message: Message,
    newContent: string
  ) {
    newContent = newContent.trim();
    // if the message contains only one character, compare its content to the last ten messages. If the content is 80% similar, edit the last message of the corresponding character's post instead of creating a new one

    // Initialize database class
    const characters = new Character();

    // Get user's locale

    // Get the last ten messages and their authors
    const oldMessages = await channel.messages.fetch({ limit: 10 });
    const handledMessages = oldMessages.map(async (oldMessage) => {
      const messageRef = await characters.getPost(oldMessage.id);
      const isPostAuthor = messageRef?.authorId === message.author.id;
      if (messageRef && isPostAuthor) {
        const embedDescription = oldMessage.embeds[0]?.description ?? "";
        const diffPercentage = Util.diffPercentage(
          newContent,
          embedDescription
        );
        if (diffPercentage > 80) {
          const newEmbed = EmbedBuilder.from(oldMessage.embeds[0]);
          newEmbed.setDescription(newContent);
          const reply = Util.handleAttachment(newEmbed);
          await oldMessage.edit(reply);
          return true;
        }
        return false;
      }
      return false;
    });
    const processedMessages = await Promise.all(handledMessages);
    if (processedMessages.length === 0) {
      return [false];
    }
    return processedMessages.filter(Boolean);
  }
}
