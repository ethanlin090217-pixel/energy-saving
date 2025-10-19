document.querySelector("button").addEventListener("click", () => {
  const name = document.querySelectorAll("input")[0].value;
  const wattInput = parseFloat(document.querySelectorAll("input")[1].value);
  const amps = parseFloat(document.querySelectorAll("input")[2].value);
  const volts = parseFloat(document.querySelectorAll("input")[3].value);
  const hoursOff = parseFloat(document.querySelectorAll("input")[4].value);
  const rate = parseFloat(document.querySelectorAll("input")[5].value);

  // Calculate watts: prefer direct input, else compute from amps and volts
  let watts = isNaN(wattInput) ? amps * volts : wattInput;

  // Safety check
  if (isNaN(watts) || isNaN(hoursOff) || isNaN(rate)) {
    alert("Please enter valid numbers for all fields.");
    return;
  }

  const dailySavings = (watts / 1000) * hoursOff * rate;
  const monthlySavings = dailySavings * 30;
  const yearlySavings = dailySavings * 365;

  const output = document.createElement("div");
  output.textContent = `${name}: $${dailySavings.toFixed(2)}/day, $${monthlySavings.toFixed(2)}/month, $${yearlySavings.toFixed(2)}/year`;
  output.style.backgroundColor = "#e0f0ff";
  output.style.padding = "10px";
  output.style.margin = "5px 0";

  document.body.appendChild(output);
});
