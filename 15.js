import fs from 'node:fs';

const rawData = fs.readFileSync('15in.txt').toString().split('\n').filter(Boolean);

const pairs = rawData.map(line => { 
    const [sensor, beacon] = line.split(':');
    const sensorCoords = sensor.split(',');
    const beaconCoords = beacon.split(',');

    return {
        sensor: {
            x: parseInt(sensorCoords[0].split('=')[1]),
            y: parseInt(sensorCoords[1].split('=')[1]),
        },
        beacon: {
            x: parseInt(beaconCoords[0].split('=')[1]),
            y: parseInt(beaconCoords[1].split('=')[1]),
        },
    };
});

const beaconsSet = new Set(
    pairs.map(({ beacon }) => beacon.x + ',' + beacon.y)
);

const beaconCoords = Array.from(beaconsSet).map(beacon => ({
    x: parseInt(beacon.split(',')[0]),
    y: parseInt(beacon.split(',')[1]),
}));

const beaconCountAtY = y => beaconCoords.reduce(
    (count, beacon) => count + (beacon.y === y ? 1 : 0),
    0
);

const getEmptyRangesAtY = y => {
    const emptyRanges = [];

    pairs.forEach(({ sensor, beacon }) => {
        const scanRange = Math.abs(sensor.x - beacon.x) + Math.abs(sensor.y - beacon.y);
        const yDistance = Math.abs(y - sensor.y);

        if (yDistance > scanRange) { return; }

        emptyRanges.push({
            from: sensor.x - (scanRange - yDistance),
            to: sensor.x + (scanRange - yDistance),
        });
    });

    emptyRanges.sort((a, b) => Math.sign(a.from - b.from));

    emptyRanges.forEach((range, i) => {
        if (i === 0) { return; }

        range.from = Math.max(emptyRanges[i - 1].to, range.from);
        range.to = Math.max(emptyRanges[i - 1].to, range.to);
    });

    return emptyRanges;
}

const part1EmptyRanges = getEmptyRangesAtY(2e6);

const rangeSum = part1EmptyRanges.reduce((sum, range, index) => 
    sum
        + range.to - range.from + 1
        - ((part1EmptyRanges[index - 1] || {}).to === range.from ? 1 : 0)
    , 0);

console.log('Empty positions:', rangeSum - beaconCountAtY(2e6));

(new Array(4e6).fill(0)).some((_, y) => {
    const emptyRanges = getEmptyRangesAtY(y);
    const holeNeighbour = emptyRanges.find((range, rangeIndex) =>
        rangeIndex > 0 && range.from !== emptyRanges[rangeIndex - 1].to
    );

    if (holeNeighbour) {
        console.log('Hole at: (', holeNeighbour.from - 1, ',', y, ')');
        console.log('Tuning frequency:', (holeNeighbour.from - 1) * 4e6 + y);
        return true;
    }
});
