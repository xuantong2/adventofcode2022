import fs from 'node:fs';

const NewArray = (length, defaultValue = undefined) => new Array(length).fill(defaultValue);

const rawData = fs.readFileSync('14in.txt').toString().split('\n').filter(Boolean);

const coordSets = rawData.map(line =>
    line.split(' -> ').map(coord => ({
        x: parseInt(coord.split(',')[0]), 
        y: parseInt(coord.split(',')[1]), 
    })
));

const maxY = Math.max(...coordSets.map(coordSet =>
    Math.max(...coordSet.map(c => c.y))
));

const createMap = height => {
    const width = height * 2 + 1;
    const offSetX = 500 - height - 1;

    const map = NewArray(height).map(() => NewArray(width, '.'));

    coordSets.forEach(coords => {
        coords.forEach((to, i) => {
            if (i === 0) { return; }
            const from = coords[i - 1];

            const yDelta = to.y - from.y;
            const xDelta = to.x - from.x;

            NewArray(Math.max(Math.abs(yDelta), Math.abs(xDelta)) + 1).forEach((_, index) => 
                map[from.y + index * Math.sign(yDelta)][from.x - offSetX + index * Math.sign(xDelta)] = '#'
            );
        });
    });

    return map;
}

const feedSand = (map, coords) => {
    if (coords.y === map.length - 1) { return true; }

    const spill = [0, -1, 1].some(xStep => {
        const nextCoords = { y: coords.y + 1, x: coords.x + xStep };

        if (map[nextCoords.y][nextCoords.x] === '.') {
            return feedSand(map, nextCoords);
        }

        return false;
    })

    if (!spill) { map[coords.y][coords.x] = 'o'; }
    return spill;
};

const countSands = map => map.reduce((sum, row) =>
    sum + row.reduce(
        (sum, cell) => sum + (cell === 'o' ? 1 : 0)
        , 0)
    , 0);

const part1Map = createMap(maxY + 1);
feedSand(part1Map, { x: part1Map.length + 1, y: 0 });
console.log(countSands(part1Map));

const part2Map = createMap(maxY + 3);
part2Map[part2Map.length - 1].fill('#');
feedSand(part2Map, { x: part2Map.length + 1, y: 0 });
console.log(countSands(part2Map));
