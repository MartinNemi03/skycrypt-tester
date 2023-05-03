import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';

let leaderboards = [
    "blaze_slayer_xp",
    "dungeons_catacombs_floor_7_tier_completions",
    "dungeons_catacombs_xp",
    "dungeons_secrets_found",
    "enderman_slayer_xp",
    "gifts_given",
    "gifts_received",
    "pet_score",
    "sea_creature_kills",
    "skill_alchemy_xp",
    "skill_carpentry_xp",
    "skill_combat_xp",
    "skill_enchanting_xp",
    "skill_farming_xp",
    "skill_fishing_xp",
    "skill_foraging_xp",
    "skill_mining_xp",
    "skill_runecrafting_xp",
    "skill_social_xp",
    "skill_taming_xp",
    "spider_slayer_xp",
    "total_pet_exp_gained",
    "total_skill_xp",
    "wolf_slayer_xp",
    "zombie_slayer_xp"
];

const usernames = [];

const _dirname = path.dirname('');
const usernameJson = path.resolve(_dirname, 'usernames.json');

function sleep(ms = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    leaderboards = leaderboards.sort(() => (0.5 - Math.random()));

    for (const name of leaderboards) {
        let res = await fetch(`https://sky.shiiyu.moe/api/v2/leaderboard/${name}?count=20`);
        let json = await res.json(); 

        json.positions.forEach(position => {
            let username = position.username;
            if (!usernames.includes(username)) {
                usernames.push(username);
            }
        });

        await sleep(1000);

        console.log(`${name} done (total: ${usernames.length})`);
    }

    fs.writeFileSync(usernameJson, JSON.stringify(usernames));
})();