import fs from 'node:fs';

const rawData = fs.readFileSync('6in.txt').toString();

const dataArray = Array.from(rawData);

console.log('First start of packet (4):', dataArray.findIndex(
    (_, index) => (new Set(dataArray.slice(index - 4, index))).size === 4)
);

console.log('First start of packet (14):', dataArray.findIndex(
    (_, index) => (new Set(dataArray.slice(index - 14, index))).size === 14)
);

