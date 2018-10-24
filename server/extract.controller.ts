
import { Router, Request, Response } from 'express';
import { findString } from './string-helper';
import XRegExp from 'xregexp';

const router: Router = Router();

router.post('/softbank/:correlationid', (req: any, res) => {

    const correlationid = req.params.correlationid;

    const html: string = req.rawBody;

    // basic usage
    const buContent = findString(html, '<em>基本料', '</table');
    const a = buContent.split(/<tr>(.*?)<\/tr>/g);
    // const reg = XRegExp('<tr>(?<body>.*?)</tr>', 'gs');
    // const a = reg.exec(`
    // <tr>1</tr>

    // <tr>2</tr>`);


    res.json();
});

router.post('/docomo/:correlationid', (req: any, res) => {

    const correlationid = req.params.correlationid;

    const html = req.rawBody;



    res.json({ 'status': 'OK' });
});


export const ExtractController: Router = router;