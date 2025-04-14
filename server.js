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

// Handle POST request to calculate electricity bill
app.post('/calculate', (req, res) => {
  const { units } = req.body;

  // Convert input to number
  const unitsConsumed = parseFloat(units);

  // Check if input is valid
  if (isNaN(unitsConsumed) || unitsConsumed < 0) {
    return res.status(400).json({ error: 'Invalid input. Please enter a valid positive number.' });
  }

  const fixedCost = 300;
  let totalCost = fixedCost;
  let remainingUnits = unitsConsumed;

  // Calculate cost based on slabs
  if (remainingUnits <= 5) {
    totalCost += remainingUnits * 50;
  } else if (remainingUnits <= 10) {
    totalCost += (remainingUnits) * 70 - 100;
  } else if (remainingUnits <= 15) {
    totalCost += (remainingUnits) * 90 - 300;
  } else if (remainingUnits <= 20) {
    totalCost = fixedCost + (remainingUnits-15) * 100 + 1150;
  } else if (remainingUnits <= 25) {
    totalCost = fixedCost + (remainingUnits-20) * 120 + 1750;
  } else if (remainingUnits <= 30) {
    totalCost = fixedCost + (remainingUnits-25) * 150 + 2450;
  } else if (remainingUnits <= 35) {
    totalCost = fixedCost + (remainingUnits-30) * 170 + 3600;
  } else if (remainingUnits <= 39) {
    totalCost = (remainingUnits-35) * 170 + 5250;
  } else if (remainingUnits == 40) {
    totalCost = 6160;
  } else if (remainingUnits <= 50) {
    totalCost = (remainingUnits-41) * 195 + 7795;
  } else if (remainingUnits <= 75) {
    totalCost = fixedCost + (remainingUnits-50) * 225 + 9750;
  } else if (remainingUnits <= 100) {
    totalCost = fixedCost + (remainingUnits-75) * 250 + 15875;
  } else {
    // For values beyond 100, calculate in parts
    // First calculate cost for 100 units
    let costFor100 = fixedCost + 25 * 250 + 13435;
    // Then add cost for remaining units based on first slab
    let extraUnits = remainingUnits - 100;
    if (extraUnits <= 5) {
      totalCost = costFor100 + extraUnits * 50;
    } else if (extraUnits <= 10) {
      totalCost = costFor100 + extraUnits * 70;
    } else if (extraUnits <= 15) {
      totalCost = costFor100 + extraUnits * 90;
    } else {
      totalCost = costFor100 + 5 * 50 + 5 * 70 + 5 * 90 + (extraUnits - 15) * 90;
    }
  }

  // Send the result back to the frontend
  res.json({ 
    units: unitsConsumed,
    fixedCost: fixedCost,
    totalCost: totalCost
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
