import fs from 'node:fs';

const rawData = fs.readFileSync('23in.txt').toString().split('\n').filter(Boolean);

const map = rawData.map(line => line.split(''));

const elves = [];
let proposals = [
    [[-1, -1], [-1, 0], [-1, 1]],
    [[1, -1], [1, 0], [1, 1]],
    [[-1, -1], [0, -1], [1, -1]],
    [[-1, 1], [0, 1], [1, 1]],
];

map.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
        if (cell === '#') {
            elves.push({
                y: rowIndex,
                x: colIndex,
                currentProposal: undefined,
                nextY: undefined,
                nextX: undefined,
            });
        }
    });
});

new Array(10000).fill(0).some((_, i) => {
    elves.forEach(elf => {
        const noNeighbours = [-1, 0, 1].every(
            y => [-1, 0, 1].every(
                x => elves.every(
                    e => e === elf || !((e.y === elf.y + y) && (e.x === elf.x + x))
                )
            )
        );

        if (noNeighbours) { return; }

        elf.currentProposal = proposals.find(
            pSet => pSet.every(
                offset => elves.every(
                    e => e === elf || (e.y !== elf.y + offset[0]) || (e.x !== elf.x + offset[1])
                )
            )
        );

        if (!elf.currentProposal) { return; }

        elf.nextY = elf.y + elf.currentProposal[1][0];
        elf.nextX = elf.x + elf.currentProposal[1][1];
    });

    if (elves.every(elf => !elf.currentProposal)) {
        console.log('No movement from round:', i + 1);
        return true;
    }

    elves.forEach(elf => {
        if (!elf.currentProposal) { return; }
        
        const willCollide = elves.some(
            collisionElf => collisionElf !== elf && collisionElf.nextY === elf.nextY && collisionElf.nextX === elf.nextX
        );

        if (!willCollide) {
            elf.y = elf.nextY;
            elf.x = elf.nextX;
        }
    });

    elves.forEach(elf => {
        elf.currentProposal = undefined;
        elf.nextY = undefined;
        elf.nextX = undefined;
    });

    proposals.push(...proposals.splice(0, 1));

    if (i === 9) {
        const minY = Math.min(...elves.map(({ y }) => y));
        const maxY = Math.max(...elves.map(({ y }) => y));
        const minX = Math.min(...elves.map(({ x }) => x));
        const maxX = Math.max(...elves.map(({ x }) => x));

        const emptyTiles = (maxY - minY + 1) * (maxX - minX + 1) - elves.length;

        console.log('Empty tiles at round 10:', emptyTiles);
    }
});

