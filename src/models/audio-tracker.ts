import { GuildMember } from "discord.js";
import * as fs from 'fs';

interface Yap {
    start: number;
    end?: number;
    duration?: number;
}

export class AudioTracker {
  private static instance: AudioTracker;

  private yapCollection = new Map<string, Yap[]>();

  private constructor() {}

  public static getInstance(): AudioTracker {
    if (!AudioTracker.instance) {
      AudioTracker.instance = new AudioTracker();
    }
    return AudioTracker.instance;
  }

  private updateFile = () => {
    fs.writeFileSync('yap.json', JSON.stringify(Array.from(this.yapCollection.entries()), null, 2));
  }

  public trackUserStart(member: GuildMember) {                                                                                
    const time = Date.now();

    const yapCounter = this.yapCollection.get(member.user.displayName) || [];
    yapCounter.push({ start: time });
    this.yapCollection.set(member.user.displayName, yapCounter);

    console.log('start', member.user.displayName);
  }

  public trackUserEnd(member: GuildMember) {
    const time = Date.now();

    const yapCounter = this.yapCollection.get(member.user.displayName);
    if (!yapCounter) return;

    const lastYap = yapCounter[yapCounter.length - 1];

    lastYap.end = time;
    lastYap.duration = lastYap.end - lastYap.start;

    console.log('end', member.user.displayName, lastYap.duration);
    this.updateFile();
  }
}