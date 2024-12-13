import { Interaction, SlashCommandBuilder } from "discord.js";

interface ReplyBase {
  findType: "exact" | "includes" | "regex";
  reply: (targetContent: string) => string;
}

interface ExactReply extends ReplyBase {
  findType: "exact";
  findPattern: string;
}

interface IncludesReply extends ReplyBase {
  findType: "includes";
  findPattern: string;
}

interface RegexReply extends ReplyBase {
  findType: "regex";
  findPattern: RegExp;
}

interface Option {
  name: string;
  description: string;
  type: "STRING" | "INTEGER" | "BOOLEAN" | "USER" | "CHANNEL" | "ROLE";
  required?: boolean;
  choices?: { name: string; value: string | number }[];
  options?: Option[];
}

export interface Command {
  data: SlashCommandBuilder;
  execute: (interaction: Interaction) => void;
  options?: Option[];
}

export type Reply = ExactReply | IncludesReply | RegexReply;

export interface ScheduledTask {
  cronTime: string;
  task: ((now: Date | "manual" | "init") => void) | string;
}
