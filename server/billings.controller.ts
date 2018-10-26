
import { Router, Request, Response } from 'express';

const router: Router = Router();

router.get('/:correlationid', (req: any, res) => {
    res.json([
        {
            softbank: [
                {
                    key: '通話定額基本料［　８月２１日～　９月２０日］',
                    value: 4200
                }, {
                    key: 'スマ放題　専用２年契約',
                    value: -1500
                }
            ]
        },
        {
            docomo: [
                {
                    key: '通話定額基本料［　８月２１日～　９月２０日］',
                    value: 4200
                }, {
                    key: 'スマ放題　専用２年契約',
                    value: -1500
                }
            ]
        }
    ]);
});



export const BillingsController: Router = router;