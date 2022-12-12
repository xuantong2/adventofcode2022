import fs from 'node:fs';

const rawData = fs.readFileSync('10in.txt');

const commands = rawData.toString().split('\n').filter(Boolean);

const registerValues = [1];

commands.forEach(command => {
    registerValues.push(registerValues[registerValues.length - 1]);

    if (command === 'noop') { return; }

    const addValue = parseInt(command.split(' ')[1], 10);

    registerValues.push(registerValues[registerValues.length - 1] + addValue);
});

const strengths = [20, 60, 100, 140, 180, 220].map(lookupIndex => registerValues[lookupIndex - 1] * lookupIndex);

console.log('Signal strength sum:', strengths.reduce((sum, strength) => sum + strength, 0));

const crtOutputs = registerValues.map((v, cycle) => (cycle + 1) % 40 >= v && (cycle + 1) % 40 < (v + 3) ? '#' : '.');

console.log('CRT output:');
crtOutputs.forEach((o, cycle) => process.stdout.write(o + (cycle % 40 === 39 ? '\n' : '')));
