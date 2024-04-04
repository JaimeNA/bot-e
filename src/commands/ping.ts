import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with something");

export async function execute(interaction: CommandInteraction) {
  return interaction.reply("Oi mate, let's go to cashies.");
}

