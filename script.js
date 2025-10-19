// Constants
const CO2_LB_PER_KWH = 0.92; // pounds CO₂ per kWh

// Helpers
const $ = (id) => document.getElementById(id);
const dollars = (n) => `$${(Number.isFinite(n) ? n : 0).toFixed(2)}`;
const pounds  = (n) => `${(Number.isFinite(n) ? n : 0).toFixed(2)} lbs`;

document.addEventListener('DOMContentLoaded', () => {
  const form = $('appliance-form');
  const useDays = $('use-days');
  const daysWrap = $('days-wrap');

  // Show/hide "days since" input
  useDays.addEventListener('change', () => {
    daysWrap.classList.toggle('show', useDays.checked);
  });

  // Submit handler
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // prevent page reload

    const name = $('appliance-name').value.trim();
    const wattageInput = parseFloat($('wattage').value);
    const amps = parseFloat($('amps').value);
    const volts = parseFloat($('volts').value);
    const hoursOff = parseFloat($('hours-off').value);
    const rateCents = parseFloat($('kwh-rate').value);

    if (!name || isNaN(hoursOff) || isNaN(rateCents)) {
      alert("Please fill in appliance name, hours off per day, and kWh rate.");
      return;
    }

    // Determine wattage (prefer direct wattage, else amps*volts)
    let wattage = !isNaN(wattageInput) ? wattageInput :
                  (!isNaN(amps) && !isNaN(volts)) ? amps * volts : null;

    if (!wattage || isNaN(wattage)) {
      alert("Please enter either wattage OR both amps and volts.");
      return;
    }

    const rate = rateCents / 100; // cents -> dollars
    const kWhSavedPerDay = (wattage * hoursOff) / 1000;

    const dailySavings = kWhSavedPerDay * rate;
    const dailyCO2 = kWhSavedPerDay * CO2_LB_PER_KWH;

    const li = document.createElement('li');

    // If "since install" checked and valid days provided, show totals
    const daysSince = parseFloat($('days-since').value);
    const useTotals = useDays.checked && !isNaN(daysSince) && daysSince > 0;

    if (useTotals) {
      const totalSavings = dailySavings * daysSince;
      const totalCO2 = dailyCO2 * daysSince;

      li.innerHTML = `
        <strong>${name}</strong><br>
        ⏱️ ${daysSince.toFixed(2)} days since install<br>
        💰 Total Saved: <strong>${dollars(totalSavings)}</strong><br>
        🌱 CO₂ Avoided: <strong>${pounds(totalCO2)}</strong>
      `;
    } else {
      // Original per-day/month/year view
      const monthlySavings = dailySavings * 30;
      const yearlySavings = dailySavings * 365;
      const monthlyCO2 = dailyCO2 * 30;
      const yearlyCO2 = dailyCO2 * 365;

      li.innerHTML = `
        <strong>${name}</strong><br>
        💰 ${dollars(dailySavings)}/day, ${dollars(monthlySavings)}/month, ${dollars(yearlySavings)}/year<br>
        🌱 CO₂ Saved: ${pounds(dailyCO2)}/day, ${pounds(monthlyCO2)}/month, ${pounds(yearlyCO2)}/year
      `;
    }

    $('appliance-list').appendChild(li);

    // Reset, but keep the checkbox state (UX choice: keep or clear—your call)
    const keepUseDays = useDays.checked;
    form.reset();
    useDays.checked = keepUseDays;
    daysWrap.classList.toggle('show', keepUseDays);
  });
});
