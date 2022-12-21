import fs from 'node:fs';

const rawData = fs.readFileSync('19in.txt').toString().split('\n').filter(Boolean);

const ROCKS = ['ore', 'clay', 'obs', 'geode'];
const ORE_I = 0;
const CLAY_I = 1;
const OBS_I = 2;
const GEODE_I = 3;

const blueprints = rawData.map((line) => ([ 
    [ parseInt(line.split('ore robot costs ')[1].split(' ')[0]) ],
    [ parseInt(line.split('clay robot costs ')[1].split(' ')[0]) ],
    [ parseInt(line.split('obsidian robot costs ')[1].split(' ore')[0]), parseInt(line.split('ore and ')[1].split(' clay')[0]) ],
    [ parseInt(line.split('geode robot costs ')[1].split(' ore')[0]), 0, parseInt(line.split('ore and ')[2].split(' obs')[0]) ],
 ]));

const defaultInventory = [0, 0, 0, 0];
const defaultRobots = [1, 0, 0, 0];

const getMaxGeodes = (blueprint, minutes) => {
    const stack = [[[ ...defaultInventory ], [ ...defaultRobots ], minutes]];
    let maxGeodes = [0, 0, 0, 0];

    const maxRocks = [ 
        Math.max(blueprint[ORE_I][ORE_I], blueprint[CLAY_I][ORE_I], blueprint[OBS_I][ORE_I], blueprint[GEODE_I][ORE_I]),
        blueprint[OBS_I][CLAY_I],
        blueprint[GEODE_I][OBS_I],
    ];

    while (stack.length > 0) {
        const [inventory, robots, timeRemaining] = stack.pop();
        if (timeRemaining === 0) { continue; }

        const timeRequiredToBuild = [ 
            robots[ORE_I] >= maxRocks[ORE_I] ? undefined : (blueprint[ORE_I][ORE_I] - inventory[ORE_I]) / robots[ORE_I] + 1,
            robots[CLAY_I] >= maxRocks[CLAY_I] ? undefined : (blueprint[CLAY_I][ORE_I] - inventory[ORE_I]) / robots[ORE_I] + 1,
            (robots[CLAY_I] < 1 || robots[OBS_I] >= maxRocks[OBS_I]) ? undefined : Math.max(
                (blueprint[OBS_I][ORE_I] - inventory[ORE_I]) / robots[ORE_I] + 1,
                (blueprint[OBS_I][CLAY_I] - inventory[CLAY_I]) / robots[CLAY_I] + 1,
            ),
            robots[OBS_I] < 1 ? undefined : Math.max(
                (blueprint[GEODE_I][ORE_I] - inventory[ORE_I]) / robots[ORE_I] + 1,
                (blueprint[GEODE_I][OBS_I] - inventory[OBS_I]) / robots[OBS_I] + 1,
            ),
        ];

        ROCKS.forEach((_, i) => {
            if (timeRequiredToBuild[i] === undefined) { return; }
            const timeRequired = Math.max(Math.ceil(timeRequiredToBuild[i]), 1);

            if (timeRequired >= timeRemaining) {
                const outcome = [
                    inventory[ORE_I] + robots[ORE_I] * timeRemaining,
                    inventory[CLAY_I] + robots[CLAY_I] * timeRemaining,
                    inventory[OBS_I] + robots[OBS_I] * timeRemaining,
                    inventory[GEODE_I] + robots[GEODE_I] * timeRemaining,
                ];

                if (maxGeodes[GEODE_I] < outcome[GEODE_I]) { maxGeodes = outcome; }

                return;
            }

            const newInventory = [ 
                inventory[ORE_I] + robots[ORE_I] * timeRequired - (blueprint[i][ORE_I] || 0),
                inventory[CLAY_I] + robots[CLAY_I] * timeRequired - (blueprint[i][CLAY_I] || 0),
                inventory[OBS_I] + robots[OBS_I] * timeRequired - (blueprint[i][OBS_I] || 0),
                inventory[GEODE_I] + robots[GEODE_I] * timeRequired,
            ];

            const newRobots = [...robots];
            newRobots[i] += 1;

            stack.push([newInventory, newRobots, timeRemaining - timeRequired]);
        });
    }

    return maxGeodes;
};

const qualities = blueprints.map((blueprint, i) => (i + 1) * getMaxGeodes(blueprint, 24)[GEODE_I]);
console.log('Quality sum:', qualities.reduce((sum, q) => sum + q, 0));

const maxGeodes2 = blueprints.slice(0, 3).map(blueprint => getMaxGeodes(blueprint, 32));
console.log('Part 2 product:', maxGeodes2.reduce((product, g) => product * g[GEODE_I], 1));
