import { legoList } from "../utils/arrayDatabase.js";
import { v4 as uuid } from 'uuid';
import { legoSchema } from "../validationSchemas/shemas.js";
import { validateSchema, findById } from "../utils/utils.js";

let clients = [];

export const sseConnect = (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    clients.push(res);

    req.on('close', () => {
        clients = clients.filter(client => client !== res);
    });
};

const sendBidUpdate = (newBid) => {
    clients.forEach(client => {
        client.write(`data: ${JSON.stringify(newBid)}\n\n`);
    });
};

// GET /legos
export const getLegos = (req, res) => {
    let filteredLegos = legoList;

    if (req.query.searchText) {
        const searchText = req.query.searchText.toLowerCase();
        filteredLegos = filteredLegos.filter(lego =>
            lego.name.toLowerCase().includes(searchText)
        );
    }

    if (req.query.selectedPriceRanges) {
        const selectedPriceRanges = req.query.selectedPriceRanges.split(',');
        filteredLegos = filteredLegos.filter(lego => {
            return selectedPriceRanges.some(range => {
                const [min, max] = range.split('-').map(Number);
                return lego.price >= min && lego.price <= max;
            });
        });
    }

    if (req.query.selectedThemes) {
        const selectedThemes = req.query.selectedThemes.split(',');
        filteredLegos = filteredLegos.filter(lego =>
            selectedThemes.includes(lego.interestTheme)
        );
    }

    if (req.query.selectedInterests) {
        const selectedInterests = req.query.selectedInterests.split(',');
        filteredLegos = filteredLegos.filter(lego =>
            selectedInterests.some(interest =>
                lego.name.toLowerCase().includes(interest.toLowerCase())
            )
        );
    }

    return res.status(200).json({ filteredLegos });
};

// GET /legos/{legoID}
export const getSpecificLego = (req, res) => {
    const lego = findById(legoList, req.params.id);
    if (!lego) {
        return res.status(404).json({ message: `Lego set not found.` });
    }
    return res.status(200).json(lego);
};

// GET /legos/{legoID}/bids
export const getLegoBids = (req, res) => {
    const legoId = req.params.id;
    const legoItem = findById(legoList, legoId);
    if (!legoItem) {
        return res.status(404).json({ error: 'Lego item not found.' });
    }

    const legoBids = legoItem.bids || [];

    legoBids.sort((a, b) => b.amount - a.amount);

    const filteredLegoBids = [];
    let lastBidAmount = null;

    for (const bid of legoBids) {
        if (bid.amount !== lastBidAmount) {
            filteredLegoBids.push(bid);
            lastBidAmount = bid.amount;
        }
    }

    return res.status(200).json(filteredLegoBids);
};

// POST /legos
export const addLego = (req, res) => {
    const validationErrors = validateSchema(req.body, legoSchema);

    if (validationErrors) {
        return res.status(400).json({ error: 'Invalid data!', details: validationErrors });
    }

    const newLego = { id: uuid(), ...req.body };
    legoList.push(newLego);

    res.status(201).json(newLego);
};

// POST /legos/{legoID}/bids
export const addBidToSpecificLego = (req, res) => {
    const legoId = req.params.id;
    const legoItem = findById(legoList, legoId);
    if (!legoItem) {
        return res.status(404).json({ error: 'Lego item not found.' });
    }

    const user = req.user;
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized. Please log in to place a bid.' });
    }

    if (new Date() > new Date(legoItem.deadline) || legoItem.isExpired) {
        return res.status(400).json('The bidding deadline has passed.');
    }

    const newBid = {
        bidID: uuid(),
        legoID: req.params.id,
        userID: user.id,
        amount: req.body.amount,
    };

    if (!legoItem.bids) {
        legoItem.bids = [];
    }

    legoItem.bids.push(newBid);
    sendBidUpdate(newBid);
    return res.status(201).json(newBid.amount);
};

// PUT /legos/{legoID}
export const updateLego = (req, res) => {
    const legoIndex = legoList.findIndex(item => item.id === req.params.id);
    if (legoIndex === -1) {
        return res.status(404).json({ message: 'Lego set not found.' });
    }

    const validationErrors = validateSchema(req.body, { ...legoSchema, required: [] });
    if (validationErrors) {
        return res.status(400).json({ error: validationErrors });
    }

    legoList[legoIndex] = { ...legoList[legoIndex], ...req.body };
    return res.status(200).json(legoList[legoIndex]);
};

// DELETE /legos/{legoID}
export const deleteLego = (req, res) => {
    const legoIndex = legoList.findIndex(item => item.id === req.params.id);
    if (legoIndex === -1) {
        return res.status(404).json({ message: 'Lego set not found.' });
    }

    legoList.splice(legoIndex, 1);
    res.status(204).json(legoList);
};