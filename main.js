var data = {
  milk: 0,
  cheese: 0
  // lastmilk: timestamp
};
function milk() {
  const $milk = document.getElementById('milk');
  $milk.innerHTML = ++data.milk;
  save();
}
function save() {
  localStorage.milk = JSON.stringify(data);
}
window.addEventListener("load", function () {
  if (localStorage.milk) {
    data = JSON.parse(localStorage.milk);
    document.getElementById('milk').innerHTML = data.milk;
  }
  if (data.milk && data.lastmilk) {
    var ferment = Date.now() - data.lastmilk;
    var factor = 1000 * 60 * 60 * 24 * 365 * 5;
    if (ferment >= factor) {
      var cheese = ferment / factor | 0;
      if (cheese >= data.milk) {
        cheese = data.milk;
        delete data.lastmilk;
      } else
        data.lastmilk += factor * cheese;
      document.getElementById('milk').innerHTML =
        (data.milk -= cheese);
      data.cheese += cheese;
    }
  }
  document.getElementById('cheese').innerHTML = data.cheese;
  if (!data.cheese)
    document.getElementById('showcheese').classList.add('hide');
  if (!data.lastmilk)
    document.getElementById('showferment').classList.add('hide');
  setInterval(function () {
    if (data.milk && !data.lastmilk) {
      data.lastmilk = Date.now();
      save();
    }
    if (data.lastmilk) {
      document.getElementById('ferment').innerHTML =
        (Date.now() - data.lastmilk) / 1000 | 0;
      document.getElementById('showcheese').classList.remove('hide');
      document.getElementById('showferment').classList.remove('hide');
    }
  }, 1000);
  if (kongregateAPI) {
    kongregateAPI.loadAPI(function () {
      kongregateAPI.getAPI().stats.submit('Cottage Cheese Made', data.cheese);
    });
    delete window.kongregateAPI;
  }
});
