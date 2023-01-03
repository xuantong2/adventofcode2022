import fs from 'node:fs';

const rawData = fs.readFileSync('24in.txt').toString().split('\n').filter(Boolean);

const initMap = rawData.map(row => row.split(''))

const blizzards = [];

const blizzardMoves = {
    '>': [0, 1],
    '<': [0, -1],
    '^': [-1, 0],
    'v': [1, 0],
};

initMap.forEach((row, rowIndex) =>
    row.forEach((cell, colIndex) => {
        if (cell === '#' || cell === '.') { return; }
        blizzards.push({
            y: rowIndex,
            x: colIndex,
            dir: blizzardMoves[cell],
        });
    })
);

const mapHeight = initMap.length;
const mapWidth = initMap[0].length;

const maps = [];

const moveBlizzards = () => {
    blizzards.forEach(b => {
        b.y = (b.y + b.dir[0] - 1 + (mapHeight - 2)) % (mapHeight - 2) + 1;
        b.x = (b.x + b.dir[1] - 1 + (mapWidth - 2)) % (mapWidth - 2) + 1;
    });
};

const generateMap = () => {
    const map = new Array(mapHeight - 2).fill(0).map(
        () => (['#', ...new Array(mapWidth - 2).fill('.'), '#'])
    );
    map.unshift(initMap[0]);
    map.push(initMap[initMap.length - 1]);

    blizzards.forEach(b => map[b.y][b.x] = '#');
    maps.push(map);
}

const inspectPos = [
    [0, 0], [-1, 0], [0, -1], [1, 0], [0, 1],
];

const findPath = (initState, [targetY, targetX]) => {
    const queue = [initState];

    while (queue.length > 0) {
        const [currentY, currentX, time] = queue.shift();

        if (currentY === targetY && currentX === targetX) {
            return time;
        }

        if (!maps[time + 1]) {
            moveBlizzards();
            generateMap();
        }

        inspectPos.forEach(delta => {
            const nextY = currentY + delta[0];
            const nextX = currentX + delta[1];

            if (!(nextY in maps[time + 1]) || maps[time + 1][nextY][nextX] === '#') { return; }
            if (queue.find(p => p[0] === nextY && p[1] === nextX && p[2] === time + 1)) { return; }

            queue.push([nextY, nextX, time + 1]);
        });
    }
}

generateMap();

const shortestTimeToGoal = findPath([0, 1, 0], [initMap.length - 1, initMap[0].length - 2]);
console.log('Shortest time to goal:', shortestTimeToGoal);

const shortestTimeBack = findPath([initMap.length - 1, initMap[0].length - 2, shortestTimeToGoal], [0, 1]);
console.log('Shortest time to goal and back:', shortestTimeBack);

const shortestTimeBackAndForth = findPath([0, 1, shortestTimeBack], [initMap.length - 1, initMap[0].length - 2]);
console.log('Shortest time to goal and back and to the goal again:', shortestTimeBackAndForth);
