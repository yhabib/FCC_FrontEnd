// The API returns an [{},{},{}, ...]
// Each object(new), has the structre {info,{author}, {upvotes}, more info}

// ToDo: Order the news for votes or date

$(document).ready(function () {
  var ids = {};
  var urlAPI = "https://www.freecodecamp.com/news/hot";
  var cb = "?callback=?";
  var url = urlAPI + cb;
  $.getJSON(urlAPI, function (data) {
    sortByVotes(data).forEach(function (user) {
      printNew(user, ids);
    });
  });
  $(".content").on("mouseenter", ".notice", function () {
    var id = $(this).attr("id");
    ids[id]['text'] = $(this).find("#headline").html();
    $(this).find("#headline").text(ids[id].title);
  });

  $(".content").on("mouseleave", ".notice", function () {
    $(this).find("#headline").html(ids[$(this).attr("id")].text);
  });
});
function printNew(notice, ids) {
  var htmlCode = "";
  htmlCode += '<div id="' + notice["id"] + '" class="notice">';
  htmlCode += '<a href="' + notice["link"] + '" target="_blank"> ';
  htmlCode += '<img class="pic" src="' + notice["author"]["picture"] + '" alt="" />';
  htmlCode += '</a>';
  htmlCode += '<div class="info">'
  ids[notice["id"]] = { 'title': notice["headline"] };
  htmlCode += '<p id="headline"><a href="' + notice["link"] + '" target="_blank">' + resumeText(notice["headline"]) + '</p>';
  htmlCode += '<a id="author" href="https://www.freecodecamp.com/' + notice["author"]["username"] + '" target="_blank">' + notice["author"]["username"] + '</a>';
  htmlCode += '<span id="votes"><i class="fa fa-heart"></i> ' + notice["rank"] + '</span>';
  htmlCode += '<p id="date">' + epochToHuman(notice["timePosted"]) + '</p>';
  htmlCode += '</div></a></div>';
  $(".content").append(htmlCode);
}

function resumeText(text) {
  return text.length > 24 ? text.substr(0, 21) + '...' : text;
}
function longText(ele) {

}
// Returns the array with all the news order by votes
function sortByVotes(data) {
  return data.sort(function (a, b) {
    return b["rank"] - a["rank"];
  });
}

function epochToHuman(timestampt) {
  var myDate = new Date(timestampt);
  var htmlCode = "";
  var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  htmlCode += days[myDate.getDay()] + ", ";
  htmlCode += myDate.getDate() + " ";
  htmlCode += months[myDate.getMonth()] + " ";
  htmlCode += myDate.getFullYear();
  return htmlCode;
}