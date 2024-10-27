const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

//const app = express();
//const port = 3000;

// Middleware to parse JSON bodies
router.use(bodyParser.json());

// Convert Celsius to Fahrenheit
function celsiusToFahrenheit(celsius) {
  return (celsius * 9/5) + 32;
}

// Convert Fahrenheit to Celsius
function fahrenheitToCelcius(fahrenheit) {
  return (fahrenheit-32)* 5/9;
}

// API endpoint for converting Celsius to Fahrenheit
router.post('/api/convert/c2f', (req, res) => {
  const { celsius } = req.body;

  if (typeof celsius !== 'number') {
    return res.status(400).json({ error: 'Invalid input. Celsius must be a number.' });
  }

  const fahrenheit = celsiusToFahrenheit(celsius);
  res.json({ fahrenheit });
});

// API endpoint for converting Fahrenheit to Celsius
router.post('/api/convert/f2c', (req, res) => {
  const { fahrenheit } = req.body;

  if (typeof fahrenheit !== 'number') {
    return res.status(400).json({ error: 'Invalid input. Fahrenheit must be a number.' });
  }

  const celsius = fahrenheitToCelcius(fahrenheit);
  res.json({ celsius });
});

module.exports = router;

// Start the server
/*app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});*/
