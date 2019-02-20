/* eslint no-console: 0 */

const execa = require('execa');
const ProgressBar = require('progress');
const rm = require('rimraf');
const mkdirp = require('mkdirp');
const transpileSrc = require('./transpileSrc');

const STEP_WIDTH = 9;
const STEPS = 3;
const options = { stdio: 'pipe', env: { FORCE_COLOR: true } };

const progress = new ProgressBar(
  'Transpiling `src` -> `dist` :bar :percent :dir',
  {
    total: STEP_WIDTH * STEPS,
  },
);

const startTime = new Date();

rm.sync('./dist');
mkdirp.sync('./dist');

const testkit = execa
  .shell(
    'babel testkit --out-dir dist/testkit --copy-files --plugins=@babel/plugin-transform-modules-commonjs',
    {
      ...options,
    },
  )
  .then(() => {
    progress.tick(STEP_WIDTH, {
      dir: 'testkit',
    });
  });

const stories = execa
  .shell(
    'babel stories --out-dir dist/stories --copy-files --plugins=@babel/plugin-transform-modules-commonjs',
    {
      ...options,
    },
  )
  .then(() => {
    progress.tick(STEP_WIDTH, {
      dir: 'stories',
    });
  });

const src = transpileSrc().then(() => {
  progress.tick(STEP_WIDTH, {
    dir: 'src',
  });
});

Promise.all([testkit, stories, src])
  .then(() => {
    console.log(`🚀 Done in ${Math.round(new Date() - startTime) / 1000}s`);
  })
  .catch(error => {
    progress.interrupt('Error');
    return Promise.reject(error);
  });
