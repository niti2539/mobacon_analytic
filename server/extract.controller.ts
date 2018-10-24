
import { Router, Request, Response } from 'express';


const router: Router = Router();

router.post('/softbank/:correlationid', (req: any, res) => {

    const correlationid = req.params.correlationid;

    const html: string = req.rawBody;

    // basic usage
    const pattern = /<em>基本料(.*?)<\s*\/\s*table>/g;

    // ยังพังอยู่เรื่องภาษาญี่ปุ่น
    const match = pattern.exec(html)


    res.json({ 'status': 'OK' });
});

router.post('/docomo/:correlationid', (req: any, res) => {

    const correlationid = req.params.correlationid;

    const html = req.rawBody;



    res.json({ 'status': 'OK' });
});


export const ExtractController: Router = router;