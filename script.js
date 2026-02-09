// ===== Get elements =====
var stateSelect = document.getElementById("stateSelect");
var citySelect = document.getElementById("citySelect");
var findBusBtn = document.getElementById("findBusBtn");
var resultsBox = document.getElementById("resultsBox");
var locationBtn = document.getElementById("useLocationBtn");
var locationStatus = document.getElementById("locationStatus");
var endLocation = document.getElementById("endLocation");

// ===== State -> City data =====
var cities = {
  Gujarat: ["Ahmedabad", "Surat", "Vadodara"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur"],
  Delhi: ["New Delhi", "Dwarka", "Rohini"]
};

// ===== Demo bus database =====
// Each bus has: busNo, state, city (start city), to (main destination), and "via" (places it crosses)
var busData = [
  { busNo: "101", state: "Gujarat", city: "Ahmedabad", to: "Surat Bus Stand", via: ["Nadiad", "Anand", "Bharuch", "Navsari"] },
  { busNo: "205", state: "Gujarat", city: "Surat", to: "Ahmedabad Bus Stand", via: ["Bardoli", "Vyara", "Nadiad"] },
  { busNo: "330", state: "Gujarat", city: "Vadodara", to: "Surat Bus Stand", via: ["Bharuch", "Ankleshwar", "Kosamba", "Palsana"] },

  { busNo: "501", state: "Maharashtra", city: "Mumbai", to: "Pune Bus Stand", via: ["Navi Mumbai", "Panvel", "Lonavala"] },
  { busNo: "602", state: "Maharashtra", city: "Pune", to: "Mumbai Bus Stand", via: ["Khandala", "Panvel"] },

  { busNo: "901", state: "Delhi", city: "New Delhi", to: "Dwarka Sector 21", via: ["Connaught Place", "Janakpuri"] },
  { busNo: "905", state: "Delhi", city: "Rohini", to: "New Delhi Station", via: ["Pitampura", "Karol Bagh"] }
];

// ===== Helper: small cleanup for matching =====
function cleanText(text) {
  return text.toLowerCase().trim();
}
// ===== Helper: small cleanup for matching =====
function cleanText(text) {
  return text.toLowerCase().trim();
}
// ===== Demo route coordinates per bus (APPROX PATHS) =====
var busRoutes = {
  "101": [
    [21.1702, 72.8311],
    [21.2150, 72.8860],
    [21.7051, 72.9959],
    [22.3072, 73.1812]
  ],
  "205": [
    [22.3072, 73.1812],
    [21.7051, 72.9959],
    [21.2150, 72.8860],
    [21.1702, 72.8311]
  ],
  "330": [
    [22.3072, 73.1812],
    [21.7051, 72.9959],
    [21.1702, 72.8311]
  ]
};

// ===== Populate cities when state changes =====
stateSelect.onchange = function () {
  var selectedState = stateSelect.value;

  citySelect.innerHTML = "<option value=''>Select City</option>";
  citySelect.disabled = true;

  locationStatus.innerText = "";
  resultsBox.innerHTML =
    "<h2 class='card-title'>Results</h2>" +
    "<p class='card-sub'>No buses searched yet.</p>" +
    "<p class='hint'>Tip: After results, we’ll add “View Route on Map” for each bus.</p>";

  if (selectedState !== "") {
    var cityList = cities[selectedState];

    for (var i = 0; i < cityList.length; i++) {
      var option = document.createElement("option");
      option.value = cityList[i];
      option.text = cityList[i];
      citySelect.add(option);
    }

    citySelect.disabled = false;
  }
};

// ===== Fake current location (simple demo) =====
locationBtn.onclick = function () {
  if (citySelect.value === "") {
    locationStatus.innerText = "📍 Please select your city first.";
    return;
  }

  locationStatus.innerText =
    "📍 Location detected near " + citySelect.value + " (Demo)";

  // visually mark button as selected
  locationBtn.classList.add("selected");
};

// ===== Find buses =====
findBusBtn.onclick = function () {
  var selectedState = stateSelect.value;
  var selectedCity = citySelect.value;
  var destination = endLocation.value;

  // Basic validation
  if (selectedState === "" || selectedCity === "") {
    alert("Please select both State and City");
    return;
  }

  if (destination.trim() === "") {
    alert("Please enter destination location");
    return;
  }

  // Filter buses based on selected state + city
  var matchedBuses = [];
  for (var i = 0; i < busData.length; i++) {
    if (busData[i].state === selectedState && busData[i].city === selectedCity) {
      matchedBuses.push(busData[i]);
    }
  }

  // Show results header
  var html =
    "<h2 class='card-title'>Results</h2>" +
    "<p class='card-sub'>From <b>" + selectedCity + "</b> → Searching buses for your destination: <b>" + destination + "</b></p>";

  // If no buses from that city
  if (matchedBuses.length === 0) {
    html += "<p>No buses found from this city in demo data.</p>";
    resultsBox.innerHTML = html;
    return;
  }

  // Check destination matching (simple logic)
  // If destination matches bus "to" or any "via", we mark it as "crosses near"
  var destClean = cleanText(destination);

  for (var j = 0; j < matchedBuses.length; j++) {
    var bus = matchedBuses[j];

    var crosses = false;

    // Check main destination
    if (cleanText(bus.to).indexOf(destClean) !== -1 || destClean.indexOf(cleanText(bus.to)) !== -1) {
      crosses = true;
    }

    // Check via places
    for (var k = 0; k < bus.via.length; k++) {
      if (cleanText(bus.via[k]).indexOf(destClean) !== -1 || destClean.indexOf(cleanText(bus.via[k])) !== -1) {
        crosses = true;
      }
    }

    // Badge
    var badge = crosses
      ? "<span class='tag ok'>✅ Crosses near your destination</span>"
      : "<span class='tag no'>❌ Might not cross your destination</span>";

    html +=
      "<div class='bus-card'>" +
        "<div class='bus-top'>" +
          "<div><b>Bus No:</b> " + bus.busNo + "</div>" +
          badge +
        "</div>" +

        "<div class='bus-line'><b>Route:</b> " + bus.city + " → " + bus.to + "</div>" +
        "<div class='bus-line'><b>Crosses via:</b> " + bus.via.join(", ") + "</div>" +

        "<div class='bus-actions'>" +
        "<button class='mini-btn' onclick=\"showRouteForBus('" + bus.busNo + "');\">View Route</button>"

 +
        "</div>" +
      "</div>";
  }

  resultsBox.innerHTML = html;
};
// ===== MAP LOGIC (DEMO) =====
var map;
var routeLine;
var busMarker;
var destMarker;

function showRouteForBus(busNo) {
  var mapSection = document.getElementById("mapSection");
  mapSection.style.display = "block";

  setTimeout(function () {
    if (!map) {
      map = L.map("map").setView([21.1702, 72.8311], 8);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap"
      }).addTo(map);
    } else {
      map.invalidateSize();
    }

    if (routeLine) map.removeLayer(routeLine);
    if (busMarker) map.removeLayer(busMarker);
    if (destMarker) map.removeLayer(destMarker);

    var routePoints = busRoutes[busNo];
    if (!routePoints) {
      alert("Route not available for this bus in demo.");
      return;
    }

    routeLine = L.polyline(routePoints, { color: "#1177d9", weight: 5 }).addTo(map);
    map.fitBounds(routeLine.getBounds());

    // Bus marker (start of route)
    busMarker = L.marker(routePoints[0]).addTo(map).bindPopup("Bus #" + busNo).openPopup();

    // Destination marker (end of route - demo)
    destMarker = L.marker(routePoints[routePoints.length - 1]).addTo(map).bindPopup("Destination (Demo)");
  }, 100);
}


