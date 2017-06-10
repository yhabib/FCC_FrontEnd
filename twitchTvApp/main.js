$(document).ready(function () {
  var regularUsers = ["freecodecamp", "storbeck", "terakilobyte", "habathcx", "RobotCaleb", "thomasballinger", "noobs2ninjas", "beohoff", "medrybw", "brunofin", "comster404"];
  var twitchAPI = 'https://api.twitch.tv/kraken/streams/';
  var cb = '?client_id=5j0r5b7qb7kro03fvka3o8kbq262wwm&callback=?';
  var users = [];

  regularUsers.forEach(function (element) {
    var userURL = twitchAPI + element + cb;
    var userInfo = {};
    //First we check if it's online and if it's an User
    $.getJSON(userURL, function (data) {
      userInfo.name = element;
      try {
        userInfo.isConnected = data["stream"] ? "online" : "offline";
        userInfo.channel = data["_links"]["channel"];
        userInfo.description = userInfo.isConnected === "online" ? data["stream"]["channel"]["status"] : "undefined";
        $.getJSON(userInfo.channel + cb, function (data) {
          userInfo.displayName = data["display_name"];
          userInfo.logo = data["logo"] ? data["logo"] : "http://www.virginia.edu/foodcollaborative/img/icons/user.jpg";
          printUser(userInfo);
          users.push(userInfo);
        });
      }
      catch (error) {
        printNoUser(userInfo);
      }
    });
  });

  $(".menu").click(function () {
    showSomeUsers($(this).text().toLowerCase());
    $("input").val("");
  });
  $("input").keyup(function () {
    searchUser($(this).val());
  });
});  //End document.ready


// This function determines wich users should be shown by the app and moves the marker in order to show the current link
function showSomeUsers(value) {
  $(".listUsers").each(function () {
    var user = $(this).find(".links");
    user.each(function () {
      if (value === "all") {
        $(this).show();
        $(".marker").css("left", "3.5rem");
        $(".marker").addClass("all");
        $(".marker").removeClass("online");
        $(".marker").removeClass("offline");
      }
      else if ($(this).children().attr('class') !== value) {
        $(this).hide();
        $(".marker").css("left", "11.5rem");
        $(".marker").addClass("online");
        $(".marker").removeClass("all");
        $(".marker").removeClass("offline");
      }
      else if ($(this).children().attr('class') === value) {
        $(this).show();
        $(".marker").css("left", "19.5rem");
        $(".marker").addClass("offline");
        $(".marker").removeClass("all");
        $(".marker").removeClass("online");
      }
    });
  });
}

// This function builds the structure to show new users in the page
function printUser(user) {
  var code = "";
  code += '<a class="links" href="https://www.twitch.tv/' + user.name + '">';
  code += '<li class="' + user.isConnected + '">';
  code += '<img src="' + user.logo + '" class="profilePic">';
  code += '<span class="name">' + user.displayName + '</span>';
  if (user.isConnected === "online") {
    var description = user.description.length > 35 ? user.description.substring(0, 34) : user.description;
    code += '<span class="description">' + description + '...</span>';
  }
  code += user.isConnected === "online" ? '<span class="fa fa-check connected"></span>' : '<span class="fa fa-times noConnected"></span>';
  code += "</li>";
  code += "</a>";
  $(".users").find("ul").append(code);
}
function printNoUser(user) {
  var code = "";
  code += '<a class="links" href="#">';
  code += '<li class="">';
  code += '<img src="' + "https://t2.gstatic.com/images?q=tbn:ANd9GcT0SoYDXtzRrAP_bakYUZqfFu0kmozj3nM0kSOxtaddlKRXXiMeBYOl" + '" class="profilePic">';
  code += '<span class="name notUser">' + user.name + '</span>';
  code += '<span class="description">No longer a USER</span>';
  code += "</li>";
  code += "</a>";
  $(".users").find("ul").append(code);
}

// Every time a key is pressed in the search field checks the array of users and shows only the ones that should be displayed
function searchUser(input) {
  $(".listUsers").each(function () {
    var user = $(this).find(".links");
    user.each(function () {
      console.log($(this).find('.name').text().toLowerCase(), input, ($(this).find('.name').text().toLowerCase().indexOf(input.toLowerCase())));
      if ($(this).find('.name').text().toLowerCase().indexOf(input.toLowerCase()) < 0)
        $(this).hide();
      else {
        if ($(this).closest(".users").siblings(".wrap").find(".marker").hasClass("all"))
          $(this).show();
        else if ($(this).closest(".users").siblings(".wrap").find(".marker").hasClass("online") && $(this).children().attr('class') === "online")
          $(this).show();
        else if ($(this).closest(".users").siblings(".wrap").find(".marker").hasClass("offline") && $(this).children().attr('class') === "offline")
          $(this).show();
      }
    });
  });
}

