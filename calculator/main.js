$(document).ready(function () {
  var calc = new Calculator();

  $("button").click(function () {
    var key = $(this);
    if (key.hasClass("clear"))
      calc.clearCalc();
    else
      calc.input(key);
  });
});


var Calculator = function () {
  // References
  var $primaryDisplay = $(".result").find("#output");
  var $secondaryDisplay = $(".history").find("#output");

  // Variables -- Private
  var memory = [], aux = "", result = 0;

  // Methods -- Public
  // Proccess the input of a new element, number or operation
  this.input = function (key) {
    if (key.hasClass("number"))
      aux += key.text();
    else if (key.hasClass("ops") && (aux.length > 0 || memory.length > 0)) {
      memory.push(aux);
      aux = "";
      if (key.text() === "=")
        makeOperation();
      else
        memory.push(key.text());
    }
    setDisplays();
  }
  this.clearCalc = function () {
    memory = [], aux = "", result = 0;
    setDisplays();
  }

  // Methods -- Private
  // Updates the values on the two screens
  function setDisplays() {
    $primaryDisplay.text(result);
    $secondaryDisplay.text(memory.join("") + aux);
  }
  function makeOperation() {
    var maxValue = 10000000000000000;
    result = parseInt(eval(memory.join("")));
    result = result > maxValue ? result.toExponential(3) : result;
    memory = [];
    memory.push(result);
  }
};


