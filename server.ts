import express from 'express';


import bodyParser from 'body-parser';

import { ExtractController } from './server/extract.controller';
import { BillingsController } from './server/billings.controller';


const app: express.Application = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.set('socketio', io);

io.sockets.on("connection", (socket: any) => {
    // Display a connected message
    console.log("Server-Client Connected!");


});

const port: any = process.env.PORT || 3000;

function xmlParser(req: any, res: any, next: any) {
    let data = '';
    req.setEncoding('utf8');
    req.on('data', function (chunk: any) {
        data += chunk;
    });
    req.on('end', function () {
        req.rawBody = data;
        next();
    });
}

app.use(xmlParser);

app.use(bodyParser.json());

app.use('/api/extract', ExtractController);
app.use('/api/billings', BillingsController);


http.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`);
});
