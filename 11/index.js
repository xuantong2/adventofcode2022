import fs from 'node:fs';

const rawData = fs.readFileSync(new URL('./input.txt', import.meta.url).pathname).toString().split('\n').filter(Boolean);

const monkeys = [];

while (rawData.length > 0) {
    const index = monkeys.length;
    rawData.shift();
    monkeys[index] = {};
    monkeys[index].items = rawData.shift().split(':')[1].split(', ').map(i => parseInt(i));
    monkeys[index].op = rawData.shift().split('= old')[1].trim();
    monkeys[index].testQ = parseInt(rawData.shift().split(' ').pop());
    monkeys[index].trueNext = parseInt(rawData.shift().split(' ').pop());
    monkeys[index].falseNext = parseInt(rawData.shift().split(' ').pop());
    monkeys[index].inspectCount = 0;
}

const initState = JSON.stringify(monkeys);

const qProduct = monkeys.reduce((product, monkey) => product * monkey.testQ, 1);

const makeMonkeysThrow = (monkeys, iterations, reduceFn) => {
    (new Array(iterations).fill(0)).forEach(() => {
        monkeys.forEach((monkey) => {
            const items = monkey.items.map(i => i
                * (monkey.op.includes('*')
                    ? (monkey.op.includes('old') ? i : parseInt(monkey.op.split(' ')[1]))
                    : 1)
                + (monkey.op.includes('+')
                    ? (monkey.op.includes('old') ? i : parseInt(monkey.op.split(' ')[1]))
                    : 0)
            ).map(reduceFn);

            monkeys[monkey.trueNext].items = [...monkeys[monkey.trueNext].items, ...items.filter(i => i % monkey.testQ === 0)]
            monkeys[monkey.falseNext].items = [...monkeys[monkey.falseNext].items, ...items.filter(i => i % monkey.testQ !== 0)]

            monkey.inspectCount += monkey.items.length;
            monkey.items = [];
        });
    });
};

const part1Monkeys = JSON.parse(initState);
makeMonkeysThrow(part1Monkeys, 20, n => Math.floor(n / 3));

const part1SortedMonkeyBusiness = part1Monkeys.map(m => m.inspectCount).sort((a, b) => Math.sign(b - a));
console.log('Part 1', part1SortedMonkeyBusiness[0] * part1SortedMonkeyBusiness[1]);


const part2Monkeys = JSON.parse(initState);
makeMonkeysThrow(part2Monkeys, 10000, n => n % qProduct);

const part2SortedMonkeyBusiness = part2Monkeys.map(m => m.inspectCount).sort((a, b) => Math.sign(b - a));
console.log('Part 2', part2SortedMonkeyBusiness[0] * part2SortedMonkeyBusiness[1]);
