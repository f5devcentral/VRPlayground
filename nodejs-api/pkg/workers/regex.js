const {parentPort} = require('worker_threads');

parentPort.on('message', ({regex, input}) => {
    try {
        // Execute the regex operation
        const result = regex.test(input);
        parentPort.postMessage({result});
    } catch (error) {
        // Handle any errors
        parentPort.postMessage({error: error.message});
    }
});
