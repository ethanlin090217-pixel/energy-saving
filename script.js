// ===== Constants & helpers =====
const CO2_LB_PER_KWH = 0.92; // pounds CO₂ per kWh

const $ = (id) => document.getElementById(id);

const dollars = (n) =>
  `$${(Number.isFinite(n) ? n : 0).toFixed(2)}`;

const pounds = (n) =>
  `${(Number.isFinite(n) ? n : 0).toFixed(2)} lbs`;

function showError(msg) {
  const box = $('error');

  if (!box) {
    alert(msg);
    return;
  }

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

  // Toggle “days since” visibility
  useDays.addEventListener('change', () => {

    const show = useDays.checked;

    daysWrap.classList.toggle('show', show);

    daysSinceInput.required = show;
  });

  form.addEventListener('submit', (e) => {

    e.preventDefault();

    showError('');

    // ===== Read inputs =====
    const name = ($('appliance-name').value || '').trim();

    const wattageInput = parseFloat($('wattage').value);

    const amps = parseFloat($('amps').value);

    const volts = parseFloat($('volts').value);

    const hoursOff = parseFloat($('hours-off').value);

    const rateInput = parseFloat($('kwh-rate').value);

    // ===== Validation =====
    if (!name) {
      return showError('Please enter an appliance name.');
    }

    if (!Number.isFinite(hoursOff)) {
      return showError('Please enter Hours Reduced Per Day.');
    }

    if (!Number.isFinite(rateInput)) {
      return showError('Please enter your electricity rate.');
    }

    // ===== Determine wattage =====
    let wattage;

    if (
      Number.isFinite(wattageInput) &&
      wattageInput > 0
    ) {

      wattage = wattageInput;

    } else if (
      Number.isFinite(amps) &&
      Number.isFinite(volts) &&
      amps > 0 &&
      volts > 0
    ) {

      wattage = amps * volts;

    } else {

      return showError(
        'Please enter either appliance wattage OR both amps and volts.'
      );
    }

    // ===== Energy calculations =====
    const rate = rateInput;

    const kWhSavedPerDay =
      (wattage * hoursOff) / 1000;

    const dailySavings =
      kWhSavedPerDay * rate;

    const dailyCO2 =
      kWhSavedPerDay * CO2_LB_PER_KWH;

    const li = document.createElement('li');

    // ===== Since-installation mode =====
    const sinceMode = useDays.checked;

    const daysSince =
      parseFloat(daysSinceInput.value);

    if (
      sinceMode &&
      Number.isFinite(daysSince) &&
      daysSince > 0
    ) {

      const totalSavings =
        dailySavings * daysSince;

      const totalCO2 =
        dailyCO2 * daysSince;

      li.innerHTML = `
        <div class="appliance-title">
          ${name}
        </div>

        <div class="savings-big">
          ${dollars(totalSavings)}
        </div>

        <div class="savings-small">
          Total estimated savings over
          ${daysSince.toFixed(0)} days
        </div>

        <div class="co2">
          🌱 CO₂ Avoided:
          <strong>${pounds(totalCO2)}</strong>
        </div>
      `;

    } else {

      // ===== Standard daily/monthly/yearly mode =====
      const monthlySavings =
        dailySavings * 30;

      const yearlySavings =
        dailySavings * 365;

      const monthlyCO2 =
        dailyCO2 * 30;

      const yearlyCO2 =
        dailyCO2 * 365;

      li.innerHTML = `
        <div class="appliance-title">
          ${name}
        </div>

        <div class="savings-big">
          ${dollars(yearlySavings)}/year
        </div>

        <div class="savings-small">
          ${dollars(monthlySavings)}/month<br>
          ${dollars(dailySavings)}/day
        </div>

        <div class="co2">
          🌱 CO₂ Reduction<br>
          ${pounds(yearlyCO2)}/year<br>
          ${pounds(monthlyCO2)}/month
        </div>
      `;
    }

    // ===== Add result card =====
    list.appendChild(li);

    // ===== Reset form =====
    const keepSince = useDays.checked;

    form.reset();

    useDays.checked = keepSince;

    daysWrap.classList.toggle(
      'show',
      keepSince
    );

    daysSinceInput.required = keepSince;
  });
});
