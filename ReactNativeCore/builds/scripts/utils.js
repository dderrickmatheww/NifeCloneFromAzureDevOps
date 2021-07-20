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
                    console.log('Build started!');
                    const cwd = process.cwd();
                    const build = isApple ? `expo build:ios` : `expo build:android`;
                    const submit = `eas submit --platform=ios --path=${ isApple ? path.resolve('../watcher/', 'Payload.ipa') : path.resolve('../watcher/', 'Payload.apk')}`;
                    await this.functions.build.exec({ build, cwd });
                    const answer = await utils.functions.mesc.askQuestion({
                        type: 'input',
                        name: 'isFileMoved',
                        message: "Please move the build file produced by expo to the file path MobileAppDevelopment/build/watcher! Enter 'y' or 'yes' when finished!"
                    });
                    if (answer.isFileMoved.toLowerCase() === 'yes' || answer.isFileMoved.toLowerCase() === 'y') {
                        await this.functions.build.exec({ submit, cwd });
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
                    const { stdout, stderr } = await exec(cmd, { "cwd":  cwd });
                    console.log(stdout);
                    console.log(stderr);
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
                }
            }
        }
        this.state = { }
    }
}
module.exports = Utils;