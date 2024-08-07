// Require the necessary discord.js classes
import { Client, Collection, CommandInteraction, Events, GatewayIntentBits, IntentsBitField } from 'discord.js';
import { CouncilClient } from './models/council-client';

// Commands
import audit from './commands/audit';

const token = 'MTI3MDY3NjUzNjM0NDcwNzA3Mw.G3Ujks.-HyZd8ioE7E6Dr2Z7hYZFcznv1grUYmk-ME9r8';

const client = new CouncilClient({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);

    client.commands.set(audit.data.name, audit);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

    const client = interaction.client as CouncilClient;
	const command = client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.login(token);
