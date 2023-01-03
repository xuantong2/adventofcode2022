import fs from 'node:fs';

const rawData = fs.readFileSync('1in.txt').toString().trim().split('\n');

const caloriesList = rawData.map(c => c === '' ? c : parseInt(c) );

const calorieSums = [0];

caloriesList.forEach(c => c === '' ? calorieSums.unshift(0) : calorieSums[0] += c);

calorieSums.sort((a, b) => b - a);

console.log('Top calories:', calorieSums[0]);
console.log('Top 3 calories sum:', calorieSums[0] + calorieSums[1] + calorieSums[2]);
