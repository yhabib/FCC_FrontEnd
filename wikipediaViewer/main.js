$(document).ready(function () {
  var wikipedia = "https://en.wikipedia.org";
  var apiURL = '/w/api.php?action=query&format=json&list=search&srwhat=text&srsearch=';
  var cb = '&callback=?&continue=';
  var wikipediaEntrie = "http://en.wikipedia.org/?curid=";
  var continueSearch;
  var sroffsetSearch;
  var URL = "";
  var allEntries = false;

  $("#input").keyup(function (e) {
    var code = e.keyCode || e.which;
    if (code == 13)
      return;
    resizeInputBox();
    $(".entries").children().remove();
    var keywordToSearch = $("input").val();
    URL = wikipedia + apiURL + keywordToSearch + cb;
    allEntries = true;
    $.getJSON(URL, callback);
    if ($("#input").val() === "")
      initialInputBox();
  });

  $(".fa-random").click(function () {
    resizeInputBox();
    $(".entries").children().remove();
    $("#input").val("");
    var keywordToSearch = randomEntry();
    URL = wikipedia + apiURL + keywordToSearch + cb;
    allEntries = false;
    $.getJSON(URL, callback);
    if ($("#input").val() === "")
      initialInputBox();
  });

  //When the X is click -> clean the input box
  $("#newSearch").click(initialInputBox);
  //Autoloading more entries when the scroll bar reachs the bottom
  $(window).scroll(function () {
    console.log($(document).scrollTop(), $(window).height(), $(document).height())
    if ($(window).scrollTop() + $(window).height() == $(document).height())
      $.getJSON(URL + 'continue=' + continueSearch + '&sroffset=' + sroffsetSearch, callback);
  });

  //Process each notcie and calls the print function
  function callback(data) {
    if (data["query"]["search"].length > 0) {
      if (allEntries) {
        data["query"]["search"].forEach(function (element) {
          print(element, wikipedia);
        });
        continueSearch = data['continue']['continue'];
        sroffsetSearch = data['continue']['sroffset'];
      }
      else
        print(data["query"]["search"][0], wikipedia)
    }
    else
      nothingFound();
  }

  //Prints each notice
  function print(entry) {
    var htmlCode = '';
    htmlCode += '<a class="entry" href="https://en.wikipedia.org/wiki/' + entry["title"] + '">';
    htmlCode += '<h3>' + entry["title"] + '</h3>';
    htmlCode += '<p>' + entry["snippet"] + '</p>';
    htmlCode += '</a>';
    $(".entries").append(htmlCode);
  }
  function nothingFound() {
    var htmlCode = '';
    htmlCode += '<h1 style="margin-top: 50px"> NOTHING FOUND! </h1>';
    $(".entries").append(htmlCode);
  }
  function resizeInputBox() {
    $("form").css("margin-top", "2rem");
  }
  function initialInputBox() {
    $(".entries").children().remove();
    $("input").val("");
    $("input").focus();
    $("form").css("margin-top", "10rem");
  }
  function randomEntry() {
    var abc = 'abcdefghijklmnñopqrstuvwxyz@¢∞æ€®µ√©∑å∫™Ω∫'.split("");
    return abc[Math.floor(Math.random() * abc.length)];
  }
});
/*
$.getJSON(URL+'continue='+data["continue"]['continue'] +'&sroffset='+data['continue']['sroffset'], function(data) {
      console.log(data);
    });
*/