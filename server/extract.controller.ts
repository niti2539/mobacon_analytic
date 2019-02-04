
import { Router, Request, Response } from 'express';
import { findString } from './string-helper';
import { Billing } from '../shared/billing';
import { getManager } from 'typeorm';
import { ymobile } from './ymobile.extract';
import { au } from './au.extract';

const router: Router = Router();

router.post('/softbank/:correlationid', async (req: any, res) => {

    const correlationid = req.params.correlationid;

    const html: string = req.rawBody;

    const extract: any = {};

    // basic usage
    const buContent = findString(html, '<em>基本料', '</table');
    let items: any = [];
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

    // communication fee
    const comFeeContent = findString(html, '<em>通信料', '</table');
    items = [];
    item = {};
    comFeeContent.split(/\n/).forEach(line => {
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
    extract.communicationFee = items;


    // communication fee
    const optionContent = findString(html, '<em id="option-services">オプションサービス料', '</table');
    items = [];
    item = {};
    optionContent.split(/\n/).forEach(line => {
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
    extract.optionServiceCharge = items;

    // communication fee
    const universalContent = findString(html, '<em>ユニバーサルサービス料</em>', '</table');
    items = [];
    item = {};
    universalContent.split(/\n/).forEach(line => {
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
    extract.universalServiceFee = items;

    // discount
    const discountContent = findString(html, '<em>割引</em>', '</table');
    items = [];
    item = {};
    discountContent.split(/\n/).forEach(line => {
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
    extract.discount = items;



    const billingRepo = getManager().getRepository(Billing);

    let billing: any = {
        userId: correlationid,
        createdDate: new Date(),
        data: extract
    };

    await billingRepo.save(billing);

    let message: any = {
        userId: correlationid,
        billingUrl: `/api/billings/${billing.id}`,
        createdDate: billing.createdDate
    };

    const io = req.app.get('socketio');
    io.emit('billing.new', message);
    res.json(message);
});

router.post('/docomo/:correlationid', (req: any, res) => {

    const correlationid = req.params.correlationid;

    const html = req.rawBody;



    res.json({ 'status': 'OK' });
});

router.post('/kddi/:correlationid', async (req: any, res) => {

    const correlationid = req.params.correlationid;

    const html: string = req.rawBody;

    const extract: any = {};


    // basic usage
    const buContent = findString(html, '<h1>今月及び前月のデータ通信量</h1>', '<div class="leadSection');
    let items: any = [];
    let item: any;
    let block: any;

    buContent.split(/\n/).forEach(line => {

        line = line.trim();
        if (line.startsWith('<h4>')) {
            if (block) {

                if (item) {
                    block.items.push(item);
                    item = undefined;
                }

                items.push(block);
            }

            block = {};
            block.date = findString(line, '<h4>', '</h4>');
            block.items = [];
        } else {
            if (line.startsWith('<div class="cell alignR">')) {
                let val = findString(line, '<div class="cell alignR">', '</div>');
                if (item.value)
                    val += '|' + val;
                else
                    item.value = '';

                item.value += val;

            } else {
                let key = findString(line, '<div class="cell item">', '</div>');
                if (key) {

                    if (item) {
                        block.items.push(item);
                        item = undefined;
                    }

                    if (!item) {
                        item = {
                            key: key
                        };
                    }
                }
            }
        }

    });

    if (item) {
        block.items.push(item);
    }

    items.push(block);

    extract.basicUsage = items;

    const billingRepo = getManager().getRepository(Billing);

    let billing: any = {
        userId: correlationid,
        createdDate: new Date(),
        data: extract
    };

    await billingRepo.save(billing);

    let message: any = {
        userId: correlationid,
        billingUrl: `/api/billings/${billing.id}`,
        createdDate: billing.createdDate
    };

    const io = req.app.get('socketio');
    io.emit('billing.new', message);
    res.json(message);
});

router.post('/ymobile/:correlationid', ymobile);
router.post('/au/:correlationid', au);

export const ExtractController: Router = router;