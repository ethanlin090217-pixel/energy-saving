document.getElementById("appliance-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const wattsInput = parseFloat(document.getElementById("watts").value);
  const amps = parseFloat(document.getElementById("amps").value);
  const volts = parseFloat(document.getElementById("volts").value);
  const hours = parseFloat(document.getElementById("hours").value);
  const rate = parseFloat(document.getElementById("rate").value);

  // Basic required validation
  if (!name || isNaN(hours) || isNaN(rate)) {
    alert("Please enter appliance name, hours, and kWh rate.");
    return;
  }

  let watts = 0;
  if (!isNaN(wattsInput)) {
    watts = wattsInput;
  } else if (!isNaN(amps) && !isNaN(volts)) {
    watts = amps * volts;
  } else {
    alert("Enter either wattage or both amps and volts.");
    return;
  }

  const kWhRate = rate / 100;
  const kWhSavedPerDay = (watts * hours) / 1000;
  const dailySavings = kWhSavedPerDay * kWhRate;
  const monthlySavings = dailySavings * 30;
  const yearlySavings = dailySavings * 365;

  // CO2 emissions savings (EPA standard: 0.92 lbs CO2 per kWh)
  const CO2_PER_KWH = 0.92;
  const dailyCO2 = kWhSavedPerDay * CO2_PER_KWH;
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

  // Reset form
  e.target.reset();
});
