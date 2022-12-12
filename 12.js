import fs from 'node:fs';

const rawData = fs.readFileSync('12in.txt');

const map = rawData.toString().split('\n').filter(Boolean).map(r => r.split(''));

const findCoords = needle => map.reduce((c, r, rowIndex) => {
    const colIndex = r.findIndex(s => s === needle) ;

    return colIndex > -1 ? { y: rowIndex, x: colIndex } : c;
}, null);

const startCoords = findCoords('S');
const targetCoords = findCoords('E');
map[startCoords.y][startCoords.x] = 'a';
map[targetCoords.y][targetCoords.x] = 'z';

const minPaths = (new Array(map.length).fill(0)).map(() => (new Array(map[0].length).fill(Infinity)));
minPaths[targetCoords.y][targetCoords.x] = 0;

const markQueue = [targetCoords];

function processNextInQueue() {
    const coords = markQueue.shift();
 
    [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(moves => {
        const neighbour = { y: coords.y + moves[0], x: coords.x + moves[1]};

        if (Math.min(neighbour.x, neighbour.y) < 0 || neighbour.x >= map[0].length || neighbour.y >= map.length) {
            return;
        }

        const currentDistance = minPaths[coords.y][coords.x];
        const nextDistance = minPaths[neighbour.y][neighbour.x];

        if (nextDistance <= currentDistance) { return; }

        const currentCharCode = map[coords.y][coords.x].charCodeAt();
        const nextCharCode = map[neighbour.y][neighbour.x].charCodeAt();

        if (currentCharCode - nextCharCode < 2) {
            minPaths[neighbour.y][neighbour.x] = minPaths[coords.y][coords.x] + 1;

            if (!markQueue.find(({ y, x }) => y === neighbour.y && x === neighbour.x)) {
                markQueue.push(neighbour);
            }
        }
    });

    if (markQueue.length > 0) { processNextInQueue(); }
}

processNextInQueue();
const minPathsFromLow = minPaths.map(
        (pathRow, colIndex) => pathRow.filter((_, rowIndex) => map[colIndex][rowIndex] === 'a')
    ).reduce((paths, pathRow) => ([...paths, ...pathRow]), []);

console.log('Min steps from S to E:', minPaths[startCoords.y][startCoords.x]);
console.log('Min steps from an a:', Math.min(...minPathsFromLow));
