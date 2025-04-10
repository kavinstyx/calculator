const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Serve the static HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle POST request to add two numbers
app.post('/add', (req, res) => {
  const { num1, num2 } = req.body;

  // Convert inputs to numbers
  const number1 = parseFloat(num1);
  const number2 = parseFloat(num2);

  // Check if inputs are valid numbers
  if (isNaN(number1) || isNaN(number2)) {
    return res.status(400).json({ error: 'Invalid input. Please enter valid numbers.' });
  }

  // Perform addition
  const result = number1 + number2;

  // Send the result back to the frontend
  res.json({ result });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});