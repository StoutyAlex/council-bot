import { Client, Collection } from "discord.js";

export class CouncilClient extends Client {
    public commands = new Collection<string, any>();
}