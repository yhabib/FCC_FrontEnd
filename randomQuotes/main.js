//Objeto donde almaceno la quote
var quote = {};

$(document).ready(function () {
  getQuote();
  $("#newquote").click(function () {
    getQuote();
  });
  $("#tweetear").click(function () {
    sendTweet();
  });
});


//Retrieves the quote from forismatic
function getQuote() {
  $.getJSON("https://api.forismatic.com/api/1.0/?method=getQuote&format=jsonp&lang=en&jsonp=composeQuote&?callback=?");
}

//Function that retrieves the information from the response and shows it properly
function composeQuote(response) {
  quote.text = response.quoteText;
  response.quoteAuthor === "" ? quote.author = "Unknown" : quote.author = response.quoteAuthor;
  //Show here directly the quote
  $("blockquote p").text(quote.text);
  $("blockquote cite").text(quote.author);
}

//Twitter allows only 140 char so when the size of the quote+name is bigger should split it.
function sendTweet() {
  var tweet = quote.text + "\n - " + quote.author;
  console.log(tweet.slice(0, 136) + '...');
  tweet.length < 141 ? twtLink = 'https://twitter.com/home?status=' + encodeURIComponent(tweet) : twtLink = 'https://twitter.com/home?status=' + encodeURIComponent(tweet.slice(0, 137) + '...');

  window.open(twtLink, '_blank');
}
