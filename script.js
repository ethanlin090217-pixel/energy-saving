document.getElementById('appliance-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get values from form
    const name = document.getElementById('appliance-name').value.trim();
    const wattageInput = parseFloat(document.getElementById('wattage').value);
    const amps = parseFloat(document.getElementById('amps').value);
    const volts = parseFloat(document.getElementById('volts').value);
    const hoursOff = parseFloat(document.getElementById('hours-off').value);
    const rateCents = parseFloat(document.getElementById('kwh-rate').value);

    if (!name || isNaN(hoursOff) || isNaN(rateCents)) {
        alert("Please fill in appliance name, hours off per day, and kWh rate.");
        return;
    }

    // Calculate wattage: use provided or fallback to amps × volts
    let wattage = !isNaN(wattageInput) ? wattageInput :
                  (!isNaN(amps) && !isNaN(volts)) ? amps * volts : null;

    if (!wattage || isNaN(wattage)) {
        alert("Please enter either wattage or both amps and volts.");
        return;
    }

    // Convert rate from cents to dollars
    const rate = rateCents / 100;

    // Calculate daily kWh saved
    const kWhSavedPerDay = (wattage * hoursOff) / 1000;
    const dailySavings = kWhSavedPerDay * rate;
    const monthlySavings = dailySavings * 30;
    const yearlySavings = dailySavings * 365;

    // CO2 savings: 0.92 pounds CO2 per kWh saved
    const dailyCO2 = kWhSavedPerDay * 0.92;
    const monthlyCO2 = dailyCO2 * 30;
    const yearlyCO2 = dailyCO2 * 365;

    // Format savings
    const dollars = amount => `$${amount.toFixed(2)}`;
    const pounds = amount => `${amount.toFixed(2)} lbs`;

    // Display results
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <strong>${name}:</strong> 
        ${dollars(dailySavings)}/day, 
        ${dollars(monthlySavings)}/month, 
        ${dollars(yearlySavings)}/year
        <br>
        CO₂ Saved: 
        ${pounds(dailyCO2)}/day, 
        ${pounds(monthlyCO2)}/month, 
        ${pounds(yearlyCO2)}/year
    `;
    listItem.style.backgroundColor = "#e0f2ff";
    listItem.style.padding = "10px";
    listItem.style.marginTop = "10px";

    document.getElementById('appliance-list').appendChild(listItem);

    // Reset form (except name)
    document.getElementById('appliance-form').reset();
});
