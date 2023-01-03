import fs from 'node:fs';

const rawData = fs.readFileSync('5in.txt').toString().trimEnd().split('\n');

const stacksData = rawData.splice(0, rawData.indexOf('') - 1);
const moves = rawData.slice(2).map(line => {
    const lineParts = line.split(' ');

    return [1, 3, 5].map(i => parseInt(lineParts[i]));
});

const stackSlices = stacksData.reverse().map(row => Array.from(row).filter((_, i) => i % 4 === 1));
const originalStacks = stackSlices[0].map((_, i) => stackSlices.map((r) => r[i])).map(s => s.filter(c => c && c !== ' '))

let stacks = JSON.parse(JSON.stringify(originalStacks));

moves.forEach(([amount, from, to]) => {
    stacks[to - 1].push(...stacks[from - 1].splice(stacks[from - 1].length - amount).reverse());
});

console.log('Top of stack with Cratemover 9000:', stacks.map(s => s.pop()).join(''));

stacks = JSON.parse(JSON.stringify(originalStacks));

moves.forEach(([amount, from, to]) => {
    stacks[to - 1].push(...stacks[from - 1].splice(stacks[from - 1].length - amount));
});

console.log('Top of stack with Cratemover 9001:', stacks.map(s => s.pop()).join(''));
