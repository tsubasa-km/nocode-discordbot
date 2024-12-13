import { Client, Events, GatewayIntentBits, Collection } from "discord.js";
import { Command, Reply, ScheduledTask } from "./types";
import { schedule } from "node-cron";

class DiscordBotBuilder {
  private client: Client;
  private token: string;
  private commands: Collection<string, Command> = new Collection();
  private replies: Collection<string | RegExp, Reply> = new Collection();
  private scheduledTasks: ScheduledTask[] = [];

  constructor(token: string) {
    this.token = token;
    this.client = new Client({ intents: [GatewayIntentBits.Guilds] });
  }

  /**
   * Compile the bot and add the event listeners
   */
  compile() {
    this.client.once(Events.ClientReady, (client) => {
      console.log(`Ready! Logged in as ${client.user.tag}`);
    });
    this.client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isCommand()) return;
      const command = this.commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    });
    this.client.on(Events.MessageCreate, async (message) => {
      const reply = this.replies.find((reply) => {
        switch (reply.findType) {
          case "exact":
            return message.content === reply.findPattern;
          case "includes":
            return message.content.includes(reply.findPattern);
          case "regex":
            return reply.findPattern.test(message.content);
        }
      });
      if (reply) {
        message.reply(reply.reply(message.content));
      }
    });
  }
  /**
   * Run the bot
   */
  run() {
    this.client.login(this.token);
    this.scheduledTasks.forEach((task) => {
      schedule(task.cronTime, task.task);
    });
  }
  addSlashCommand(command: Command) {
    this.commands.set(command.data.name, command);
  }
  addReply(reply: Reply) {
    this.replies.set(reply.findPattern, reply);
  }
  addScheduledTask(task: ScheduledTask) {
    this.scheduledTasks.push(task);
  }
}

export default DiscordBotBuilder;
