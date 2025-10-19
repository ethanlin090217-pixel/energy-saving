(function () {
  const CO2_LB_PER_KWH = 0.92; // pounds CO₂ per kWh
  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  function byId(id) { return document.getElementById(id); }

  document.addEventListener('DOMContentLoaded', () => {
    const form = byId('appliance-form');
    const modeEl = byId('output-mode');
    const customBox = byId('custom-period');

    // Toggle custom-period fields
    modeEl.addEventListener('change', () => {
      customBox.classList.toggle('hidden', modeEl.value !== 'custom');
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = byId('appliance-name').value.trim();
      const wattageInput = parseFloat(byId('wattage').value);
      const amps = parseFloat(byId('amps').value);
      const volts = parseFloat(byId('volts').value);
      const hoursOff = parseFloat(byId('hours-off').value);
      const rateCents = parseFloat(byId('kwh-rate').value);
      const mode = modeEl.value;

      if (!name || isNaN(hoursOff) || isNaN(rateCents)) {
        alert("Please fill in appliance name, hours off per day, and kWh rate.");
        return;
      }

      // Determine wattage
      let wattage = !isNaN(wattageInput) ? wattageInput :
                    (!isNaN(amps) && !isNaN(volts)) ? amps * volts : null;

      if (!wattage || isNaN(wattage)) {
        alert("Please enter either wattage or both amps and volts.");
        return;
      }

      const rate = rateCents / 100;  // cents -> dollars

      // Daily kWh saved (based on unplug schedule)
      const kWhSavedPerDay = (wattage * hoursOff) / 1000;
      const dailySavings = kWhSavedPerDay * rate;
      const dailyCO2 = kWhSavedPerDay * CO2_LB_PER_KWH;

      // helpers
      const dollars = amt => `$${amt.toFixed(2)}`;
      const pounds = amt => `${amt.toFixed(2)} lbs`;

      const li = document.createElement('li');

      if (mode === 'rates') {
        const monthlySavings = dailySavings * 30;
        const yearlySavings = dailySavings * 365;
        const monthlyCO2 = dailyCO2 * 30;
        const yearlyCO2 = dailyCO2 * 365;

        li.innerHTML = `
          <strong>${name}</strong><br>
          💰 ${dollars(dailySavings)}/day, ${dollars(monthlySavings)}/month, ${dollars(yearlySavings)}/year<br>
          🌱 CO₂ Saved: ${pounds(dailyCO2)}/day, ${pounds(monthlyCO2)}/month, ${pounds(yearlyCO2)}/year
        `;
      } else {
        // Custom period calculations
        const startVal = byId('start-dt').value;
        const endVal = byId('end-dt').value;

        if (!startVal) {
          alert("Please provide a Start date/time for Custom Period.");
          return;
        }

        const start = new Date(startVal);
        const end = endVal ? new Date(endVal) : new Date();

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          alert("Invalid start or end date/time.");
          return;
        }
        if (end < start) {
          alert("End must be after Start.");
          return;
        }

        // Exact elapsed days (fractional)
        const elapsedDays = (end.getTime() - start.getTime()) / MS_PER_DAY;

        const totalSavings = dailySavings * elapsedDays;
        const totalCO2 = dailyCO2 * elapsedDays;

        const fmtDT = d => d.toLocaleString([], { hour12: true });
        const spanStr = `${fmtDT(start)} → ${fmtDT(end)} (${elapsedDays.toFixed(2)} days)`;

        li.innerHTML = `
          <strong>${name}</strong><br>
          ⏱️ Period: ${spanStr}<br>
          💰 Total Saved: <strong>${dollars(totalSavings)}</strong><br>
          🌱 CO₂ Avoided: <strong>${pounds(totalCO2)}</strong>
        `;
      }

      byId('appliance-list').appendChild(li);

      // Reset the form but keep the selected mode & visibility
      const keepMode = modeEl.value;
      form.reset();
      modeEl.value = keepMode;
      customBox.classList.toggle('hidden', keepMode !== 'custom');
    });
  });
})();

