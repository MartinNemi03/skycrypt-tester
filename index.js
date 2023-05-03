import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

let limit = 1;
let interval = 1000;
let outOf = 100;

let usernames = [];

let state = false;
let loopInterval = null;

let requestTimes = [];
let averageTime = 0;

let runningTime = 0;
let totalReqeusts = 0;

const _dirname = path.dirname('');

function sleep(ms = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkPage(username = "Shiiyu") {
    const browser = await puppeteer.launch({
        args: [`--window-size=1920,1080`],
        defaultViewport: {
            width: 1920,
            height: 1080
        }
    });

    const page = await browser.newPage();
    const url = `http://localhost:32464/stats/${username}`;
    let cssSelector;

    /* left over code for pack selection
    await page.goto(`http://localhost:32464/`);
    await sleep();

    await page.click(`#packs-button`);
    await sleep(3000);

    await page.screenshot({ path: `screenshots/packs-${username}.png` });

    await page.click(`#packs-box > label:nth-child(6) > button:nth-child(5)`);
    await sleep();
    */

    const startTime = Date.now();
    await page.goto(url).then((res) => {
        let requestTime = (Date.now() - startTime);
        requestTimes.push(requestTime);
        totalReqeusts++;

        console.log(`${username}`);
        console.log(`  request_time: ${requestTime}ms`);
        console.log(`  status: ${res.status()}`);
    });

    /* left over code for missing accessories
    await sleep();

    cssSelector = "button[aria-controls=missing-accessories]";
    if (await page.$(cssSelector)) {
        await page.click(cssSelector);
    }

    await sleep();

    cssSelector = "div.stat-power";
    if (await page.$(cssSelector)) {
        await page.hover(cssSelector);
    }
    */

    await sleep(3000);

    await page.screenshot({ path: `screenshots/${username}.png` });

    await browser.close();
}

async function checkPages(limit = 2) {
    if (state) return;

    const hasLimit = (limit > 0);
    console.log(`${new Date().toISOString()} - checking ${(hasLimit ? limit : "all")} pages (out of ${usernames.length})\n`);

    const roundStart = Date.now();
    state = true;

    // usernames = usernames.sort(() => (0.5 - Math.random()));
    const toCheck = [];

    for (const username of (limit > 0 ? usernames.slice(0, limit) : usernames)) {
        toCheck.push(username);
        usernames = usernames.filter((value) => {
            return value != username;
        });
    }

    await Promise.all(toCheck.map(username => {
        return checkPage(username);
    }));

    if (requestTimes.length > 0) {
        averageTime = 0;
        requestTimes.forEach(time => {
            averageTime += time;
        });
        averageTime = (averageTime / requestTimes.length).toFixed(2);
    }

    let roundTook = Date.now() - roundStart;
    runningTime += roundTook;

    state = false;

    console.log("\r\n");

    console.log(`\t- total requests: ${totalReqeusts}`);
    console.log(`\t- average request time: ${averageTime}ms`);
    console.log(`\t- round took: ${(roundTook)}ms (total: ${(runningTime / 1000).toFixed(1)}s)`);

    console.log("\r\n");

    if (usernames <= 0 && loopInterval != null) 
        clearInterval(loopInterval);
}

(async () => {
    const screenshotsFolder = path.resolve(_dirname, 'screenshots');
    const preferredUsernameJson = path.resolve(_dirname, 'preferred-usernames.json');
    const usernameJson = path.resolve(_dirname, 'usernames.json');

    await Promise.all(
        new Promise((resolve) => {
            fs.readFile(preferredUsernameJson, (err, file) => {
                if (err) throw err;
        
                JSON.parse(file).forEach((username) => {
                    if (!usernames.includes(username))
                        usernames.push(username);
                });

                resolve();
            });
        }), new Promise((resolve) => {
            fs.readFile(usernameJson, (err, file) => {
                if (err) throw err;
        
                JSON.parse(file).sort(() => (0.5 - Math.random())).forEach((username) => {
                    if (!usernames.includes(username))
                        usernames.push(username);
                });

                resolve();
            });
        })
    );

    if (outOf > 0) {
        usernames = usernames.slice(0, outOf);
    }

    fs.readdir(screenshotsFolder, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlinkSync(path.join(screenshotsFolder, file));
        }
    });

    console.log(`  ${usernames.length} usernames ready!\r\n`);

    if (interval > 0) {
        loopInterval = setInterval(() => {
            checkPages(limit);
        }, interval);
    }

    checkPages(limit);
})();