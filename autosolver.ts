import fetch from 'node-fetch';
import MongoManager from './mongo';
import * as Captcha from '2captcha';
import FormData from 'form-data';
import { parse } from 'node-html-parser';

export async function solveCode(mongo: MongoManager, code: string, data: any) {
    const csrf = _uuid();
    const csrf2 = "X".repeat(13).replace(/X/g, function () { return Math.round(36 * Math.random()).toString(36) })

    const solver = new Captcha.Solver("b76628c088284ef2342a0cd718e6f711")
    const answer = await solver.recaptcha('6LfZ43cUAAAAAKTRpN6xjp9Fd7nZVDY86nUA-Zmh', data.data.meta.url);

    const formdataobj = {
        "svid": "7Rwd1",
        "initime": "2022-10-12 17:41:33",
        "svend": "thankyou",
        "endsopts": "",
        "mbunq": data.data.data,
        "cus_id": "875",
        "mbr_time": Number(data.data.meta.timestamp),
        "sbj_1005491": ["de"],
        "sbj_1010363": ["opt_1038349"],
        "sbj_1006659": ["prod"],
        "sbj_1005492": ["51"],
        "sbj_1005493": ["875"],
        "sbj_1005494": ["12:59:00"],
        "sbj_1005495": ["2022-10-13"],
        "sbj_1005496": [code.replaceAll('-', '')],
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
    const hash = finalres.data.fileHash;
    const final = (await fetch(`https://mcdonalds.fast-insight.com/voc/bs/v7/germany/webhook?svid=7Rwd1&hash=${hash}&lang=de`, {
        method: 'GET',
        headers: {
            'cookie': 'csrf='+csrf,
            'referer': 'https://voice.fast-insight.com/'
        }
    }));
    const htmlcode = await final.text();
    const root = parse(htmlcode);
    const responsecode = (root.getElementById('lblCode2').innerHTML);
    const params = {
        content: "Code solved: " + responsecode
    }
    fetch("https://discord.com/api/webhooks/761639838084497487/VrHNINGED2Ay_-Zy1Pz5lEVLuYSnn_aozMSM2RrR726nqdj00DtRYub3M3p9eXA4EkvG", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    })
    await mongo.insertCouponCode(code, responsecode)
}

function _uuid() {
    var d = Date.now();

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
    });
};