import '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';

import toxicityModel from '@tensorflow-models/toxicity';

import Discord from 'discord.js';

const client = new Discord.Client({ intents: 12 });

const discord_token = '';
const indice = 0.9; //Sensibility
const messages: Discord.Message[] = []; 
const interval = 5_000;

// ECMAScript 2022 (ES13)/ESNext, view tsconfig.json
const model = await toxicityModel.load(indice, ['toxicity']);

client.once('ready', () => {
    console.log('Logged in');

    setInterval(async () => {
        if(messages.length > 0) {
            const msgs = messages
                .splice(0, messages.length)
                .map(msg => msg.content);

            const results = await model.classify(msgs);
            results.forEach(({ results }, index) => {
                if (results.length <= 0) {
                    return;
                }

                const matched = results.filter(({ match }) => match).length > 0;
                const message = messages.at(index);

                if (matched && message) {
                    //Your actions
                     message.delete();
                }
            })
        }
    }, interval);
});

client.on('messageCreate', message => {
    const { author, member, guild } = message;
    const bypass = author.bot || member?.permissions.has('Administrator') || guild?.ownerId == author.id;

    if(bypass) {
        return;
    }

    messages.push(message);
});

client.login(discord_token);
