
import { Router, Request, Response } from 'express';
import { findString } from './string-helper';

const router: Router = Router();

router.post('/softbank/:correlationid', (req: any, res) => {

    const correlationid = req.params.correlationid;

    const html: string = req.rawBody;

    const extract: any = {};

    // basic usage
    const buContent = findString(html, '<em>基本料', '</table');
    const items: any = [];
    let item: any = {};
    buContent.split(/\n/).forEach(line => {
        const key = /<td>(.*?)<\/td>/.exec(line);
        if (key)
            item.key = key[1].trim();
        else {
            let value = /<td(.*?)><span>(.*?)<\/span>/.exec(line);
            if (value) {
                item.value = value[2].trim();
                items.push(item);
                item = {};
            } else {
                value = /<td(.*?)>([+-]?\$?[1-9]\d?(?:,*\d{3})*(?:\.\d{2})?)/.exec(line);
                if (value) {
                    item.value = value[2].trim();
                    items.push(item);
                    item = {};
                }
            }
        }
    });

    extract.basicUsage = items;


    res.json(extract);
});

router.post('/docomo/:correlationid', (req: any, res) => {

    const correlationid = req.params.correlationid;

    const html = req.rawBody;



    res.json({ 'status': 'OK' });
});


export const ExtractController: Router = router;