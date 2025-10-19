// ===== Constants & helpers =====
const CO2_LB_PER_KWH = 0.92; // pounds CO₂ per kWh
const $ = (id) => document.getElementById(id);
const dollars = (n) => `$${(Number.isFinite(n) ? n : 0).toFixed(2)}`;
const pounds  = (n) => `${(Number.isFinite(n) ? n : 0).toFixed(2)} lbs`;

function showError(msg) {
  const box = $('error');
  box.textContent = msg || '';
  box.style.display = msg ? 'block' : 'none';
}

// ===== Main =====
document.addEventListener('DOMContentLoaded', () => {
  // prove JS loaded
  const status = $('status');
  if (status) status.textContent = 'JavaScript loaded ✔';

  const form = $('appliance-form');
  const useDays = $('use-days');
  const daysWrap = $('days-wrap');
  const daysSinceInput = $('days-since');
  const list = $('appliance-list');

  // Toggle days input visibility + required flag
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
    const wattageInput = Number($('wattage').value);
    const amps  = Number($('amps').value);
    const volts = Number($('volts').value);
    const hoursOff = Number($('hours-off').value);
    const rateCents = Number($('kwh-rate').value);

    if (!name) return showError('Please enter an appliance name.');
    if (!Number.isFinite(hoursOff)) return showError('Please enter Hours Off Per Day.');
    if (!Number.isFinite(rateCents)) return showError('Please enter your kWh rate in cents.');

    // Determine wattage: prefer direct wattage, else amps * volts
    let wattage = Number.isFinite(wattageInput) ? wattageInput
               : (Number.isFinite(amps) && Number.isFinite(volts)) ? amps * volts
               : NaN;

    if (!Number.isFinite(wattage) || wattage <= 0) {
      return showError('Enter either Wattage, or both Amps and Volts (all > 0).');
    }
    if (hoursOff < 0) return showError('Hours Off Per Day must be ≥ 0.');
    if (rateCents < 0) return showError('kWh rate (cents) must be ≥ 0.');

    // If "since install" mode enabled, validate daysSince
    const sinceMode = useDays.checked;
    let daysSince = null;
    if (sinceMode) {
      daysSince = Number(daysSinceInput.value);
      if (!Number.isFinite(daysSince) || daysSince <= 0) {
        return showError('Please enter a valid number of days since installation (> 0).');
      }
    }

    // Calculations
    const rate = rateCents / 100; // cents -> dollars
    const kWhSavedPerDay = (wattage * hoursOff) / 1000; // kWh/day
    const dailySavings = kWhSavedPerDay * rate;
    const dailyCO2 = kWhSavedPerDay * CO2_LB_PER_KWH;

    // Build list item
    const li = document.createElement('li');

    if (sinceMode) {
      const totalSavings = dailySavings * daysSince;
      const totalCO2 = dailyCO2 * daysSince;

      li.innerHTML = `
        <strong>${name}</strong><br>
        ⏱️ ${daysSince.toFixed(2)} days since install<br>
        💰 Total Saved: <strong>${dollars(totalSavings)}</strong><br>
        🌱 CO₂ Avoided: <strong>${pounds(totalCO2)}</strong>
      `;
    } else {
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

    // Append
    list.appendChild(li);

    // Reset but preserve sinceMode checkbox visibility
    const keepSince = useDays.checked;
    form.reset();
    useDays.checked = keepSince;
    daysWrap.classList.toggle('show', keepSince);
    daysSinceInput.required = keepSince;
  });
});
