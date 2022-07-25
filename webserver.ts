import expressws from 'express-ws';
import express from 'express';
import MongoManager from './mongo';

(async () => {
    const mongo = new MongoManager('mongodb://mongodb:27017');
    await mongo.connect()

    const app = expressws(express()).app;

    app.use(express.static('./public'));

    app.get('/getcodes/', async (req, res) => {
        res.send(await mongo.getUnusedCodes());
    })

    app.patch('/mark/:code', async (req, res) => {
        await mongo.markUsed(req.params.code);
        const params = {
            content: "Code used: " + req.params.code
        }
        fetch("https://discord.com/api/webhooks/761639838084497487/VrHNINGED2Ay_-Zy1Pz5lEVLuYSnn_aozMSM2RrR726nqdj00DtRYub3M3p9eXA4EkvG", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
        res.send();
    })

    app.get('/getrandomcode/', async (req, res) => {
        const codes = await mongo.getUnusedCodes();
        const code = codes[Math.floor(Math.random()*codes.length)] as any;
        code['count'] = codes.length;
        res.send(code);
    })

    app.post('/newcode/:code', async (req, res) => {
        const params = {
            content: "New code: " + req.params.code
        }
        fetch("https://discord.com/api/webhooks/761639838084497487/VrHNINGED2Ay_-Zy1Pz5lEVLuYSnn_aozMSM2RrR726nqdj00DtRYub3M3p9eXA4EkvG", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        })
        res.send();
    })

    app.listen(1337);
})()