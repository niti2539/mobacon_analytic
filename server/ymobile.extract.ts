import { findString } from './string-helper';
import { Billing } from '../shared/billing';
import { getManager } from 'typeorm';

const ymobile = async (req: any, res) => {
  const correlationid = req.params.correlationid;

  const html: string = req.rawBody;

  const extract: any = {};

  // basic usage
  const billingContent = findString(
    html,
    '<div id="bills">',
    '<div id="information">'
  );

  const buContent = findString(
    billingContent,
    '<h5 class="clearfix"><span class="name">基本料',
    '<h5 class="clearfix"'
  );
  let items: any = [];
  let item: any = {};
  buContent.split(/\n/).forEach(line => {
    const key = /<th>(.*?)<\/th>/.exec(line);
    if (key) item.key = key[1].trim();
    else {
      let value = /<td(.*?)><span>(.*?)<\/span>/.exec(line);
      if (value) {
        item.value = value[2].trim();
        items.push(item);
        item = {};
      } else {
        value = /<td(.*?)>([+-]?\$?[0-9]\d?(?:,*\d{3})*(?:\.\d{2})?)/.exec(
          line
        );
        if (value) {
          item.value = value[2].trim();
          items.push(item);
          item = {};
        }
      }
    }
  });

  billingContent.split(/\n/).forEach(line => {
    line = line.trim();
    const total = /<span class="total"><strong>(.*?)<\/strong> 円<\/span>/.exec(
      line
    );
    if (total) {
      items.push({
        key: 'total',
        value: total[1].trim()
      });
    }
  });

  extract.basicUsage = items;

  const dataContent = findString(
    billingContent,
    '<h5 class="clearfix"><span class="name">データ定額料',
    '<h5 class="clearfix"'
  );
  items = [];
  item = {};
  dataContent.split(/\n/).forEach(line => {
    const key = /<th>(.*?)<\/th>/.exec(line);
    if (key) item.key = key[1].trim();
    else {
      let value = /<td(.*?)><span>(.*?)<\/span>/.exec(line);
      if (value) {
        item.value = value[2].trim();
        items.push(item);
        item = {};
      } else {
        value = /<td(.*?)>([+-]?\$?[0-9]\d?(?:,*\d{3})*(?:\.\d{2})?)/.exec(
          line
        );
        if (value) {
          item.value = value[2].trim();
          items.push(item);
          item = {};
        }
      }
    }
  });
  extract.dataUsage = items;
  const commContent = findString(
    billingContent,
    '<h5 class="clearfix"><span class="name">通話料',
    '<h5 class="clearfix"'
  );
  items = [];
  item = {};
  commContent.split(/\n/).forEach(line => {
    const key = /<th>(.*?)<\/th>/.exec(line);
    if (key) item.key = key[1].trim();
    else {
      let value = /<td(.*?)><span>(.*?)<\/span>/.exec(line);
      if (value) {
        item.value = value[2].trim();
        items.push(item);
        item = {};
      } else {
        value = /<td(.*?)>([+-]?\$?[0-9]\d?(?:,*\d{3})*(?:\.\d{2})?)/.exec(
          line
        );
        if (value) {
          item.value = value[2].trim();
          items.push(item);
          item = {};
        }
      }
    }
  });
  extract.communicationFee = items;

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

export { ymobile };
