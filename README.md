## Skycrypt Tester Pre-Alpha:tm:

hello, welcome to skycrypt tester, the worst tester on television.

i use this thing to load the page, screenshot it and save the screenshot to a folder, so we know that stuff we make the script do works across multiple profiles.. and now others can as well! *(even if the code is garbage)*

in case you really want to use this thing *(which i don't recommend)*, you will need to create multiple things after pulling/cloning this
- `screenshots` folder
- `usernames.json` and `preferred-usernames.json` files, both with `[]` in them by default
    - the difference between the two being that preferred usernames will always go first in the queue (meant for features profiles for example), usernames are randomized and data for it can be generated using `generate-usernames.js`

once you have all you need, you can simply just get nodejs, run the `npm i` in the folder to create a blackhole and run `node index.js` to run the thing

all the configuration things can be edited in index.js itself, because i still hadn't tidied up and made a proper configuration for this stuff