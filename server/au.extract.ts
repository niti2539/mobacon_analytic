import { findString } from './string-helper';
import { Billing } from '../shared/billing';
import { getManager } from 'typeorm';

const au = async (req: any, res) => {
  const correlationid = req.params.correlationid;

  const html: string = req.rawBody;

  const extract: any = {};

  let seekPriceTable = false;
  let priceTableMode = false;

  let items: any = [];
  let item: any = {};
  let block;
  let capturing = false;
  html.split(/\n/).forEach(line => {
    line = line.trim();

    const detailItemMatch = /<div class="detail-item(.*?)">/.exec(line);
    if (detailItemMatch) {
      if (detailItemMatch[0].toLowerCase().indexOf('current') !== -1) {
        capturing = true;
        seekPriceTable = false;
        priceTableMode = false;
      } else {
      }
    }

    if (capturing) {
      if (line.startsWith('<p class="detail-title">')) {
        const title = findString(line, '<p class="detail-title">', '</p>');
        if (title) {
          if (seekPriceTable && priceTableMode) {
            if (block) {
              if (!items.find(i => i.date == block.date)) {
                items.push(block);
                capturing = false;
                seekPriceTable = false;
                priceTableMode = false;
              }
            }

            block = {};
            block.date = title;
            block.items = [];

            seekPriceTable = false;
            priceTableMode = false;
          } else {
            if (!block) {
              block = {};
              block.date = title;
              block.items = [];
            }
          }

          if (!seekPriceTable) seekPriceTable = true;
          else priceTableMode = false;
        }
      }

      if (seekPriceTable) {
        if (line.startsWith('<table class="price-table"'))
          priceTableMode = true;
      }

      if (priceTableMode) {
        const key = /<th>(.*?)<\/th>/.exec(line);
        if (key) item.key = key[1].trim();

        let value = /<td>(.*?)<\/td>/.exec(line);
        if (value) {
          item.value = value[1].trim();
          block.items.push(item);
          item = {};
        }
      }
    }
  });

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
};

export { au };
