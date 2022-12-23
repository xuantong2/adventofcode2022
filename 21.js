import fs from 'node:fs';

const rawData = fs.readFileSync('21in.txt').toString().split('\n').filter(Boolean);

const monkeys = Object.fromEntries(
    rawData.map(line => ([
        line.split(':')[0],
        isNaN(line.split(':')[1]) ? line.split(':')[1].trim() : parseInt(line.split(':')[1]),
    ]))
);

const getMonkeyValue = name => {
    if (Number.isInteger(monkeys[name])) { return monkeys[name]; }

    const op = monkeys[name].split(' ');
    return eval(`${getMonkeyValue(op[0])} ${op[1]} ${getMonkeyValue(op[2])}`);
};

console.log('Monkey root will yell', getMonkeyValue('root'));

const compareMonkeyKey1 = monkeys.root.substring(0, 4);
const compareMonkeyKey2 = monkeys.root.substring(7, 11);

const findRoot = (fn, initialGuess) => {
    let guess = initialGuess;

    while (fn(guess) !== 0) {
        const gradient = fn(guess + 1) - fn(guess);
        guess -= Math.round(fn(guess) / gradient);
    }

    return guess;
}

console.log(
    'Number to pass equality test:',
    findRoot(
        guess => {
            monkeys.humn = guess;
            return getMonkeyValue(compareMonkeyKey1) - getMonkeyValue(compareMonkeyKey2);
        },
        monkeys.humn,
    )
);
