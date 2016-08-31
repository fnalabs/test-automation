import PACKAGE from './package';

import gulp from 'gulp';
import loadPlugins from 'gulp-load-plugins';

/*******************************************************************************
 * Contants
 ******************************************************************************/

// Tasks (prefixes, types, and suffixes)
const BUILD = 'build:';
const LINT = 'lint:';
const RUN = 'run:';

const GULPFILE = 'gulpfile';
const SCRIPTS = 'scripts';

// Build Config
const OUTPUT = './dist';
const SRC_SCRIPTS = './src/**/*.js';
const SRC_GULPFILE = `${GULPFILE}.babel.js`;
const SRC_PACKAGE = './package.json';

// Gulp + Plugins, etc.
const $ = loadPlugins();
const envCheck = process.env.NODE_ENV === 'production';

/*******************************************************************************
 * Utility method(s)
 ******************************************************************************/
function calculateVersion(bump) {
    let ver = PACKAGE.version.split('.');
    let pre = ver[2].split('-');

    switch (bump) {
        case 'MAJOR':
            ver[0]++;
            break;

        case 'MINOR':
            ver[1]++;
            break;

        case 'PATCH':
            ver[2] = pre.length > 1 ? pre[0]++ : ver[2]++;
            break;

        case 'PRERELEASE':
            ver[2] = pre.length > 1 ? `${pre[0]}-${++pre[1]}` : `${ver[2]}-1`;
            break;

        default:
    }

    if (bump !== 'PRERELEASE' && pre.length > 1) {
        ver[2] = pre[0];
    }

    return ver.join('.');
}

/*******************************************************************************
 * Lint method(s)
 ******************************************************************************/
function lintJS(src, cacheKey) {
    return gulp.src(src)
        .pipe($.cached(cacheKey))
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe($.if(envCheck, $.eslint.failOnError()))
        .pipe($.remember(cacheKey));
}

/*******************************************************************************
 * Build method(s)
 ******************************************************************************/
function buildJS() {
    return gulp.src(SRC_SCRIPTS)
        .pipe($.sourcemaps.init())
        .pipe($.babel())
        .pipe($.uglify())
        .pipe($.sourcemaps.write('maps'))
        .pipe(gulp.dest(OUTPUT));
}

/*******************************************************************************
 * Runner(s)
 ******************************************************************************/
function runWatch() {
    gulp.watch(SRC_GULPFILE, [`${LINT}${GULPFILE}`]);
    gulp.watch(SRC_SCRIPTS, [`${RUN}${SCRIPTS}`]);
}

function runPublish() {
    const bump = $.util.env.bump;

    if (bump) {
        const newVer = calculateVersion(bump);

        return gulp.src(SRC_PACKAGE)
            .pipe($.bump({ type: newVer }))
            .pipe(gulp.dest('./'))
            .pipe($.git.add())
            .pipe($.git.commit(`bumping ${bump} version release of v${newVer}`))
            .pipe($.git.tag(`v${newVer}`, `tagging ${bump} version release of v${newVer}`))
            .pipe($.git.push());
    }

    return $.util.log('You forgot to provide a version bump...');
}

/*******************************************************************************
 * Tasks
 ******************************************************************************/

// main task runners
gulp.task('default', [
    `${LINT}${GULPFILE}`,
    `${RUN}${SCRIPTS}`
], runWatch);
gulp.task('publish', [`${RUN}${SCRIPTS}`], runPublish);

// run sequences
gulp.task(`${RUN}${SCRIPTS}`, [
    `${LINT}${SCRIPTS}`,
    `${BUILD}${SCRIPTS}`
]);

// lint-specific tasks
gulp.task(`${LINT}${GULPFILE}`, lintJS.bind(null, SRC_GULPFILE, GULPFILE));
gulp.task(`${LINT}${SCRIPTS}`, lintJS.bind(null, SRC_SCRIPTS, SCRIPTS));

// build-specific tasks
gulp.task(`${BUILD}${SCRIPTS}`, [`${LINT}${SCRIPTS}`], buildJS);
