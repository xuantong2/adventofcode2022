import fs from 'node:fs';

const isBetween = (a, x, b) => x >= a && x <= b;

const rawData = fs.readFileSync('22in.txt').toString().split('\n').filter(Boolean);

const path = rawData.pop().split(/(?=[L|R])|(?<=[L|R])/);

const map = rawData;
const maxWidth = Math.max(...map.map(r => r.length));

const coords = [0, map[0].indexOf('.')];
let dir = 0;

path.forEach(step => {
    if (step === 'L') { dir = (dir + 3) % 4; return; }
    if (step === 'R') { dir = (dir + 1) % 4; return; }

    const stepDelta = [(2 - dir) % 2, (1 - dir) % 2];

    (new Array(parseInt(step))).fill(0).forEach(() => {
        let nextStep;
        let nextY = coords[0];
        let nextX = coords[1];

        while (!nextStep || nextStep === ' ') {
            nextY = (nextY + stepDelta[0] + map.length) % map.length;
            nextX = (nextX + stepDelta[1] + maxWidth) % maxWidth;
            nextStep = map[nextY]?.[nextX];
        }

        if (nextStep !== '#') { 
            coords[0] = nextY;
            coords[1] = nextX;
        }
    });
});

console.log('Part 1 password:', (coords[0] + 1) * 1000 + (coords[1] + 1) * 4 + dir)

coords[0] = 0;
coords[1] = map[0].indexOf('.');

path.forEach(step => {
    if (step === 'L') { dir = (dir + 3) % 4; return; }
    if (step === 'R') { dir = (dir + 1) % 4; return; }

    (new Array(parseInt(step))).fill(0).forEach(() => {
        const stepDelta = [(2 - dir) % 2, (1 - dir) % 2];

        let nextStep;
        let nextDir = dir;
        let nextY = coords[0];
        let nextX = coords[1];

        switch (true) {
            case nextX === 50 && isBetween(0, nextY, 49) && dir === 2:
                nextY = 149 - nextY;
                nextX = 0;
                nextDir = 0;
                break;
            case nextX === 0 && isBetween(100, nextY, 149) && dir === 2:
                nextY = 149 - nextY;
                nextX = 50;
                nextDir = 0;
                break;

            case nextX === 50 && isBetween(50, nextY, 99) && dir === 2:
                nextX = nextY - 50;
                nextY = 100;
                nextDir = 1;
                break;
            case isBetween(0, nextX, 49) && nextY === 100 && dir === 3:
                nextY = nextX + 50;
                nextX = 50;
                nextDir = 0;
                break;

            case isBetween(100, nextX, 149) && nextY === 49 && dir === 1:
                nextY = nextX - 50;
                nextX = 99;
                nextDir = 2;
                break;
            case nextX === 99 && isBetween(50, nextY, 99) && dir === 0:
                nextX = nextY + 50;
                nextY = 49; 
                nextDir = 3;
                break;

            case isBetween(0, nextX, 49) && nextY === 199 && dir === 1:
                nextX = nextX + 100;
                nextY = 0;
                nextDir = 1;
                break;
            case isBetween(100, nextX, 149) && nextY === 0 && dir === 3:
                nextX = nextX - 100;
                nextY = 199 
                nextDir = 3;
                break;

            case nextX === 149 && isBetween(0, nextY, 49) && dir === 0:
                nextY = 149 - nextY;
                nextX = 99;
                nextDir = 2;
                break;
            case nextX === 99 && isBetween(100, nextY, 149) && dir === 0:
                nextY = 149 - nextY;
                nextX = 149;
                nextDir = 2;
                break;

            case isBetween(50, nextX, 99) && nextY === 0 && dir === 3:
                nextY = nextX + 100;
                nextX = 0;
                nextDir = 0;
                break;
            case nextX === 0 && isBetween(150, nextY, 199) && dir === 2:
                nextX = nextY - 100;
                nextY = 0;
                nextDir = 1;
                break;

            case isBetween(50, nextX, 99) && nextY === 149 && dir === 1:
                nextY = nextX + 100;
                nextX = 49;
                nextDir = 2;
                break;
            case nextX === 49 && isBetween(150, nextY, 199) && dir === 0:
                nextX = nextY - 100;
                nextY = 149;
                nextDir = 3;
                break;

            default:
            nextY = nextY + stepDelta[0];
            nextX = nextX + stepDelta[1];
            break;
        }

        nextStep = map[nextY][nextX];

        if (nextStep !== '#') { 
            coords[0] = nextY;
            coords[1] = nextX;
            dir = nextDir;
        }
    });
});

console.log('Part 2 password:', (coords[0] + 1) * 1000 + (coords[1] + 1) * 4 + dir)
