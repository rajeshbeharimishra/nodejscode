const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

//const app = express();
//const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
router.use(bodyParser.json());

// Route to calculate simple interest and final amount
router.post('/calculate', (req, res) => {
    const { principal, rate, time } = req.body;

    if (!principal || !rate || !time) {
        return res.status(400).json({ error: 'Missing required fields: principal, rate, time' });
    }
	if (typeof principal !== 'number') {
		return res.status(400).json({ error: 'Invalid input. Principal Amount must be a number.' });
	}
	if (typeof rate !== 'number') {
		return res.status(400).json({ error: 'Invalid input. Rate of Interest must be a number.' });
	}
	if (typeof time !== 'number') {
		return res.status(400).json({ error: 'Invalid input. Rate of Interest must be a number.' });
	}
	if (principal <= 0 || rate <= 0 || time <= 0) {
        return res.status(400).json({ error: 'Invalid input. Principal, rate, and time must be greater than zero.' });
    }
	

    const simpleInterest = (principal * rate * time) / 100;
    const finalAmountSI = principal + simpleInterest;
	const compoundInterest= principal * Math.pow((1 + rate / 100), time) - principal;
	const finalAmountCI = principal + compoundInterest;

    res.json({ simpleInterest, finalAmountSI, compoundInterest, finalAmountCI });
});

module.exports = router;
// Start the server
/*app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});*/