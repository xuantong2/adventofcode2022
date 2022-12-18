import fs from 'node:fs';

const rawData = fs.readFileSync('17in.txt').toString().trim();
const jetPattern = rawData.replace(/</g, 'l').replace(/>/g, 'r');

const rockShapes = [
    [
        ['#', '#', '#', '#'],
    ],
    [
        ['.', '#', '.'],
        ['#', '#', '#'],
        ['.', '#', '.'],
    ],
    [
        ['.', '.', '#'],
        ['.', '.', '#'],
        ['#', '#', '#'],
    ],
    [
        ['#'],
        ['#'],
        ['#'],
        ['#'],
    ],
    [
        ['#', '#'],
        ['#', '#'],
    ],
];

const rockBoundaries = rockShapes.map(rockShape => ({
    'd': rockShape[rockShape.length - 1].map((cell, colIndex) =>
        ([cell === '.' ? 0 : 1, colIndex])
    ),
    'l': rockShape.map((row, rowIndex) =>
        ([rowIndex - rockShape.length + 1, row.indexOf('#') - 1])
    ),
    'r': rockShape.map((row, rowIndex) =>
        ([rowIndex - rockShape.length + 1, row.lastIndexOf('#') + 1])
    ),
}));

const canMoveRock = (chamber, rockBoundary, currentPosition, direction) => {
    return rockBoundary[direction].every(offsetCheck => {
        const checkY = currentPosition.y + offsetCheck[0];
        const checkX = currentPosition.x + offsetCheck[1];
        return chamber[checkY]?.[checkX] === '.';
    });
}

const dropRocks = count => {
    const chamber = [];
    const heights = [];
    let jetIndex = 0;

    (new Array(count)).fill(0).forEach((_, rockCount) => {
        const rockBoundary = rockBoundaries[rockCount % 5];
        const rockShape = rockShapes[rockCount % 5];

        const padding = (heights[heights.length - 1] || 0) - chamber.length + 3 + rockShape.length;

        (new Array(Math.abs(padding))).fill(0).forEach(() =>
            padding > 0
                ? chamber.unshift((new Array(7)).fill('.'))
                : chamber.shift()
        );

        const rockHeight = rockShape.length;
        const currentPosition = { x: 2, y: rockHeight - 1};

        while (true) {
            const jetDir = jetPattern[jetIndex % jetPattern.length];
            jetIndex += 1;

            if (canMoveRock(chamber, rockBoundary, currentPosition, jetDir)) {
                currentPosition.x += jetDir === 'l' ? -1 : 1;
            };

            if (!canMoveRock(chamber, rockBoundary, currentPosition, 'd')) {
                break;
            };

            currentPosition.y += 1;
        }

        rockShape.forEach((rockRow, rowIndex) => 
            rockRow.forEach((r, colIndex) => {
                if (r === '#') {
                    chamber[currentPosition.y - (rockHeight - 1) + rowIndex][currentPosition.x + colIndex] = '#';
                }
            })
        );

        chamber.some((r, rowIndex) => {
            if (!r.every(c => c === '.')) {
                heights.push(chamber.length - rowIndex);
                return true;
            }
        });
    });

    return heights;
}

console.log('Height after 2022 rocks:', dropRocks(2022).pop());

const isCorrelated = (array, startPosition, length) => 
    (new Array(length)).fill(0).every((_, i) => 
        array[startPosition + i] === array[startPosition + i + length]
    );


const part2Heights = dropRocks(jetPattern.length * 3);

const heightsDiff = part2Heights.map((h, i) => h - (part2Heights[i - 1] || 0));
let sequenceLength = Math.floor(jetPattern.length / 2);

while (true) {
    if (isCorrelated(heightsDiff, jetPattern.length, sequenceLength)) {
        console.log(sequenceLength);
        break;
    }

    sequenceLength++;
}

const repeatSequence = heightsDiff.slice(jetPattern.length, jetPattern.length + sequenceLength);

const sequenceMultiple = Math.floor((1e12 - jetPattern.length) / sequenceLength);
const remainderLength = 1e12 - sequenceMultiple * sequenceLength - jetPattern.length;

const ArraySum = array => array.reduce((sum, el) => sum + el, 0);

console.log(ArraySum(heightsDiff.slice(0, jetPattern.length)) + 
    sequenceMultiple * ArraySum(repeatSequence) +
    ArraySum(repeatSequence.slice(0, remainderLength)));
