import { Client, CommandInteraction, EmbedBuilder, inlineCode } from "discord.js";
import { Discord, MetadataStorage, Slash } from "discordx";
import { CommandInfo, HelpEmbed } from "../../types/enums";

@Discord()
export class Utilities {

    @Slash({ name: 'help', description: CommandInfo.Help })
    public help(interaction: CommandInteraction) {
        const getHelpFormat = (commandName: string, commandDescription: string) => `${inlineCode('/' + commandName)}: ${commandDescription}`;
        const commands = MetadataStorage.instance.applicationCommandSlashes.map(command => getHelpFormat(command.name, command.description)).join('\n');
        const helpEmbed = new EmbedBuilder()
            .setTitle(HelpEmbed.Title)
            .setColor(HelpEmbed.Color)
            .setFooter({
                text: HelpEmbed.FooterText
            })
            .setDescription(HelpEmbed.Roleplay + '\n\n' + commands)
            .setThumbnail(interaction.client.user.displayAvatarURL({ size: 512 }))

        interaction.reply({
            embeds: [helpEmbed]
        })

    }
}