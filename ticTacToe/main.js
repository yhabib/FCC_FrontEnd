// The board is an array of arrays
//  (0 1 2)
//  (3 4 5)
//  (6 7 8)

$(document).ready(function () {
  // Click over the chip -- handler
  var game;
  $(".options").children().click(function () {
    game = new Game();
    game.setChips($(this).text());
    game.drawBoard();
  });
  // Click over the board -- handler -- On allows to work with elements created dynamically -- I only draw when is empty
  $("#board").on('click', '.col-xs-4', function () {
    if ($(this).text() === "") {
      game.drawChip($(this), game.getPlayerChip());
      game.generateMove();
    }
  });
});

// OOP
var Game = function () {
  // Variables - Private
  var playerChip = "", computerChip = "", count = 0, board = [], status = true, tie = false;
  var winners = [
    [0, 4, 8],
    [2, 4, 6],
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8]
  ];

  // Methods - Public
  // Allows to set the value of the comptuer and player chips
  this.setChips = function (chip) {
    playerChip = chip;
    computerChip = playerChip === "X" ? "O" : "X";
  };
  // Way to access the value of the private property
  this.getPlayerChip = function () {
    return playerChip;
  };
  // this.getComputerChip = function() {return computerChip;};
  // Draws the table each time a new game is going to start. Each cell has an id -> used in getCell
  this.drawBoard = function () {
    $(".newGame").hide();
    var pos = ["top", "", "bottom"],
      htmlCode = "",
      j = 0;
    for (var i = 0; i < 3; i++) {
      htmlCode += i === 1 ? '<div class="row center">' : '<div class="row">';
      htmlCode += '<div id="' + parseInt(i + j) + '" class="col-xs-4"></div>';
      j++;
      htmlCode += '<div id="' + parseInt(i + j) + '" class="col-xs-4 middle ' + pos.shift() + '"></div>'
      j++;
      htmlCode += '<div id="' + parseInt(i + j) + '" class="col-xs-4"></div>';
      htmlCode += '</div>';
    }
    $("#board").append(htmlCode);
  };
  // Draws a move in the board, inserts move in the board and increases nº of moves = nº of chips in the board
  this.drawChip = function (object, chip) {
    if (status) {
      $(object).append('<p class="chip">' + chip + '</p>');
      board[object.attr('id')] = chip;
      count++;
      isOver();
    }
  };
  // AI behind the game -> Not MinMax algorithm (IMPROVEMENT - FUTURE) 
  // Now a set of rules to make the properly movements
  this.generateMove = function () {
    if (board[4] === undefined) {
      this.drawChip(getCell(4), computerChip);
      return;
    }
    if (canWin(computerChip) > -1) {
      this.drawChip(getCell(canWin(computerChip)), computerChip);
      return;
    }
    else if (canWin(playerChip) > -1) {
      this.drawChip(getCell(canWin(playerChip)), computerChip);
      return;
    }
    else {
      if (smartMove(computerChip) > -1)
        this.drawChip(getCell(smartMove(computerChip)), computerChip);
      else {
        tie = true;
        isOver();
      }
    }
    return;
  };

  // Methods - Private
  // Returns the cell given a nunmber
  var getCell = function (number) {
    return $("#board").find("#" + number);
  };
  // Takes a chip(type of user) and returns true or false when there is a winner combination
  var win = function (userChip) {
    var sol = false;
    winners.forEach(function (current) {
      if (board[current[0]] === userChip && board[current[1]] === userChip && board[current[2]] === userChip) {
        sol = true;
        for (var i = 0; i < 3; i++)
          $(getCell(current[i])).css("color", "red");
      }
    });
    return sol;
  };
  // Returns the position of a winner movement either the computer or the player, if there is no winner movemen returns -1
  var canWin = function (userChip) {
    var pos = -1;
    winners.forEach(function (current) {
      if (board[current[0]] === userChip && board[current[1]] === userChip && typeof board[current[2]] === "undefined") {
        pos = current[2];
        return;
      } else if (board[current[0]] === userChip && typeof board[current[1]] === "undefined" && board[current[2]] === userChip) {
        pos = current[1];
        return;
      } else if (typeof board[current[0]] === "undefined" && board[current[1]] === userChip && board[current[2]] === userChip) {
        pos = current[0];
        return;
      }
    });
    return pos;
  };
  // Makes a move in order to get 2 zusammenn but first should try to take a corner
  var smartMove = function (userChip) {
    var pos = -1;
    if (board[4] === computerChip)
      pos = middleFree() !== -1 ? middleFree() : cornerFree();
    else {
      if (cornerFree() > -1)
        pos = cornerFree();
    }
    return pos;
  };
  // Returns a random free corner in order to make the best first move when the user pics the center
  var cornerFree = function () {
    var aux = [], corners = [0, 2, 6, 8];
    for (var i = 0; i < corners.length; i++) {
      if (typeof board[corners[i]] === "undefined")
        aux.push(corners[i]);
    }
    if (board[3] === playerChip) {
      if (board[1] === playerChip)
        aux.splice(aux.indexOf(8), 1);
      if (board[7] === playerChip)
        aux.splice(aux.indexOf(2), 1);
    }
    if (board[5] === playerChip) {
      if (board[1] === playerChip)
        aux.splice(aux.indexOf(6), 1);
      if (board[7] === playerChip)
        aux.splice(aux.indexOf(0), 1);
    }

    // take out the corner that generates problems
    return corners.length > 0 ? aux[Math.floor(Math.random() * aux.length)] : -1;
  };
  var middleFree = function () {
    var aux = [], middles = [1, 3, 5, 7];
    for (var i = 0; i < middles.length; i++) {
      if (typeof board[middles[i]] === "undefined")
        aux.push(middles[i]);
    }
    return bestMove(computerChip, aux);
  };
  var bestMove = function (userChip, array) {
    var pos = -1;
    winners.forEach(function (current) {
      if (board[current[0]] === userChip && board[current[1]] === undefined && board[current[2]] === undefined) {
        pos = array.indexOf(current[2]) > -1 ? current[2] : (array.indexOf(current[1]) > -1 ? current[1] : -1);
        return;
      }
      else if (board[current[0]] === undefined && board[current[1]] === undefined && board[current[2]] === userChip) {
        pos = array.indexOf(current[0]) > -1 ? current[0] : (array.indexOf(current[1]) > -1 ? current[1] : -1);
        return;
      }
      else if (board[current[0]] === undefined && board[current[1]] === userChip && board[current[2]] === undefined) {
        pos = array.indexOf(current[2]) > -1 ? current[2] : (array.indexOf(current[0]) > -1 ? current[0] : -1);
        return;
      }
    });
    return pos;
  };
  // Checks if the state of the game is final -> Shows a properly message and initialise the game if necessary 
  var isOver = function () {
    var htmlCode = '<div class="endmess"><h3 class="end">';
    if (win(playerChip))
      htmlCode += 'Player Wins!!!';
    else if (win(computerChip))
      htmlCode += 'Computer Wins!!!';
    else if (tie)
      htmlCode += 'It\'s a Tie!!!';
    else
      return;
    htmlCode += "</h3>";
    htmlCode += '</div>';
    $("#board").before(htmlCode);
    status = false;
    setTimeout(clearAll, 2500);
  };
  // First disable the clicks
  var clearAll = function () {
    var playerChip = "", computerChip = "", count = 0, board = [], status = true;
    $("#board").children().remove();
    $(".newGame").show();
    $(".end").remove();
  };
};