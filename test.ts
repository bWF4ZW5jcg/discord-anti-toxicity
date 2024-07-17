import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import ts from '@tensorflow/tfjs';
import toxicityModel from '@tensorflow-models/toxicity';

//labels: 'toxicity', 'sexual_explicit', 'threat', 'severe_toxicity', 'obscene', 'insult', 'identity_attack'
const indice = 0.9;
const model = await toxicityModel.load(indice, ['toxicity', 'insult']);

const messages = [
    "bitch",
    "bitch-ass",
    "bitch boy",
    "hello",
    "Shup up"
];

const results = await model.classify(messages);

results.forEach(({ label, results}) => {
    printLn(label);
    results.forEach(({ match }, index) => {
        printLn(`${messages[index]}: ${match}`);
    });
    printLn();
});


function printLn(message?: string) {
    console.log(message || '' + '\n');
}