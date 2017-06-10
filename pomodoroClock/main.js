//  To Do:
//  Fill the timer

$(document).ready(function () {
  var workTime = parseInt($("#valueWork").html());
  var restTime = parseInt($("#valueRest").html());
  var workSeconds = workTime * 60; //25 minutos
  var restSeconds = restTime * 60;
  var isOn = false, isWorking = true;
  $("#countDown").text(format(workSeconds));

  // Handles for the buttons
  $("#rest").find("#minus").click(function () {
    if (!isOn) {
      if (restTime > 1)
        restTime--;
      $("#valueRest").html(restTime);
      restSeconds = restTime * 60;
    }
  });

  $("#rest").find("#mas").click(function () {
    if (!isOn) {
      restTime++;
      $("#valueRest").html(restTime);
      restSeconds = restTime * 60;
    }

  });

  $("#work").find("#minus").click(function () {
    if (!isOn) {
      if (workTime > 1)
        workTime--;
      $("#valueWork").html(workTime);
      workSeconds = workTime * 60;
      updateSeconds(workSeconds);
    }
  });

  $("#work").find("#mas").click(function () {
    if (!isOn) {
      workTime++;
      $("#valueWork").html(workTime);
      workSeconds = workTime * 60;
      updateSeconds(workSeconds);
    }
  });

  //Initialise the timer
  $("#timer").click(function () {
    if (isOn)
      isOn = false;
    else
      isOn = true;
  });

  // Reset the timer
  $("#timer").dblclick(function () {
    isOn = false;
    workSeconds = workTime * 60;
    updateSeconds(workSeconds);
    isWorking = true;
    $("#countDown").finish();
  });

  function updateSeconds(seconds) {
    $("#countDown").text(format(seconds));
  }
  function format(seconds) {
    var rest = seconds % 60;
    return (Math.floor(seconds / 60) + ":" + (rest < 10 ? "0" + rest : rest));
  }
  function decreaseTime() {
    if (isWorking) {
      if (workSeconds > 0) {
        workSeconds--;
        updateSeconds(workSeconds);
      }
      else {
        isWorking = false;
        $("#countDown").css("color", "red");
        $("#countDown").animate({ color: "white" }, restSeconds * 1000);
        workSeconds = workTime * 60;
        updateSeconds(restSeconds);
      }
    }
    else {
      if (restSeconds > 0) {
        restSeconds--;
        updateSeconds(restSeconds);
      }
      else {
        isWorking = true;
        $("#countDown").removeClass("red");
        restSeconds = restTime * 60;
        updateSeconds(workSeconds);
      }
    }
  }
  //This decrease every second an unit from seconds
  window.setInterval(function () {
    if (isOn)
      decreaseTime();
  }, 1000);


});