import HttpsProxyAgent from 'https-proxy-agent';
import fs from 'fs';
import { MongoManager } from './mongo';
import { solveCode } from "./autosolver";

const mongo = new MongoManager('mongodb://mongo:27017');

const url = 'https://mcdonalds.fast-insight.com/voc/bs/api/v3/de/checkInvoice'
mongo.connect()

let codeprefixes: string[];
function generateCode() {
    const codeprefix = codeprefixes[ Math.floor(Math.random() * codeprefixes.length) ];
    const code = codeprefix + makeid((12 - codeprefix.length));
    return `${code.substring(0, 4)}-${code.substring(4, 8)}-${code.substring(8, 12)}`
}

function runCheck(agent: any) {
    const code = generateCode();
    const csrf = _uuid();
    const starttime = Date.now();
    fetch(url, {
        method: 'POST',
        // @ts-ignore
        agent,
        headers: {
            'Content-Type': 'application/json',
            'cookie': 'csrf=' + csrf
        },
        body: generateJson(code, csrf)
    }).then(res => {
        res.json().then(async json => {
            console.log(code, json, Date.now() - starttime + 'ms');
            if (json.status === 200) {
                if (await mongo.checkSurveyCode(code)) {
                    await mongo.insertSurveyCode(code)
                    const params = {
                        content: "Code found: " + code
                    }
                    fetch("https://discord.com/api/webhooks/", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(params)
                    })
                    solveCode(mongo, code, json);
                } else {
                    console.log("duplicate detected " + code)
                }
            }
            runCheck(agent)
        }, () => {
            setTimeout(() => {
                runCheck(agent)
            }, 15000)
        })
    }, () => {
        runCheck(agent);
    });
}

getProxies()

async function getProxies() {
    setInterval(async () => {
        if ((await mongo.getUnusedCodes()).length > 100) {
            console.log("too many unused codes");
            process.exit(0);
        }
        codeprefixes = (await mongo.getTemplates()).map(t => t.code);
    }, 10000);
    if ((await mongo.getUnusedCodes()).length < 100) {
        codeprefixes = (await mongo.getTemplates()).map(t => t.code);
        const proxies = fs.readFileSync('proxies.txt').toString().split('\n');
        console.log(`loaded ${proxies.length} proxies`)
        proxies.forEach(async (proxy: any) => {
            const agent = HttpsProxyAgent('http://' + proxy);
            runCheck(agent);
        });
    }
}

function makeid(length: number) {
    var result = '';
    var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

function generateJson(code: string, csrf: string) {
    return JSON.stringify({
        "invoice": code,
        "csrf": csrf,
        "storage_csrf": csrf
    })
}

function _uuid() {
    var d = Date.now();

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
    });
};
