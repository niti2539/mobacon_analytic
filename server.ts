import express from 'express';
import bodyParser from 'body-parser';

import { ExtractController } from './server/extract.controller';


const app: express.Application = express();
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


app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`);
});
