import fs from 'node:fs';

const rawData = fs.readFileSync(new URL('./input.txt', import.meta.url).pathname);

const commands = rawData.toString().split('\n').filter(Boolean);

let cwd = '';
const directories = new Set('/');
const dirSizes = {};
const dirSizeSums = {};

commands.forEach(command => {
    if (command.startsWith('$ cd')) {
        const cdDir = command.split(' ')[2];

        if (cdDir === '..') {
            const cwdParts = cwd.split('/');
            cwdParts.pop(); cwdParts.pop();
            cwd = cwdParts.join('/') + '/';
            return;
        }

        if (cdDir === '/') {
            cwd = '/'
            return;
        }

        cwd = cwd + cdDir + '/';
        directories.add(cwd);
    }

    if (!isNaN(command[0])) {
        const fileSize = parseInt(command.split(' ')[0], 0);
        dirSizes[cwd] = (dirSizes[cwd] || 0) + fileSize;
    }
});

Array.from(directories).forEach(d => {
    dirSizeSums[d] = Object.entries(dirSizes).reduce((sum, [dir, dirSize]) => sum + (dir.startsWith(d) ? dirSize : 0), 0);
});

console.log('Part 1 sum:', Object.values(dirSizeSums).filter(s => s <= 100000).reduce((sum, value) => sum + value, 0));

const currentFreeSize = 70000000 - dirSizeSums['/'];

const deltaFromTargetIfDeleted = Object.values(dirSizeSums).map((size) => currentFreeSize + size - 30000000);
const minDelta = Math.min(...deltaFromTargetIfDeleted.filter(d => d > 0));

console.log('Part 2 min size:', minDelta + 30000000 - currentFreeSize);


