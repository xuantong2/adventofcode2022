import fs from 'node:fs';

const ArraySum = a => a.reduce((x, y) => x + y, 0); 
const NewArray = (length, defaultValue = undefined) => new Array(length).fill(defaultValue);

const MatrixRotate = matrix => matrix.map((row, rowIndex) =>
    row.map((_, colIndex) => matrix[colIndex][rowIndex]).reverse()
);

const rawData = fs.readFileSync(new URL('./input.txt', import.meta.url).pathname);

let treeHeights = rawData.toString().split('\n').filter(Boolean).map(row => row.split('').map(t => parseInt(t, 10)));

// Part 1

let isVisible = NewArray(99).map(() => NewArray(99, 0));

NewArray(4).forEach(() => {
    treeHeights.forEach((treeRow, rowIndex) => {
        treeRow.forEach((tree, colIndex) => {
            isVisible[rowIndex][colIndex] |= Math.max(...treeHeights[rowIndex].slice(0, colIndex)) < tree;
        })
    });

    treeHeights = MatrixRotate(treeHeights);
    isVisible = MatrixRotate(isVisible);
});

console.log('Visible count:', isVisible.reduce((sum, row) => sum + ArraySum(row), 0));

// Part 2

let scores = NewArray(99).map(() => NewArray(99, 1));

NewArray(4).forEach(() => {
    treeHeights.forEach((treeRow, rowIndex) => {
        treeRow.forEach((tree, colIndex) => {
            if (colIndex === 98) { return; }
            scores[rowIndex][colIndex] *= Math.max(treeRow.slice(colIndex + 1).findIndex(compareTree => compareTree >= tree) + 1, 0) || (98 - colIndex);
        })
    });

    treeHeights = MatrixRotate(treeHeights);
    scores = MatrixRotate(scores);
});

console.log('Max score:', scores.reduce((max, row) => Math.max(max, ...row), 0));
