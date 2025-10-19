document.getElementById("appliance-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const inputs = e.target.elements;
    const name = inputs[0].value || "Appliance";
    const wattsInput = parseFloat(inputs[1].value);
    const amps = parseFloat(inputs[2].value);
    const volts = parseFloat(inputs[3].value);
    const hours = parseFloat(inputs[4].value);
    const rate = parseFloat(inputs[5].value) / 100; // convert ¢ to $

    // Only calculate watts if not provided
    let watts = !isNaN(wattsInput) ? wattsInput : (isNaN(amps) || isNaN(volts)) ? NaN : amps * volts;

    // Validation: all of these must be valid numbers
    if (isNaN(watts) || isNaN(hours) || isNaN(rate)) {
        alert("⚠️ Please enter either valid Wattage or Amps+Volts, plus valid Hours and kWh rate.");
        return;
    }

    // Calculate energy and cost
    const daily = (watts * hours / 1000) * rate;
    const monthly = daily * 30;
    const yearly = daily * 365;

    const result = `${name}: $${daily.toFixed(2)}/day, $${monthly.toFixed(2)}/month, $${yearly.toFixed(2)}/year`;

    const listItem = document.createElement("li");
    listItem.textContent = result;
    listItem.style.backgroundColor = "#e6f2ff";
    listItem.style.padding = "8px";
    listItem.style.marginTop = "4px";
    document.getElementById("appliance-list").appendChild(listItem);

    e.target.reset();
});
