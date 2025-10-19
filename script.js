document.getElementById("appliance-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const wattsInput = parseFloat(document.getElementById("watts").value);
    const amps = parseFloat(document.getElementById("amps").value);
    const volts = parseFloat(document.getElementById("volts").value);
    const hours = parseFloat(document.getElementById("hours").value);
    const rate = parseFloat(document.getElementById("rate").value);

    if (!name || isNaN(hours) || isNaN(rate)) {
        alert("Please enter valid inputs for appliance name, hours, and rate.");
        return;
    }

    let watts = 0;
    if (!isNaN(wattsInput)) {
        watts = wattsInput;
    } else if (!isNaN(amps) && !isNaN(volts)) {
        watts = amps * volts;
    } else {
        alert("Please enter either wattage or both amps and volts.");
        return;
    }

    // Calculate daily energy savings in kWh
    const kWhSavedPerDay = (watts * hours) / 1000;

    // Cost savings
    const costPerkWh = rate / 100;
    const dailySavings = kWhSavedPerDay * costPerkWh;
    const monthlySavings = dailySavings * 30;
    const yearlySavings = dailySavings * 365;

    // CO2 emissions savings
    const lbsCO2PerkWh = 0.92;
    const dailyCO2 = kWhSavedPerDay * lbsCO2PerkWh;
    const monthlyCO2 = dailyCO2 * 30;
    const yearlyCO2 = dailyCO2 * 365;

    const listItem = document.createElement("li");
    listItem.innerHTML = `
        <strong>${name}</strong>: 
        $${dailySavings.toFixed(2)}/day, 
        $${monthlySavings.toFixed(2)}/month, 
        $${yearlySavings.toFixed(2)}/year<br>
        🌱 CO₂ Saved: ${dailyCO2.toFixed(2)} lbs/day, 
        ${monthlyCO2.toFixed(2)} lbs/month, 
        ${yearlyCO2.toFixed(2)} lbs/year
    `;
    document.getElementById("appliance-list").appendChild(listItem);

    // Clear form
    e.target.reset();
});
