// Get elements
var stateSelect = document.getElementById("stateSelect");
var citySelect = document.getElementById("citySelect");
var findBusBtn = document.getElementById("findBusBtn");
var resultsBox = document.getElementById("resultsBox");
var locationBtn = document.getElementById("useLocationBtn");
var locationStatus = document.getElementById("locationStatus");

// State → City data
var cities = {
    Gujarat: ["Ahmedabad", "Surat", "Vadodara"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur"],
    Delhi: ["New Delhi", "Dwarka", "Rohini"]
};

// Populate cities when state changes
stateSelect.onchange = function () {
    var selectedState = stateSelect.value;

    citySelect.innerHTML = "<option value=''>Select City</option>";
    citySelect.disabled = true;

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

// Fake current location
locationBtn.onclick = function () {
    locationStatus.innerText = "📍 Location detected near City Center";
};

// Find buses
findBusBtn.onclick = function () {

    if (stateSelect.value === "" || citySelect.value === "") {
        alert("Please select both State and City");
        return;
    }

    resultsBox.innerHTML =
        "<h3>Available Buses</h3>" +

        "<div class='bus-card'>" +
        "<strong>Bus No:</strong> 101<br>" +
        "<strong>Route:</strong> " + citySelect.value + " → Destination<br>" +
        "<strong>Arrival:</strong> 10 minutes" +
        "</div>" +

        "<div class='bus-card'>" +
        "<strong>Bus No:</strong> 205<br>" +
        "<strong>Route:</strong> " + citySelect.value + " → Destination<br>" +
        "<strong>Arrival:</strong> 18 minutes" +
        "</div>";
};
