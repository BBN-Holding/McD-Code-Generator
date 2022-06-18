import { Actions, Builder, By, until, WebElement } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import fetch from 'node-fetch';
import MongoManager from './mongo';
import * as Captcha from '2captcha';
import FormData from 'form-data';
/*
export async function solveCode(code: string) {
    const csrf = _uuid();
    const data = await (await fetch('https://mcdonalds.fast-insight.com/voc/bs/api/v3/de/checkInvoice', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'cookie': 'csrf=' + csrf
        },
        body: generateJson(code, csrf)
    }) as any).json();
    console.log(data);

    fetch('https://voice.fast-insight.com/api/v1/s/visit/time?svid=7Rwd1', {

    })

    const csrf2 = "X".repeat(13).replace(/X/g, function () { return Math.round(36 * Math.random()).toString(36) })
    const solver = new Captcha.Solver("b76628c088284ef2342a0cd718e6f711")
    const answer = await solver.recaptcha('6LfZ43cUAAAAAKTRpN6xjp9Fd7nZVDY86nUA-Zmh', data.data.meta.url);
    console.log(answer);

    const formdataobj = {
        "svid": "7Rwd1",
        "initime": "2022-06-13 17:41:33",
        "svend": "thankyou",
        "endsopts": "",
        "mbunq": data.data.data,
        "cus_id": "875",
        "mbr_time": data.data.meta.timestamp,
        "sbj_1005491": ["de"],
        "sbj_1010363": ["opt_1038349"],
        "sbj_1006659": ["prod"],
        "sbj_1005492": ["51"],
        "sbj_1005493": ["875"],
        "sbj_1005494": ["12:59:00"],
        "sbj_1005495": ["2022-06-13"],
        "sbj_1005496": ["b1qfqs0aylpj"],
        "sbj_1005497": ["26"],
        "sbj_1010048": ["Undetected"],
        "sbj_1010049": ["Undetected"],
        "sbj_1005498": ["opt_1018721"],
        "sbj_1005499": ["opt_1018725"],
        "sbj_1010450": ["opt_1038582"],
        "sbj_1005538": [1],
        "sbj_1005539": [1],
        "sbj_1005502": ["opt_1018742"],
        "sbj_1005540": [1],
        "sbj_1005504": ["opt_1018752", "opt_1018751"],
        "sbj_1005541": [4],
        "sbj_1005542": [3],
        "sbj_1005509": ["opt_1018785"],
        "sbj_1008297": ["opt_1029628"],
        "sbj_1008298": ["opt_1029631"],
        "sbj_1005522": ["opt_1018852"],
        "sbj_1005523": ["vieles"],
        "sbj_1010316": [4],
        "sbj_1005526": ["opt_1018861"],
        "sbj_1005527": ["opt_1018862"],
        "sbj_1005528": ["opt_1018867"],
        "sbj_1005529": ["opt_1018877"],
        "sbj_1005530": ["opt_1018882"],
        "sbj_1005531": ["opt_1018885"]
    }

    const formdata = new FormData();
    formdata.append('ansobj', JSON.stringify(formdataobj));
    formdata.append('csrftoken', csrf2);
    formdata.append('re_captcha', answer.data);

    const finalres = await (await fetch('https://voice.fast-insight.com/api/v1/s/submit', {
        method: 'POST',
        headers: {
            'cookie': 'csrftoken='+csrf2
        },
        // @ts-ignore
        body: formdata
    })).json()
    console.log(finalres);
    const hash = finalres.data.fileHash;
    const final = (await fetch(`https://mcdonalds.fast-insight.com/voc/bs/v7/germany/webhook?svid=7Rwd1&hash=${hash}&lang=de`, {
        method: 'GET',
        headers: {
            'Host': 'mcdonalds.fast-insight.com',
            'cookie': 'csrf='+csrf,
            'referer': 'https://voice.fast-insight.com/'
        }
    }));
    console.log(await final.text())
}
solveCode('b1qf-qfqj-odp6')
//console.log(_uuid())
function generateJson(code: string, csrf: string) {
    return JSON.stringify({
        "invoice": code,
        "meta":
        {
            "env": "production", "country": "de", "lang": "de", "isFromApp": false, "userInformation":
                { "firstname": "", "lastname": "", "deviceId": "", "deviceToken": "" },
            "products": "Undetected", "amountSpend": "Undetected"
        },
        //"csrf": "ec54cfb2-5089-47b0-b1c7-782570854447"
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
*/
export async function solveCode(mongo: MongoManager, code: string) {

    let options = new chrome.Options().addExtensions('./buster_captcha_solver-1.3.1.crx').addArguments('--disable-web-security');
    const solver = new Captcha.Solver("<Your 2captcha api key>")

    let driver = new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    const steps = [optionZero,
        fiveStars,
        fiveStars,
        fiveStars,
        fiveStars,
        fiveStars,
        optionZero,
        optionOne,
        optionZero,
        typeShit,
        fiveStars,
        optionOne,
        optionOne,
        select,
        select,
        optionZero,
        optionZero
    ]
    const csrf = _uuid();
    await fetch('https://mcdonalds.fast-insight.com/voc/bs/api/v3/de/checkInvoice', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'cookie': 'csrf=' + csrf
        },
        body: generateJson(code, csrf)
    }).then(res => res.json()).then(async json => {
        const url = json.data.meta.url
        await driver.get(url);
        await driver.wait(until.elementLocated(By.xpath('/html/body/section[1]/div/form/div[2]/div[5]')));
        await wait(5000);
        for (const step of steps) {
            await step();
            await wait(100);
            await next();
            await wait(500);
        }
        /*await driver.switchTo().frame(await driver.findElement(By.xpath('/html/body/section[1]/div/form/div/div[1]/div[2]/div/div/iframe')));
        await wait(100);
        await (await driver.findElement(By.id('recaptcha-anchor'))).click();
        await wait(1500);
        if (!(await driver.executeScript<string>("return document.querySelector('#recaptcha-accessible-status').innerHTML")).includes('verified')) {
            const answer = await solver.recaptcha('6LfZ43cUAAAAAKTRpN6xjp9Fd7nZVDY86nUA-Zmh', await driver.executeScript<string>('return document.URL'));
            answer.data
        }
        await driver.switchTo().defaultContent();
        await wait(500);
        await driver.findElement(By.xpath('/html/body/section[1]/div/form/div/div[3]/button')).click();
        await driver.wait(until.urlContains('https://analytics.internationalservicecheck.com/McDVoucherWeb/default.aspx'));
        await wait(1000);
        const responsecode = (await (await driver.findElement(By.xpath('//*[@id="lblCode1"]'))).getText());
        console.log('got code '+responsecode);
        await mongo.insertCouponCode(code, responsecode)
*/
        /* const solver = new Captcha.Solver("b76628c088284ef2342a0cd718e6f711")
        
        const answer = await solver.recaptcha('6LfZ43cUAAAAAKTRpN6xjp9Fd7nZVDY86nUA-Zmh', json.data.meta.url);
        driver.executeScript("document.querySelector('#g-recaptcha-response').textContent='"+answer.data+"'");
        await (await driver.findElement(By.xpath('//*[@id="survey-form"]'))).submit()
         */
        /*await wait(500);
        await driver.findElement(By.xpath('/html/body/section[1]/div/form/div/div[3]/button')).click();*/
        await driver.wait(until.urlContains('https://analytics.internationalservicecheck.com/McDVoucherWeb/default.aspx'));
        await wait(1000);
        const responsecode = (await (await driver.findElement(By.xpath('//*[@id="lblCode1"]'))).getText());
        console.log('got code ' + responsecode);
        await mongo.insertCouponCode(code, responsecode)
        driver.close();
    })

    async function select() {
        await (await driver.findElement(By.xpath('/html/body/section[1]/div/form/div[2]/div[5]/div/select'))).sendKeys('1');
    }

    async function typeShit() {
        await (await driver.findElement(By.xpath('/html/body/section[1]/div/form/div[2]/div[5]/div/input'))).sendKeys('Allen');
    }

    async function optionZero() {
        await option(0)
    }

    async function optionOne() {
        await option(1)
    }

    async function option(index: number) {
        (await (await driver.findElement(By.xpath('/html/body/section[1]/div/form/div[2]/div[5]'))).findElements(By.className('option')))[index].click();
    }

    async function fiveStars() {
        (await driver.findElement(By.xpath('/html/body/section[1]/div/form/div[2]/div[5]/div/div[1]/div[5]'))).click();
    }

    async function next() {
        (await driver.findElement(By.xpath('//*[@id="next-sbj-btn"]'))).click();
    }

    //driver.get('https://mcdonalds.fast-insight.com/voc/de/de');

    // https://voice.fast-insight.com/s/7Rwd1/f/f559806e2e35a4ecae2fbd05d7add3d1?lang=de&timestamp=1655125140&csn25=ivse&csn118=ivse_opt_1038583&mbunq=eyJpdiI6InRqcVREZURoZHVpMEk5c01JTGZid2c9PSIsInZhbHVlIjoiU0NjMlIwN09HWU9TWjNNUFgxMjJ5SGxoXC9OV09XTFZ1cEU0Tmt4SmI0aEk9IiwibWFjIjoiYmQzZDEzMDkwMGQwMTIwYWU4MGI1OTFmMTk0ODI4MTkxODA0OTdlNjU5ZjQ4NDU5YWIyYzRiMDYyZTBkNGZjNCJ9&bgurl=https://s3-eu-west-1.amazonaws.com/automation.isc-mcd.svy.do--voc/public/de/bg-main.jpg

    function wait(ms: number) {
        return new Promise<void>((resolve) => {
            setTimeout(() => resolve(), ms);
        })
    }

    function generateJson(code: string, csrf: string) {
        return JSON.stringify({
            "invoice": code,
            "meta":
            {
                "env": "production", "country": "de", "lang": "de", "isFromApp": false, "userInformation":
                    { "firstname": "", "lastname": "", "deviceId": "", "deviceToken": "" },
                "products": "Undetected", "amountSpend": "Undetected"
            },
            //"csrf": "ec54cfb2-5089-47b0-b1c7-782570854447"
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
}
const mongo = new MongoManager('mongodb://127.0.0.1:27017')
mongo.connect().then(async () => {
    while (true) {
        const codes = await mongo.getUnSolved()
        const index = Math.round(Math.random() * codes.length);
        console.log('using code: '+codes[index])
        await solveCode(mongo, codes[index].survey_code);
    }
})


