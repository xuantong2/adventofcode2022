import fs from 'node:fs';

const rawData = fs.readFileSync('16in.txt').toString().split('\n').filter(Boolean);

const valves = {};

rawData.forEach(line => {
    const [nameInfo, rate] = line.split(';')[0].split('=');
    const neighbours = line.split('to ')[1].replace(/,/g, '').split(' ');
    neighbours.shift();
    const valveName = nameInfo.split(' has')[0].split(' ')[1];

    valves[valveName] = {
        name: valveName,
        rate: parseInt(rate),
        neighbours,
    };
});

Object.values(valves).forEach(v => {
    v.neighbours = v.neighbours.map(n => valves[n]);
});

const calcDistance = (v1, v2, path = '') => {
    if (v1.neighbours.includes(v2)) { return path.length / 2 + 1; }

    return Math.min(...v1.neighbours.map(v =>
        path.includes(v.name) ? Infinity : calcDistance(v, v2, path + v.name)
    ));
}

const pValves = Object.values(valves).map(v => (v.rate > 0) ? v : undefined).filter(Boolean);
const distanceLUT = {};

[valves['AA'], ...pValves].forEach(pv => {
    distanceLUT[pv.name] = {};
    Object.values(valves).forEach(v => {
        if (!pValves.includes(v) || pv === v || v.name === 'AA') { return; }
        distanceLUT[pv.name][v.name] = distanceLUT[v.name]?.[pv.name] || calcDistance(pv, v) + 1;
    });
});

const getMaxPressure = (currentValve, remainingTime, remainingValves) => {
    if (remainingTime < 0) { return 0; }
    const cacheKey = currentValve + remainingTime + remainingValves.join(',');
    if (cache[cacheKey]) { return cache[cacheKey]; }

    const totalPressure = remainingTime * valves[currentValve].rate;

    if (remainingValves.length === 0) { return totalPressure; }

    cache[cacheKey] = totalPressure + Math.max(...remainingValves.map(valve => 
        getMaxPressure(valve, remainingTime - distanceLUT[currentValve][valve], remainingValves.filter(v => v !== valve))
    ));

    return cache[cacheKey];
}

let cache = {};

const maxPressure = getMaxPressure('AA', 30, Object.keys(distanceLUT).filter(v => v !== 'AA'));
console.log('Max pressure alone', maxPressure);

const getMaxPressure2 = (valve1, time1, valve2, time2, remainingValves) => {
    if (time1 < 0) { return 0; }

    let totalPressure = time1 * valves[valve1].rate;
    if (remainingValves.length === 0) { return totalPressure; }

    const cacheKey1 = valve1 + time1 + valve2 + time2;
    const cacheKey2 = remainingValves.join('');
    if (cache[cacheKey1]?.[cacheKey2]) { return cache[cacheKey1][cacheKey2]; }

    const readyValve = time1 >= time2 ? valve1 : valve2;
    const readyValveTime = time1 >= time2 ? time1 : time2;
    const inTransitValve = time1 >= time2 ? valve2 : valve1;
    const inTransitValveTime = time1 >= time2 ? time2 : time1;

    const maxRemaining = remainingValves.map(valve => 
        getMaxPressure2(
            valve,
            readyValveTime - distanceLUT[readyValve][valve],
            inTransitValve,
            inTransitValveTime,
            remainingValves.filter(v => v !== valve),
        )
    );

    if (!cache[cacheKey1]) { cache[cacheKey1] = {}; };

    totalPressure += totalPressure + Math.max(...maxRemaining);
    cache[cacheKey1][cacheKey2] = totalPressure;
    return totalPressure;
};

cache = {};

const maxPressure2 = getMaxPressure2('AA', 26, 'AA', 26, Object.keys(distanceLUT).filter(v => v !== 'AA'));
console.log('Max pressure with elephant friend:', maxPressure2);
