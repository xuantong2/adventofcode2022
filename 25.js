import fs from 'node:fs';

const rawData = fs.readFileSync('25in.txt').toString().split('\n').filter(Boolean);

const numStrings = rawData;

const digits = ['=', '-', '0', '1', '2'];

const snafuAdder = (d1, d2, carry = 0) => {
    const d1Index = digits.indexOf(d1);
    const d2Index = digits.indexOf(d2);
    
    const sum = (d1Index > -1 ? d1Index : 2) + (d2Index > -1 ? d2Index : 2) + carry - 2;

    return [digits[(sum + 5) % 5], Math.floor(sum / 5)];
};

let snafuSum = '';

numStrings.forEach(num => {
    let nextSum = '';
    let i = 0;
    let carry = 0;

    while (true) {
        const [digitResult, _carry] = snafuAdder(snafuSum[snafuSum.length - 1 - i], num[num.length - 1 - i], carry);
        nextSum = digitResult + nextSum;

        if (i >= num.length - 1 && i >= snafuSum.length - 1 && _carry === 0) {
            break;
        }

        carry = _carry;
        i += 1;
    }

    snafuSum = nextSum;
});

console.log(snafuSum);
