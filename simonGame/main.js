
$(document).ready(function() {  
  // Variables 
  var game = new Game();
  
  // PROGRAM
  $(".toggle").click(game.power);
  $("#start").click(game.newGame);
  $("#strict").click(game.strictGame);
  $(".piece").click(function() {
    game.usersInput($(this));
  });
});

var Game = function() {
  // References 
  var $display = $(".display").children();
  var $power = $(".toggle");

  // Variables -- Private
  var board = {
    'green':{
      'piece': $("#green"),
      'audio': new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3")
    },
    'red':{
      'piece': $("#red"),
      'audio': new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3")
    },
    'yellow':{
      'piece': $("#yellow"),
      'audio': new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3")
    },
    'blue':{
      'piece': $("#blue"),
      'audio': new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3")
    }
  };
  var colors = ['green', 'red', 'yellow', 'blue'];
  var count = 0, pos = 0, numMax = 20, speedPos = 0;
  var plays = [];
  var power = false, start = false, strict = false, userTurn = false;
  var speed = [1000, 700 , 500];
  
  // Functions -- Private
  // Updates the display with the current number of hits
  var showCount = function() {
    if(power === false)
      $display.text("");
    else {
      if(count === 0)
        $display.text("- -");
      else 
        count < 10 ? $display.text("0" + count) : $display.text(count);
    }
  }
  // Both switchs make the transition from one state to the other -- just visual effect
  var switchStart = function() {
    start === true && power === true ? $("#start").addClass("clicked") : $("#start").removeClass("clicked");
  };
  var switchStrict = function() {
    strict === true && power === true ? $("#strict").addClass("clicked") : $("#strict").removeClass("clicked");
  };
  // Generates the new random piece to iluminate and inserts it inside the array with all plays
  var generatePlay = function() {
    var random = Math.floor(Math.random() * 4);
    plays.push(colors[random]);
    iluminate(colors[random], speed[speedPos]/2);
    userTurn = true;
  };
  // Takes a color and a time an iluminates the piece
  var iluminate = function(color, time) {
    if(power === false || start === false)
      return;
    board[color].piece.addClass(board[color].piece.attr('id')+'Intense');
    board[color].audio.play();
    window.setTimeout(function() {
      board[color].piece.removeClass(board[color].piece.attr('id')+'Intense');
    }, time);
    showCount();
  };
  // The IA behind the game
  var game = function() {
    userTurn = false;
    count++;
    showHistory();
    var delay = parseInt(speed[speedPos] + plays.length * speed[speedPos]);
    window.setTimeout(generatePlay, delay);
  };
  // Reset all variables and counters
  var reset = function() {
    count = 0, pos = 0, speedPos = 0;
    plays = [];start = false, strict = false, userTurn = false;
    showCount();
  };
  // Displays the plays played
  var showHistory = function() {
    userTurn = false;
    plays.forEach(function(obj, index) {
      window.setTimeout(function() {
        iluminate(obj, speed[speedPos]/2);
      }, speed[speedPos] + speed[speedPos] * index);
    });
    var delay = parseInt(plays.length * speed[speedPos]);
    window.setTimeout(function() {
      userTurn = true;
    }, delay);
  };
  // When it is reached the number of hits -> shows a message
  var win = function() {
    $(".options").hide();
    $(".power").hide();
    reset();
    $(".inner").append('<h4 id="win">WINNER</h4>');
    window.setTimeout(function() {
      start = true; 
      $("#win").remove();      
      $(".options").show();
      $(".power").show();
      game();
    }, 2000);
  };
 
  // Functions -- Public
  // Turns on or off the machine
  this.power = function() {
    if(power === false) {
      power = true;
      $power.children().css("left", "50%");
      showCount();
    }
    else {
      power = false;
      $power.children().css("left", 0);
      $display.text("");
      reset();
      switchStart();
      switchStrict();
    }
  };
  // Initialises a new game
  this.newGame = function() {
    if(power === false)
      return;
    else {
      if(start === false) {
        start = true;  
        $display.text("");
        window.setTimeout(function() {
          $display.text("- -");
        },100);
        window.setTimeout(function() {
          $display.text("");
        },200);
        window.setTimeout(function() {
          $display.text("- -");
        },300);
        game();
      }
      else {
        start = false;
        reset();
      }
      switchStart();
    }
  };
  // Turns on or off the strict mode
  this.strictGame = function() {
    if(power === false)
      return;
    else {
      strict = (strict === true ? false : true);
      switchStrict();
    }
  };
  // Reads the input from the user and checks with the plays if he/she is doing it ok, when it doesn't up if the strict mode is on or off responds in a different way
  this.usersInput = function(move) {
    if(power && start && userTurn) {
      if(plays[pos] === move.attr("id")) {
        iluminate(move.attr("id"), 50);
        pos ++;
        if(pos === plays.length) {
          pos = 0;
          if(plays.length === 4 || plays.length === 8 || plays.length === 12)
            speedPos ++;
          if(plays.length === numMax)
            return win();
          return game();
        }
      }
      else {
        pos = 0;
        colors.forEach(function(color) {iluminate(color, 100);});
        setTimeout(function() {
          colors.forEach(function(color) {iluminate(color, 100);});
        },200);
        setTimeout(function() {
          colors.forEach(function(color) {iluminate(color, 100);});
        },400);
        if(!strict)
          setTimeout(showHistory,500);
        else {
          reset();
          start = true; 
          game();
        }
      }
    }
    else return;
  };
};