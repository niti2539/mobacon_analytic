import { findString } from './string-helper';
import { Billing } from '../shared/billing';
import { getManager } from 'typeorm';

const au = async (req: any, res) => {

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
}

export { au };