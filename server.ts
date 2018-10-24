import express from 'express';
import bodyParser from 'body-parser';

import { ExtractController } from './server/extract.controller';


const app: express.Application = express();
const port: any = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use('/api/extract', ExtractController);


app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`);
});
