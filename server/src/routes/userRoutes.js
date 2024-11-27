import express from 'express';
import {
    registerUser,
    getSpecificUser,
    getUserBids,
    loginUser,
    getUserWins
} from '../controllers/userController.js';
import {authenticateToken} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/users', registerUser);
router.post('/tokens', loginUser);

router.get('/users/:id', authenticateToken, getSpecificUser);
router.get('/users/:id/bids', authenticateToken, getUserBids);
router.get('/users/:id/wins', authenticateToken, getUserWins);

export default router;

