const util = require('util');
const path = require('path');
const fsPromises = require('fs').promises;
const childProcess = require('child_process');
const bodyParser = require('body-parser');
const express = require('express');

const database = require('./pkg/database');

const User = database.User;
const readFileAsync = fsPromises.readFile;
const {runRegexInWorker} = require('./pkg/regex');
const execAsync = util.promisify(childProcess.exec);

const host = "0.0.0.0";
const port = 3000;

const app = express();
app.set("trust proxy", 1);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

function commandInjection(arg) {
    const isArg = arg;

    return async (req, resp) => {
        const cmd = req.query.cmd || "echo";
        const payload = req.body.argument;
        const callback = isArg ? JSON.stringify : (v) => v;

        const res = {};
        try {
            const {stdout} = await execAsync(`${cmd} ${callback(payload)} 2>&1`, {
                shell: true,
                stdio: [
                    'inherit',
                    'pipe',
                    'pipe',
                ],
            });
            res['result'] = stdout.toString().trimEnd();
        } catch (ex) {
            res['error'] = ex.message;
            return resp.status(500).json(res);
        }
        resp.status(200).json(res);
    };
}

app.post('/command-injection/argument', commandInjection(true));

app.post('/command-injection/command', commandInjection(false));

app.post('/regex-dos', async (req, resp) => {
    const timeout = req.query.timeout || 10000;
    const payload = req.body.email;
    const regex = /^([a-zA-Z0-9])(([\-.]|[_]+)?([a-zA-Z0-9]+))*(@){1}[a-z0-9]+[.]{1}(([a-z]{2,3})|([a-z]{2,3}[.]{1}[a-z]{2,3}))$/;

    const res = {};
    try {
        res["result"] = await runRegexInWorker(regex, payload, timeout);
    } catch (ex) {
        res["error"] = ex.message;
        return resp.status(500).json(res);
    }
    resp.status(200).json(res);
});

app.get('/path-traversal', async (req, resp) => {
    const payload = req.query.path;

    const res = {};
    try {
        return resp.status(200).send(await readFileAsync(path.join(__dirname, payload)));
    } catch (ex) {
        res["error"] = ex.message;
        return resp.status(500).json(res);
    }
});

app.post('/ssrf', async (req, resp) => {
    const payload = req.body.url;

    const res = {};
    try {
        const response = await fetch(payload);
        res["result"] = await response.text();
    } catch (ex) {
        res["error"] = ex.message;
        return resp.status(500).json(res);
    }
    resp.status(200).json(res);
});

app.post('/nosql-injection', async (req, resp) => {
    const username = req.body.username;
    const password = req.body.password;

    const res = {};
    try {
        res["result"] = await User.find({username, password}).exec();
    } catch (ex) {
        res["error"] = ex.message;
        return resp.status(500).json(res);
    }
    resp.status(200).json(res);
});

app.listen(port, host, async () => {
    await database.init();
    console.log(`Example app listening at http://${host}:${port}`);
});
