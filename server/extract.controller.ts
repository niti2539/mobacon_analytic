
import { Router, Request, Response } from 'express';
import libxmljs from 'libxmljs';

const router: Router = Router();

router.post('/softbank/:correlationid', (req, res) => {

    const correlationid = req.params.correlationid;

    const html = req.body;
    const doc = libxmljs.parseXml(html);


    res.json({ 'status': 'OK' });
});

router.post('/docomo/:correlationid', (req, res) => {

    const correlationid = req.params.correlationid;

    const html = req.body;
    const doc = libxmljs.parseXml(html);


    res.json({ 'status': 'OK' });
});


export const ExtractController: Router = router;