
import { Router, Request, Response } from 'express';
import { getManager } from 'typeorm';
import { Billing } from '../shared/billing';

const router: Router = Router();

router.get('/:id', async (req: any, res) => {

    const billingRepo = getManager().getRepository(Billing);

    try {
        let billing = await billingRepo.findOne(req.params.id)
        res.json(billing);
    } catch (error) {
        res.status(404).json({ error: `billing id: ${req.params.id} not found` });
    }


});



export const BillingsController: Router = router;