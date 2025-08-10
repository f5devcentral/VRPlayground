const path = require('path');
const {Worker} = require('worker_threads');

function runRegexInWorker(regex, input, timeout) {
    return new Promise((resolve, reject) => {
        const worker = new Worker(path.join(__dirname, 'workers', 'regex.js'));
        worker.postMessage({regex, input});

        // Set a timeout to terminate the worker
        const timeoutId = setTimeout(() => {
            worker.terminate();
            reject(new Error('Regex operation timed out'));
        }, timeout);

        worker.on('message', ({result, error}) => {
            clearTimeout(timeoutId);
            if (error) {
                reject(new Error(error));
            } else {
                resolve(result);
            }
        });

        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`));
            }
        });
    });
}

module.exports = {
    runRegexInWorker,
}
