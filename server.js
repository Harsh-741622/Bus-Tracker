// Import express (basic)
const express = require("express");

// Create app
const app = express();

// Port number
const PORT = 3000;

// Allow frontend to talk to backend
app.use(express.json());

// ---------------- FAKE BUS DATA ----------------

// Simple bus data (NO database)
const buses = [
  {
    number: "Bus 101",
    from: "Ahmedabad",
    to: "Surat",
    current: "Nadiad",
    time: "15 minutes"
  },
  {
    number: "Bus 205",
    from: "Surat",
    to: "Vadodara",
    current: "Bharuch",
    time: "20 minutes"
  },
  {
    number: "Bus 309",
    from: "Vadodara",
    to: "Ahmedabad",
    current: "Anand",
    time: "10 minutes"
  }
];

// ---------------- API ROUTE ----------------

// Get buses based on start and destination
app.get("/buses", function (req, res) {
  const start = req.query.start;
  const end = req.query.end;

  // Filter matching buses
  const result = buses.filter(function (bus) {
    return bus.from === start && bus.to === end;
  });

  res.json(result);
});

// ---------------- START SERVER ----------------

app.listen(PORT, function () {
  console.log("Server running on http://localhost:" + PORT);
});