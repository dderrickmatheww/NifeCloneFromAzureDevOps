const { spawn } = require("child_process");
const myArgs = process.argv.slice(2);
const arg1 = myArgs[0];
const arg2 = myArgs[1];
const deployObj = {
    OperatingSystem: arg2.toLocaleLowerCase(),
}

switch (arg1) {
    case 'deploy':
        switch (deployObj.OperatingSystem) {
            case 'ios':
                let expoBuild = spawn("expo", [`build:${deployObj.OperatingSystem}`]);
                expoBuild.stdout.on("data", data => {
                    console.log(`stdout: ${data}`);
                });
                expoBuild.stderr.on("data", data => {
                    console.log(`stderr: ${data}`);
                });
                expoBuild.on('error', (error) => {
                    console.log(`error: ${error.message}`);
                });
                expoBuild.on("close", code => {
                    console.log(`child process exited with code ${code}`);
                });
                break;
            case 'android':
                let expoBuild = spawn("expo", [`build:${deployObj.OperatingSystem}`]);
                expoBuild.stdout.on("data", data => {
                    console.log(`stdout: ${data}`);
                });
                
                expoBuild.stderr.on("data", data => {
                    console.log(`stderr: ${data}`);
                });
                
                expoBuild.on('error', (error) => {
                    console.log(`error: ${error.message}`);
                });
                
                expoBuild.on("close", code => {
                    console.log(`child process exited with code ${code}`);
                });
                break;
            default:
                console.log(`
                ****************************************************************
                ****************************************************************
                **   The second argument didn't match one of the following:   **
                **       - 'ios'                                              **
                **       - 'andriod'                                          **
                ****************************************************************
                ****************************************************************
                `);
                break;
        }
        break;
    default:
        console.log(`
        ****************************************************************
        ****************************************************************
        **    The first argument didn't match one of the following:   **
        **       - 'deploy'                                           **
        ****************************************************************
        ****************************************************************
        `);
        break;
}