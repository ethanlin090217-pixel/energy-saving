// ===== Constants & helpers =====
const CO2_LB_PER_KWH = 0.92; // pounds CO₂ per kWh
const $ = (id) => document.getElementById(id);
const dollars = (n) => `$${(Number.isFinite(n) ? n : 0).toFixed(2)}`;
const pounds  = (n) => `${(Number.isFinite(n) ? n : 0).toFixed(2)} lbs`;

function showError(msg) {
  const box = $('error');
  if (!box) return alert(msg);
  box.textContent = msg || '';
  box.style.display = msg ? 'block' : 'none';
}

// ===== Main =====
document.addEventListener('DOMContentLoaded', () => {
  const form = $('appliance-form');
  const useDays = $('use-days');
  const daysWrap = $('days-wrap');
  const daysSinceInput = $('days-since');
  const list = $('appliance-list');

  // Toggle “days since” input visibility + required flag
  useDays.addEventListener('change', () => {
    const show = useDays.checked;
    daysWrap.classList.toggle('show', show);
    daysSinceInput.required = show;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // stop page reload
    showError('');      // clear any old error

    // Read inputs safely
    const name = ($('appliance-name').value || '').trim();
    const wattageInput = parseFloat($('wattage').value);
    const amps  = parseFloat($('amps').value);
    const volts = parseFloat($('volts').value);
    const hoursOff = parseFloat($('hours-off').value);
    const rateCents = parseFloat($('kwh-rate').value);

    if (!name) return showError('Please enter an appliance name.');
    if (!Number.isFinite(hoursOff)) return showError('Please enter Hours Off Per Day.');
    if (!Number.isFinite(rateCents)) return showError('Please enter your kWh rate in cents.');

    // ✅ Fixed: determine wattage correctly
    let wattage;
    if (Number.isFinite(wattageInput) && wattageInput > 0) {
      wattage = wattageInput;
    } else if (Number.isFinite(amps) && Number.isFinite(volts) && amps > 0 && volts > 0) {
      wattage = amps * volts;
    } else {
      showError('Please enter either wattage OR both amps and volts.');
      return;
    }

    const rate = rateCents / 100; // cents → dollars
    const kWhSavedPerDay = (wattage * hoursOff) / 1000; // kWh/day
    const dailySavings = kWhSavedPerDay * rate;
    const dailyCO2 = kWhSavedPerDay * CO2_LB_PER_KWH;

    const li = document.createElement('li');

    // Handle “since installation” mode
    const sinceMode = useDays.checked;
    const daysSince = parseFloat(daysSinceInput.value);

    if (sinceMode && Number.isFinite(daysSince) && daysSince > 0) {
      const totalSavings = dailySavings * daysSince;
      const totalCO2 = dailyCO2 * daysSince;
      li.innerHTML = `
        <strong>${name}</strong><br>
        ⏱️ ${daysSince.toFixed(2)} days since install<br>
        💰 Total Saved: <strong>${dollars(totalSavings)}</strong><br>
        🌱 CO₂ Avoided: <strong>${pounds(totalCO2)}</strong>
      `;
    } else {
      // Standard per-day/month/year output
      const monthlySavings = dailySavings * 30;
      const yearlySavings  = dailySavings * 365;
      const monthlyCO2 = dailyCO2 * 30;
      const yearlyCO2  = dailyCO2 * 365;

      li.innerHTML = `
        <strong>${name}</strong><br>
        💰 ${dollars(dailySavings)}/day, ${dollars(monthlySavings)}/month, ${dollars(yearlySavings)}/year<br>
        🌱 CO₂ Saved: ${pounds(dailyCO2)}/day, ${pounds(monthlyCO2)}/month, ${pounds(yearlyCO2)}/year
      `;
    }

    list.appendChild(li);

    // Reset form but keep checkbox visibility
    const keepSince = useDays.checked;
    form.reset();
    useDays.checked = keepSince;
    daysWrap.classList.toggle('show', keepSince);
    daysSinceInput.required = keepSince;
  });
});
