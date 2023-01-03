
import fs from 'node:fs';

const ArrayIntersect = (a, b) => a.filter(e => b.includes(e));
const smallACode = 'a'.charCodeAt();
const bigACode = 'A'.charCodeAt();

const rawData = fs.readFileSync('3in.txt').toString().trim().split('\n');

const rucksacks = rawData;

const sharedItemTypes = rucksacks.map(
    rs => ArrayIntersect(rs.slice(0, rs.length / 2).split(''), rs.slice(rs.length / 2).split(''))[0]
);

const priorities = sharedItemTypes.map(
    it => it.charCodeAt()
).map(
    itCode => itCode >= smallACode ? itCode - smallACode + 1 : itCode - bigACode + 27
);

console.log('Item type priorities sum:', priorities.reduce((sum, s) => sum + s, 0));

const groupedRucksacks = new Array(rucksacks.length / 3).fill(0).map((_, i) => 
    ([rucksacks[i * 3], rucksacks[i * 3 + 1], rucksacks[i * 3 + 2]])
);

const groupedSharedItemTypes = groupedRucksacks.map(g =>
    ArrayIntersect(
        ArrayIntersect(
            g[0].split(''),
            g[1].split(''),
        ),
        g[2].split(''),
    )[0]
);

const groupedPriorities = groupedSharedItemTypes.map(
    it => it.charCodeAt()
).map(
    itCode => itCode >= smallACode ? itCode - smallACode + 1 : itCode - bigACode + 27
);

console.log('Grouped priorities sum:', groupedPriorities.reduce((sum, s) => sum + s, 0));
