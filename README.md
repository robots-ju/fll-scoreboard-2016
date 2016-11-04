# Robots-JU FLL 2016 Scoreboard

Unofficial web scoreboard for the FLL 2016 (Animal Allies) Robot Game.

This is a private project that is not supported or approved by the FIRST® LEGO® League.
However it may be the official scoreboard for some events organised by [Robots-JU](https://robots-ju.ch/).

Feel free to report bugs and suggestions in the Issues !

## How to use

[Robots-JU](https://robots-ju.ch/) hosts the latest version at <https://fll-scoreboard-2016.robots-ju.ch/>. No need to install anything !

### Do it yourself

```bash
# Install npm and bower dependencies
npm install
bower install
# Run gulp to craft the application
gulp
# Application is ready in the `site` folder
# Just open `site/index.html` in your browser to start
```

### Technical details

NPM is used to get the dev dependencies for `gulp`.

Bower is used for the third party libraries used by the application:

- [React](https://github.com/facebook/react)
- [The Robots-JU Robot Game scorer 2016](https://github.com/robots-ju/fll-robotgame-scorer-2016)

The gulp tasks concat, uglify and copy everything to the `site` folder.

A `gulp watch` task is available to automatically regenerate files as you edit them.

## Images copyrights

The table overview image and the Animal Allies logo come from the official [Robot Game material](http://www.firstlegoleague.org/challenge).
Table image was resized and the part behind the gecko wall was painted black as it should be.
Logo was exported from EPS to PNG.

The missions illustrations displayed with each task come from the [Missions overview page](http://www.first-lego-league.org/en/fll/robot-game/missions.html) on the FLL Europe website by HANDS on TECHNOLOGY.
Thanks for making them, they are great !

## Code license

This code is released under [the MIT license](LICENSE.txt).
The logic behind the scoreboard is hosted at <https://github.com/robots-ju/fll-robotgame-scorer-2016> and is also subject to the MIT.
