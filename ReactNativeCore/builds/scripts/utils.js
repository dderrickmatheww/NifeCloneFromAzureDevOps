const util = require('util');
const exec = util.promisify(require('child_process').exec);
const inquirer = require('inquirer');
const path = require('path');
require('dotenv').config();

class Utils {
    constructor() {
        this.functions = {
            build: {
                expo_build: async ({ isApple, both }) => {
                    const cwd = process.cwd();
                    let cmd;
                    if (both) {
                        this.state.both = both;
                        cmd = [`expo build:ios -t archive`, `expo build:android -t apk`];
                    }
                    else {
                        this.state.isApple = isApple;
                        cmd =  isApple ? `expo build:ios -t archive` : `expo build:android -t apk`;
                    }
                    this.functions.mesc.consoleLog({ msg: 'Build started!' });
                    this.functions.mesc.loader({ msg: `Building ${ this.state.isApple ? '.ipa' : both ? 'both an .ipa (iOS) & .apk (android)' : '.apk' }` });
                    if (typeof cmd == 'string') {
                        await this.functions.build.exec({ cmd, cwd });
                    }
                    else {
                        cmd.forEach(async (cmd) => { await this.functions.build.exec({ cmd, cwd }); });
                    }
                    this.functions.mesc.clearLoader();
                    const answer = await this.functions.mesc.askQuestion({
                        type: 'input',
                        name: 'isFileMoved',
                        message: `Please move the build file produced by expo to the file path MobileAppDevelopment/ReactNativeCore/build/watcher/${ isApple ? 'ipa' : both ? 'ipa & /apk' : 'apk' }! Enter 'y' or 'yes' when finished`
                    });
                    if (answer.isFileMoved.toLowerCase() === 'yes' || answer.isFileMoved.toLowerCase() === 'y') {
                        this.functions.build.cmd()
                        const cmd = this.functions.build.cmd();
                        await this.functions.build.exec({ cmd, cwd });
                    }
                    else if (answer.isFileMoved.toLowerCase() === 'no' || answer.isFileMoved.toLowerCase() === 'n') {
                        return false;
                    }
                    else {
                        console.log('You entered an invalid selection. Please enter one of the following: [ yes, y, no, n ]');
                        this.functions.build.expo_build(isApple);
                    }
                },
                exec: async ({ cmd, cwd }) => { 
                    try {
                        const { stdout, stderr } = await exec(cmd, { "cwd":  cwd });
                        console.log(stdout);
                        console.log(stderr);
                    }
                    catch (err) {
                        this.functions.mesc.consoleLog({ msg: err });
                    }
                },
                cmd: () => {
                    let cmd = '';
                    const { isApple, both } = this.state;
                    let cmds = [
                        ` SET EXPO_APPLE_APP_SPECIFIC_PASSWORD=${process.env.EXPO_APPLE_APP_SPECIFIC_PASSWORD}`,
                        ' eas submit',
                        ' --platform=', 
                        ' --path=', 
                        ' --bundle-identifier='
                    ];
                    const appleCmds = [
                        ' --apple-id=',
                        ' --apple-team-id=',
                        ' --asc-app-id=',
                        ' --non-interactive'
                    ];
                    const androidCmds = [

                    ]
                    cmds = isApple ? [...cmds, ...appleCmds ] : [...cmds, ...androidCmds ];
                    for (let i = 0; i < cmds.length; i++) {
                        let task = cmds[i];
                        switch (task) {
                            case `SET EXPO_APPLE_APP_SPECIFIC_PASSWORD=${process.env.EXPO_APPLE_APP_SPECIFIC_PASSWORD}`:
                                cmd += task;
                                break;
                            case ` eas submit`:
                                cmd += task;
                                break;
                            case ' --platform=': 
                                task = task + (isApple ? 'ios' : 'android');
                                cmd += task;
                                break;
                            case ' --path=':
                                task = task + `${(isApple ? path.resolve('./builds/watcher/ipa', 'Payload.ipa') : path.resolve('../builds/watcher/apk', 'Payload.apk'))}`;
                                cmd += task;
                                break;
                            case ' --bundle-identifier=':
                                task = task + 'com.nifellc.nife';
                                cmd += task;
                                break;
                            case ' --apple-id=':
                                task = task + 'dev@nife.app';
                                cmd += task;
                                break;
                            case ' --apple-team-id=':
                                task = task + 'J3L62BUD28';
                                cmd += task;
                                break;
                            case ' --asc-app-id=':
                                task = task + '1565886883'
                                cmd += task;
                                break;
                            // case 'EXPO_APPLE_APP_SPECIFIC_PASSWORD=': 
                            //     console.log(process.env.EXPO_APPLE_APP_SPECIFIC_PASSWORD);
                            //     task = task + process.env.EXPO_APPLE_APP_SPECIFIC_PASSWORD;
                            //     task += cmd;
                            //     cmd = task;
                            //     break;
                            default:
                                break;
                        }
                    }
                    console.log(cmd);
                    return cmd;
                }
            },
            deploy: {

            },
            mesc: {
                askQuestion: async ({ type, name, message }) => {
                    return await inquirer.prompt([
                        {
                            type: type,
                            name: name,
                            message: message,
                        }
                    ]);
                },
                consoleLog: ({ msg }) => {
                    console.log(`
${ msg }
                    `);
                },
                loader: ({ msg }) => {
                    const P = [
                        `${ msg } please wait... \\`, 
                        `${ msg } please wait... |`, 
                        `${ msg } please wait... /`, 
                        `${ msg } please wait... -`];
                    let x = 0;
                    this.state.loader = setInterval(() => {
                        process.stdout.write(`\r${P[x++]}`);
                        x %= P.length;
                    }, 250);
                },
                clearLoader: () => {
                    clearInterval(this.state.loader);
                }
            }
        }
        this.state = { 
            loader: null,
            isApple: false,
            both: false
        }
    }
}
module.exports = Utils;