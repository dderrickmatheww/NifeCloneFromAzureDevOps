const util = require('util');
const exec = util.promisify(require('child_process').exec);
const inquirer = require('inquirer');
const path = require('path');

class Utils {
    constructor() {
        this.functions = {
            build: {
                expo_build: async (isApple) => {
                    this.state.isApple = isApple;
                    const cwd = process.cwd();
                    const cmd =  isApple ? `expo build:ios -t archive` : `expo build:android -t apk`;
                    this.functions.mesc.consoleLog({ msg: 'Build started!' });
                    this.functions.mesc.loader();
                    //await this.functions.build.exec({ cmd, cwd });
                    this.functions.mesc.clearLoader();
                    const answer = await this.functions.mesc.askQuestion({
                        type: 'input',
                        name: 'isFileMoved',
                        message: "Please move the build file produced by expo to the file path MobileAppDevelopment/build/watcher! Enter 'y' or 'yes' when finished!"
                    });
                    if (answer.isFileMoved.toLowerCase() === 'yes' || answer.isFileMoved.toLowerCase() === 'y') {
                        const cmd = `eas submit --platform=${ isApple ? 'ios' : 'android' } --path=${ isApple ? path.resolve('../watcher/ipa', 'Payload.ipa') : path.resolve('../watcher/apk', 'Payload.apk')}`
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
                loader: () => {
                    const P = ['\\', '|', '/', '-'];
                    let x = 0;
                    this.state.loader = setInterval(() => {
                        process.stdout.write(` Building ${ this.state.isApple ? '.ipa' : '.apk' } please wait... \r${P[x++]}`);
                        x %= P.length;
                    }, 250);
                },
                clearLoader: () => {
                    clearInterval(this.state.loader);
                }
            }
        }
        this.state = { 
            loader: null
        }
    }
}
module.exports = Utils;