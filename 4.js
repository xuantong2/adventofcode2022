import fs from 'node:fs';

const rawData = fs.readFileSync('4in.txt').toString().trim().split('\n');

const pairs = rawData.map(line => line.split(','));

const fullyOverlaps = (a, b) => (a[0] >= b[0] && a[1] <= b[1]) || (a[0] <= b[0] && a[1] >= b[1]);

const overlaps = (a, b) => !(a[1] < b[0] || a[0] > b[1]);

const fullyOverlapPairs = pairs.map(
    ([p1, p2]) => fullyOverlaps(
        p1.split('-').map(p => parseInt(p)),
        p2.split('-').map(p => parseInt(p)),
    )
);

const fullyOverlapCount = fullyOverlapPairs.reduce((sum, overlap) => sum + (overlap ? 1 : 0), 0);

console.log('Fully overlapping pair count:', fullyOverlapCount);

const partialOverlapPairs = pairs.map(
    ([p1, p2]) => overlaps(
        p1.split('-').map(p => parseInt(p)),
        p2.split('-').map(p => parseInt(p)),
    )
);

const partialOverlapCount = partialOverlapPairs.reduce((sum, overlap) => sum + (overlap ? 1 : 0), 0);

console.log('Partial overlapping pair count:', partialOverlapCount);
