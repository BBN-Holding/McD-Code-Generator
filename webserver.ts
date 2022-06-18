import expressws from 'express-ws';
import express from 'express';
import MongoManager from './mongo';

(async () => {
    const mongo = new MongoManager('mongodb://127.0.0.1:27017');
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

    app.listen(1337);
})()