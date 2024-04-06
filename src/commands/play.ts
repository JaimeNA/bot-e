import { Client, CommandInteraction, SlashCommandBuilder, VoiceChannel, TextChannel, VoiceStates, GuildMember, VoiceConnection } from "discord.js";

import ytdl from 'ytdl-core';

import { joinVoiceChannel, VoiceConnectionStatus, getVoiceConnection } from '@discordjs/voice';
import { createAudioResource, createAudioPlayer, StreamType,NoSubscriberBehavior, AudioPlayerStatus } from '@discordjs/voice';

const member = new GuildMember({
  intents: ["VoiceStates"]
});

export const data = new SlashCommandBuilder()
  .setName("play")
  .addChannelOption(option =>
        option.setName("channel")
            .setDescription('The channel where the music will be played')
            .setRequired(true))
  .addStringOption(option =>
        option.setName("url")
            .setDescription('Youtube URL')
            .setRequired(true))
  .setDescription("Plays requested audio on the active voice channel");

export async function execute(interaction: CommandInteraction, client: client) {

  const voiceChannel = interaction.options.getChannel("channel"); 

  // EXPERIMENTAL
  //


// Split the string into an array of arguments based on whitespace
const url = interaction.options.getString("url");
console.log(url);
        if (!voiceChannel) return interaction.reply('You need to be in a voice channel to play music!');
        
        // const connection = await voiceChannel.join();
        

        if (!url) return interaction.channel.send('Please provide a valid YouTube URL.');

        try {
            const stream = ytdl(url, { filter: 'audioonly', quality: 'highestaudio' });


// Create an audio resource from the stream
    const resource = createAudioResource(stream);

    // Create an audio player
    const player = createAudioPlayer();

        joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: voiceChannel.guild.id,
          adapterCreator: voiceChannel.guild.voiceAdapterCreator,
          selfDeaf: false
  });

    const connection = getVoiceConnection(voiceChannel.guild.id);

    // Subscribe the connection to the player
    // Play the audio resource
    player.play(resource);

    connection.subscribe(player);


    connection.on("stateChange", (oldState, newState) => {
      if (
          oldState.status === VoiceConnectionStatus.Ready &&
          newState.status === VoiceConnectionStatus.Connecting
      ) {
          connection.configureNetworking();
      }
    });


    connection.on('stateChange', (oldState, newState) => {
	console.log(`Connection transitioned from ${oldState.status} to ${newState.status}`);
});

player.on('stateChange', (oldState, newState) => {
	console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
});

    player.on(AudioPlayerStatus.Idle, () => {
        console.log('Audio player is idle');
        connection.destroy(); // Optionally disconnect from the voice channel when the player is idle
    });

    // Listen for errors on the player
    player.on('error', (error) => {
        console.error('Audio player error:', error);
    });

            resource.playStream.on('finish', () => {
                voiceChannel.leave();
            });

            resource.playStream.on('error', (err) => {
                console.error(err);
            });

            interaction.channel.send('Now playing: ' + url);
        } catch (error) {
            console.error(error);
            interaction.channel.send('An error occurred while trying to play music.');
        }

  return interaction.reply("WHAT!?");
}

