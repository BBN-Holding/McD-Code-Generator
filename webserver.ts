import expressws from 'express-ws';
import express from 'express';
import MongoManager from './mongo';

(async () => {
    const mongo = new MongoManager('mongodb://172.17.0.4:27017');
    await mongo.connect()

    const app = expressws(express()).app;


    app.use(express.static('./public'));

    app.get('/getcodes/', async (req, res) => {
        res.send(await mongo.getUnusedCodes());
    })

    app.get('/mark/:code', async (req, res) => {
        console.log(req.params.code)
        await mongo.markUsed(req.params.code);
        res.send();
    })

    app.get('/getrandomcode/', async (req, res) => {
        const codes = await mongo.getUnusedCodes();
        const code = codes[Math.floor(Math.random()*codes.length)] as any;
        code['count'] = codes.length;
        res.send(code);
    })

    app.listen(1337);
})()