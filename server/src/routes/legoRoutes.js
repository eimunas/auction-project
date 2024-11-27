import express from 'express';
import {
    addLego,
    getLegos,
    getSpecificLego,
    updateLego,
    deleteLego,
    addBidToSpecificLego,
    getLegoBids, sseConnect
} from '../controllers/legoController.js';
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get('/legos', getLegos);
router.get('/legos/:id', getSpecificLego);
router.get('/legos/:id/bids', authenticateToken, getLegoBids);
router.get('/legos/:id/monitor', sseConnect);

router.post('/legos', authenticateToken, isAdmin, addLego);
router.post('/legos/:id/bids', authenticateToken, addBidToSpecificLego);

router.put('/legos/:id', authenticateToken, isAdmin, updateLego);
router.delete('/legos/:id', authenticateToken, isAdmin, deleteLego);

export default router;