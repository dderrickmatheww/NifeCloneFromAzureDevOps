const myArgs = process.argv.slice(2);
const arg1 = myArgs[0];
const arg2 = myArgs[1];
const _utils = require('./utils');
const utils = new _utils();
const deployObj = {
    OperatingSystem: arg2.toLocaleLowerCase(),
}

switch (arg1) {
    case 'deploy':
        switch (deployObj.OperatingSystem) {
            case 'ios':
                utils.functions.build.expo_build({ isApple: true });
                break;
            case 'android':
                utils.functions.build.expo_build({ isApple: false });
                break;
            case 'both':
                utils.functions.build.expo_build({ both: true });
                break;
            default:
                utils.functions.mesc.consoleLog({ msg: `The second argument didn't match one of the following:
                    - 'ios'
                    - 'andriod'
                    - 'both'`});
                break;
        }
        break;
    default:
        utils.functions.mesc.consoleLog({ msg: `The first argument didn't match one of the following:
             - 'deploy'` });
        break;
}