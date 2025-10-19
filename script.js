document.getElementById("appliance-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const wattInput = parseFloat(document.getElementById("wattage").value);
  const amps = parseFloat(document.getElementById("amps").value);
  const volts = parseFloat(document.getElementById("volts").value);
  const hoursOff = parseFloat(document.getElementById("hoursOff").value);
  const rate = parseFloat(document.getElementById("rate").value) / 100; // convert cents to dollars

  // Calculate wattage
  let wattage = !isNaN(wattInput) ? wattInput : (isNaN(amps) || isNaN(volts)) ? 0 : amps * volts;

  if (isNaN(wattage) || wattage <= 0 || isNaN(hoursOff) || isNaN(rate)) {
    alert("Please enter valid numbers for either wattage or amps+volts, hours, and rate.");
    return;
  }

  // Convert wattage to kWh
  const kWhSavedPerDay = (wattage * hoursOff) / 1000;
  const dailySavings = kWhSavedPerDay * rate;
  const monthlySavings = dailySavings * 30;
  const yearlySavings = dailySavings * 365;

  const listItem = document.createElement("li");
  listItem.textContent = `${name}: $${dailySavings.toFixed(2)}/day, $${monthlySavings.toFixed(2)}/month, $${yearlySavings.toFixed(2)}/year`;

  document.getElementById("appliance-list").appendChild(listItem);

  // Clear inputs
  document.getElementById("appliance-form").reset();
});
