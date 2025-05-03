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
  const { units, previousDue = 0, previousPaid = 0, previousCharge = 0 } = req.body;

  // Convert inputs to numbers
  const unitsConsumed = parseFloat(units);
  const prevDue = parseFloat(previousDue);
  const prevPaid = parseFloat(previousPaid);
  const prevCharge = parseFloat(previousCharge);

  // Check if input is valid
  if (isNaN(unitsConsumed) || unitsConsumed < 0) {
    return res.status(400).json({ error: 'Invalid input. Please enter a valid positive number for units. (වලංගු නොවන ආදානයකි. කරුණාකර ඒකක සඳහා වලංගු ධනාත්මක අංකයක් ඇතුළත් කරන්න.)' });
  }

  const fixedCost = 300;
  let baseCost = fixedCost;
  let remainingUnits = unitsConsumed;

  // Calculate cost based on slabs
  if (remainingUnits <= 5) {
    baseCost += remainingUnits * 50;
  } else if (remainingUnits <= 10) {
    baseCost += (remainingUnits) * 70 -100;
  } else if (remainingUnits <= 15) {
    baseCost += (remainingUnits) * 90 -300;
  } else if (remainingUnits <= 20) {
    baseCost = fixedCost + (remainingUnits-15) * 100 + 1150;
  } else if (remainingUnits <= 25) {
    baseCost = fixedCost + (remainingUnits-20) * 120 + 1750;
  } else if (remainingUnits <= 30) {
    baseCost = fixedCost + (remainingUnits-25) * 150 + 2450;
  } else if (remainingUnits <= 35) {
    baseCost = fixedCost + (remainingUnits-30) * 170 + 3600;
  } else if (remainingUnits <= 39) {
    baseCost = (remainingUnits-35) * 170 + 5250;
  } else if (remainingUnits == 40) {
    baseCost = 6160;
  } else if (remainingUnits <= 50) {
    baseCost = (remainingUnits-41) * 195 + 7795;
  } else if (remainingUnits <= 75) {
    baseCost = fixedCost + (remainingUnits-50) * 225 + 9750;
  } else if (remainingUnits <= 100) {
    baseCost = fixedCost + (remainingUnits-75) * 250 + 15875;
  } else {
    // For values beyond 100, calculate in parts
    // First calculate cost for 100 units
    let costFor100 = fixedCost + 25 * 250 + 13435;
    // Then add cost for remaining units based on first slab
    let extraUnits = remainingUnits - 100;
    if (extraUnits <= 5) {
      baseCost = costFor100 + extraUnits * 50;
    } else if (extraUnits <= 10) {
      baseCost = costFor100 + extraUnits * 70;
    } else if (extraUnits <= 15) {
      baseCost = costFor100 + extraUnits * 90;
    } else {
      baseCost = costFor100 + 5 * 50 + 5 * 70 + 5 * 90 + (extraUnits - 15) * 90;
    }
  }

  // Calculate adjustment based on previous due amount
  let adjustmentAmount = 0;
  let totalCost = 0;
  
  if (prevDue > 0) {
    // If previous due is positive:
    // multiply Charging for Previous Month by 0.02, 
    // then add that value and totalCost and Previous Due Amount, 
    // and then subtract it by Previous Paid Amount
    adjustmentAmount = (prevDue - prevCharge) * 0.02;
    totalCost = baseCost + adjustmentAmount + prevDue - prevPaid;
  } else {
    // If Previous Due Amount is negative or zero:
    // multiply Charging for Previous Month by 0.05, 
    // then subtract that value from totalCost, 
    // add Previous Due Amount, and then subtract it by Previous Paid Amount
    adjustmentAmount = prevCharge * 0.05;
    totalCost = baseCost - adjustmentAmount + prevDue - prevPaid;
  }

  // Send the result back to the frontend
  res.json({ 
    units: unitsConsumed,
    fixedCost: fixedCost,
    baseCost: baseCost,
    previousDue: prevDue,
    previousPaid: prevPaid,
    previousCharge: prevCharge,
    adjustmentAmount: adjustmentAmount,
    totalCost: totalCost
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
