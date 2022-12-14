import fs from 'node:fs';

const rawData = fs.readFileSync('13in.txt').toString().split('\n').filter(Boolean);

const packetPairs = [];

while (rawData.length > 0) {
    packetPairs.push({
        left: JSON.parse(rawData.shift()),
        right: JSON.parse(rawData.shift()),
    });
}

// return values:
//      true        - left is smaller
//      undefined   - equal
//      false       - right is smaller
const comparePair = (left, right) => {
    if (left === undefined) { return true; }
    if (right === undefined) { return false; }

    let compareLeft = left;
    let compareRight = right;
    
    if (Array.isArray(compareLeft) || Array.isArray(compareRight)) {
        if (typeof compareLeft === 'number') { compareLeft = [compareLeft]; }
        if (typeof compareRight === 'number') { compareRight = [compareRight]; }

        const compareResult = compareLeft.reduce((result, left, index) => {
            if (result !== undefined) { return result; }

            return comparePair(left, compareRight[index]);
        }, undefined);

        if (compareResult === undefined) {
            return (compareLeft.length < compareRight.length) ? true : undefined;
        }

        return compareResult;
    }

    return left === right ? undefined : left < right;
}

const arePairsOrdered = packetPairs.map((pair) => comparePair(pair.left, pair.right));

console.log('Index sum:', arePairsOrdered.reduce((sum, v, index) => sum + (v === true ? index + 1 : 0), 0));

const packetsList = [[[2]], [[6]]];
packetPairs.forEach(pair => packetsList.push(pair.left, pair.right));

packetsList.sort((a, b) => (comparePair(b, a) === true ? 1 : -1));

const index2 = packetsList.findIndex(p => JSON.stringify(p) === '[[2]]') + 1;
const index6 = packetsList.findIndex(p => JSON.stringify(p) === '[[6]]') + 1;

console.log('Decoder key:', index2 * index6);

