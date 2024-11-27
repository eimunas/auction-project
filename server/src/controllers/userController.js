import {userList, ADMIN_EMAIL, ADMIN_PASSWORD, legoList} from "../utils/arrayDatabase.js";
import { v4 as uuid } from 'uuid';
import { userSchema } from "../validationSchemas/shemas.js";
import { validateSchema, findById } from "../utils/utils.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const SECRET = 'my_secret';

// GET /users/{userID}
export const getSpecificUser = (req, res) => {
    const user = findById(userList, req.params.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }
    return res.status(200).json(user);
};

// --------- BIDS ---------

// GET /users/{userID}/bids
export const getUserBids = (req, res) => {
    const userId = req.params.id;
    const user = findById(userList, userId);
    const userBids = user.bids || [];
    if (userBids.length === 0) {
        return res.status(404).json({ error: 'No bids found for this user.' });
    }
    return res.status(200).json(userBids);
};

export const getUserWins = (req, res) => {
    const userId = req.params.id;
    const user = userList.find(user => user.id === userId);

    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    const currentTime = new Date();
    user.wins = user.wins || [];

    for (const lego of legoList) {
        const deadline = new Date(lego.deadline);

        if (currentTime >= deadline && lego.bids && lego.bids.length > 0) {
            const sortedBids = lego.bids.sort((a, b) => b.amount - a.amount);
            const highestBid = sortedBids[0];

            const alreadyWon = user.wins.some(win => win.legoName === lego.name);
            if (highestBid.userID === userId && !alreadyWon) {
                user.wins.push({
                    winId: uuid(),
                    legoName: lego.name,
                    legoPrice: highestBid.amount,
                });
            }
        }
    }

    const totalAmount = user.wins.reduce((sum, win) => sum + win.legoPrice, 0);
    return res.status(200).json({ wins: user.wins, totalAmount: totalAmount });
};

// POST /users (registration)
export const registerUser = async (req, res) => {
    const { name, email, password, isAdmin } = req.body;
    const validationErrors = validateSchema(req.body, userSchema);
    if (validationErrors) {
        return res.status(400).json({ error: 'Invalid data!', details: validationErrors });
    }

    const existingUser = userList.find(user => user.email === email);
    if (existingUser) {
        return res.status(403).json({ error: 'Email already exists!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: uuid(), name, email, password: hashedPassword, isAdmin: isAdmin || false };
    userList.push(newUser);

    return res.status(201).json(newUser);
};

// POST /tokens (login)
export const loginUser = (req, res) => {
    const { email, password } = req.body;

    const user = userList.find(user => user.email === email);
    if (!user) {
        return res.status(400).json({ error: 'Invalid email or password.' });
    }

    if (user.email === ADMIN_EMAIL && password === ADMIN_PASSWORD && user.isAdmin) {
        const token = jwt.sign({ id: user.id, name: user.name, isAdmin: user.isAdmin }, SECRET, { expiresIn: '1h' });
        return res.status(200).json({ token, isAdmin: user.isAdmin });
    }

    const isPasswordValid = bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id, name: user.name, isAdmin: user.isAdmin }, SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, isAdmin: user.isAdmin });
};