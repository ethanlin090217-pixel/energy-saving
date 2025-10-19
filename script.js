
document.getElementById('appliance-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('appliance-name').value;
    const watts = parseFloat(document.getElementById('watts').value);
    const amps = parseFloat(document.getElementById('amps').value);
    const hours = parseFloat(document.getElementById('hours-off').value);
    const rate = parseFloat(document.getElementById('rate').value) / 100;

    const wattage = isNaN(watts) ? amps * 120 : watts;
    const kWh_saved = (wattage / 1000) * hours;
    const daily_savings = kWh_saved * rate;
    const monthly_savings = daily_savings * 30;
    const yearly_savings = daily_savings * 365;

    const entry = document.createElement('li');
    entry.textContent = `${name}: $${daily_savings.toFixed(2)}/day, $${monthly_savings.toFixed(2)}/month, $${yearly_savings.toFixed(2)}/year`;
    document.getElementById('appliance-list').appendChild(entry);

    this.reset();
});
