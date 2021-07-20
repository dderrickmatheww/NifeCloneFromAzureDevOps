const Utils = require('./utils');
(async () => { 
    const utils = new Utils();
    const answer = await utils.functions.mesc.askQuestion({
        type: 'input',
        name: 'os',
        message: "What operating system are we building for?"
    });
    process.chdir('../../ReactNativeCore');
    if (answer.os.toLowerCase() === 'ios' || answer.os.toLowerCase() === 'apple') {
        utils.functions.build.expo_build(true);
    }
    else if (answer.os.toLowerCase() === 'android' || answer.os.toLowerCase() === 'google') {
        utils.functions.build.expo_build(false);
    }
    else {
        console.log(`You must provider a valid command! 
                        - ios
                        - apple
                        - android
                        - google`);
    }
})();