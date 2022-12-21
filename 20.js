import fs from 'node:fs';

const rawData = fs.readFileSync('20in.txt').toString().split('\n').filter(Boolean);

const sequence = rawData.map(n => parseInt(n));

const mix = (list, reps = 1, decryptionKey = 1) => {
    const sequence = [...list].map(n => n * decryptionKey);
    const sequenceOrder = (new Array(sequence.length)).fill(0).map((_, i) => i);

    (new Array(sequence.length * reps)).fill(0).forEach((_, i) => {
        const numIndex = sequenceOrder.indexOf(i % sequence.length);
        const number = sequence[numIndex];

        if (number === 0) { return; }

        sequence.splice(numIndex, 1);
        sequenceOrder.splice(numIndex, 1);

        const newIndex = (numIndex + number) % sequence.length;

        sequence.splice(newIndex, 0, number);
        sequenceOrder.splice(newIndex, 0, i % sequence.length);
    });

    const zeroIndex = sequence.indexOf(0);
    const coords = [1000, 2000, 3000].map(n =>
        sequence[(zeroIndex + n + sequence.length) % sequence.length]
    );

    return coords.reduce((sum, n) => sum + n, 0);
}

console.log(mix(sequence));
console.log(mix(sequence, 10, 811589153));
