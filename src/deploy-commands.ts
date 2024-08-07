import { REST, Routes } from 'discord.js';

// commands
import audit from './commands/audit'

const token = 'MTI3MDY3NjUzNjM0NDcwNzA3Mw.G3Ujks.-HyZd8ioE7E6Dr2Z7hYZFcznv1grUYmk-ME9r8';
const clientId = '1270676536344707073';
const guildId = '1270685945095655435';

const rest = new REST().setToken(token);

const run = async () => {
    const commands = [];

    commands.push(audit.data.toJSON());

    try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );
    
		console.log(`Successfully reloaded ${(data as any).length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
}

run();