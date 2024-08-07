import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { joinVoiceChannel } from '@discordjs/voice';
import { AudioTracker } from "../models/audio-tracker";


const command = {
    data: new SlashCommandBuilder()
        .setName('audit')
        .setDescription('Audit the server'),
    async execute(interaction: ChatInputCommandInteraction) {
        const voiceChannel = interaction.guild?.channels.cache.find(channel => {
            if (!channel.isVoiceBased()) return false;
        
            const inChannel = channel.members.get(interaction.user.id);
            if (inChannel) return channel;
        })

        if (!voiceChannel) {
            await interaction.reply('You are not in a voice channel');
            return;
        }

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });

        connection.receiver.speaking.on('start', async (userId) => {
            const member = voiceChannel.guild.members.cache.get(userId);
            if (!member) return;
    
            await AudioTracker.getInstance().trackUserStart(member);
        })

        connection.receiver.speaking.on('end', async (userId) => {
            const member = voiceChannel.guild.members.cache.get(userId);
            if (!member) return;
    
            await AudioTracker.getInstance().trackUserEnd(member);
        })
    }
}

export default command;
