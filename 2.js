import fs from 'node:fs';

const rawData = fs.readFileSync('2in.txt').toString().trim().split('\n');

const codeA = 'A'.charCodeAt();
const codeX = 'X'.charCodeAt();
const charCodeDelta = codeX - codeA;

const guide = rawData.map(r => r.split(' '));

const part1Scores = guide.map(([opponent, me]) =>
    ((me.charCodeAt() - opponent.charCodeAt() - charCodeDelta + 4) % 3) * 3
        + me.charCodeAt() - codeX + 1
);

const part1ScoreSum = part1Scores.reduce((sum, s) => sum + s, 0);

console.log('Part 1 score sum:', part1ScoreSum);

const part2Scores = guide.map(([opponent, result]) =>
    (result.charCodeAt() - codeX) * 3
        + (opponent.charCodeAt() - codeA + result.charCodeAt() - codeX + 2) % 3 + 1
);

const part2ScoreSum = part2Scores.reduce((sum, s) => sum + s, 0);

console.log('Part 2 score sum:', part2ScoreSum);
