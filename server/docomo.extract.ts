import { findString } from './string-helper';
import { Billing } from '../shared/billing';
import { getManager } from 'typeorm';

const docomo = async (req: any, res) => {
  const correlationid = req.params.correlationid;

  const html: string = req.rawBody;

  const extract: any = {};

  let items: any = [];
  let item: any = {};
  let block;
  block = {};

  block.items = [];

  html.split(/\n/).forEach(line => {
    line = line.trim();
    const title = /<span class="card-ico-charge(.*?)">(.*?)<\/span>/.exec(line);
    if (title) {
      block.date = title[2].trim();
      return;
    }

    const total = /<span id="mydcm_payment_amount-09-02" class="card-t-number t-bold">(.*?)<\/span>/.exec(
      line
    );
    if (total) {
      item.key = '税込';
      item.value = total[1].trim();
      block.items.push(item);
      item = {};
    }
  });

  const paymentDetail = findString(
    html,
    '<div id="mydcm_payment_detail-02">',
    '</body>'
  );

  paymentDetail.split(/\n/).forEach(line => {
    line = line.trim();

    if (true) {
      const key = /<(span|dt) class="mydcm_payment_detail-name(.*?)">(.*?)<\/(span|dt)>/.exec(
        line
      );
      if (key) {
        item.key = key[3].trim();
      }

      if (item.key) {
        let value = /<(span|dd) class="mydcm_payment_detail_amount(.*?)">(.*?)<\/(span|dd)>/.exec(
          line
        );
        if (value) {
          item.value = value[3].trim();

          block.items.push(item);
          item = {};
        }
      }
    }
  });

  extract.basicUsage = block;

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

export { docomo };
