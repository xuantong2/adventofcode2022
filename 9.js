import fs from 'node:fs';

const rawData = fs.readFileSync('9in.txt');

const commands = rawData
    .toString()
    .split('\n')
    .filter(Boolean)
    .map(command => command.split(' '))
    .map(([dir, amount]) => ({ dir, amount: parseInt(amount, 10)}));

const stepCommands = commands.reduce((sc, command) => {
    return [...sc, ...(new Array(command.amount).fill(command.dir))];
}, []);

// knot[0] = HEAD
// knot[n:1-9] = TAILS[n]
const knots = (new Array(10)).fill(0).map(() => ([[0, 0]]));

stepCommands.forEach((dir, i) => {
    knots[0].push([
        knots[0][i][0] + (dir === 'U' ? 1 : 0) + (dir === 'D' ? -1 : 0),
        knots[0][i][1] + (dir === 'R' ? 1 : 0) + (dir === 'L' ? -1 : 0),
    ]);
});

knots.slice(0, 9).forEach((knot, knotIndex) => {
    knot.forEach((coords, i) => {
        if (i === 0) { return; }

        const nextTailY_prev = knots[knotIndex + 1][i - 1][0];
        const nextTailX_prev = knots[knotIndex + 1][i - 1][1];
        const deltaY = coords[0] - nextTailY_prev;
        const deltaX = coords[1] - nextTailX_prev;

        if (Math.abs(deltaX) < 2 && Math.abs(deltaY) < 2) {
            knots[knotIndex + 1].push([nextTailY_prev, nextTailX_prev]);
            return;
        }

        knots[knotIndex + 1].push([
            nextTailY_prev + deltaY / (Math.abs(deltaY) || 1),
            nextTailX_prev + deltaX / (Math.abs(deltaX) || 1),
        ]);
    });
});

const unique1 = new Set(knots[1].map(coords => coords[0] + ',' + coords[1]));
const unique9 = new Set(knots[9].map(coords => coords[0] + ',' + coords[1]));

console.log('Unique coords for knot 1:', unique1.size);
console.log('Unique coords for knot 9:', unique9.size);
