import ts from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';

import toxicityModel from '@tensorflow-models/toxicity';

import Discord from 'discord.js';

const client = new Discord.Client({ intents: 12 });

const discord_token = ''; //Your bot token, https://discord.com/developers/applications
const indice = 0.9; //Sensibility
const messages: Discord.Message[] = []; 
const interval = 5_000; // Batch interval

const model = await toxicityModel.load(indice, []);

client.once('ready', async () => {
    console.log('Logged in');

    setInterval(async () => {
        if(messages.length > 0) {
            const msgs = messages
                .splice(0, messages.length)
                .map(msg => msg.content);

            let results = await model.classify(msgs);
            for (const index of Array.from<number>({ length: results.length })) {
                const result = results.at(index);

                if(result && result.results[0]?.match) {
                    const message = messages.at(index);
                    if (message) {
                        message?.delete();
                    }
                }
            }
        }
    }, interval);
});

client.on('messageCreate', async message => {
    const { author, member, guild } = message;
    const bypass = author.bot || member?.permissions.has('Administrator') || guild?.ownerId == author.id;

    if(bypass) {
        return;
    }

    messages.push(message);
});

client.login(discord_token);