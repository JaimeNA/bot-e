import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { getVoiceConnection } from '@discordjs/voice';

export const data = new SlashCommandBuilder()
  .setName("stop")
  .setDescription("Stop the current audio player.");

export async function execute(interaction: CommandInteraction) {
    const voiceChannel = interaction.member?.voice.channel;
    if (!voiceChannel) return interaction.channel.send('You need to be in a voice channel to stop the music!');
    
    const connection = getVoiceConnection(voiceChannel.guild.id)
    connection.destroy();
    
    return interaction.reply('Music stopped.');
}

