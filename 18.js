import fs from 'node:fs';

const rawData = fs.readFileSync('18in.txt').toString().split('\n').filter(Boolean);

const cubes = rawData.map(data => data.split(',').map(p => parseInt(p)));

const neighbourOffsets = [
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1],
];

const getEmptyNeighbours = cubes => {
    const cubeKeys = cubes.map(c => c.join(','));
    const emptyNeighbours = [];

    cubes.forEach(c => emptyNeighbours.push(
        ...neighbourOffsets.map(o =>
            ([c[0] + o[0], c[1] + o[1], c[2] + o[2]].join(','))
        ).filter(n => !cubeKeys.includes(n))
    ));

    return emptyNeighbours;
}

const airNeighbours = getEmptyNeighbours(cubes);
console.log('Surface area:', airNeighbours.length);

const minX = Math.min(...cubes.map(coords => coords[0])) - 1;
const minY = Math.min(...cubes.map(coords => coords[1])) - 1;
const minZ = Math.min(...cubes.map(coords => coords[2])) - 1;
const maxX = Math.max(...cubes.map(coords => coords[0])) + 1;
const maxY = Math.max(...cubes.map(coords => coords[1])) + 1;
const maxZ = Math.max(...cubes.map(coords => coords[2])) + 1;

const filterExteriorNeighbours = airNeighbours => {
    const cubeKeys = cubes.map(c => c.join(','));
    const walked = [];
    const walkQueue = [[minX, minY, minZ]];

    while (walkQueue.length > 0) {
        const coords = walkQueue.shift();
        const coordsKey = coords.join(',');
        if (walked.includes(coordsKey) || cubeKeys.includes(coordsKey)) {
            continue;
        }

        walked.push(coordsKey);
        airNeighbours = airNeighbours.filter(n => n !== coordsKey);

        neighbourOffsets.forEach(o => {
            const neighbourCoords = [coords[0] + o[0], coords[1] + o[1], coords[2] + o[2]];
            const outOfBounds = neighbourCoords[0] < minX || neighbourCoords[0] > maxX
                || neighbourCoords[1] < minY || neighbourCoords[1] > maxY
                || neighbourCoords[2] < minZ || neighbourCoords[2] > maxZ;

            if (outOfBounds) { return; }

            walkQueue.push(neighbourCoords);
        });
    }

    return airNeighbours;
};

const interiorNeighbours = filterExteriorNeighbours(airNeighbours);
console.log('Exterior surface area:', airNeighbours.length - interiorNeighbours.length);
