jQuery(document).ready(function() {
  $(document).scroll(function() {
    if($(document).scrollTop() >= 180)
       $("button").css("display", "initial");
    else
      $("button").css("display", "none");
  });
  
  $(".page-scroll").click(function(event) {
    event.preventDefault();
    console.log()
    $('html, body').animate({ scrollTop:$(this.hash).offset().top } , 1000);
  });
  
  $("#toHome").click(function(event) {
    $('html,body').animate({ scrollTop:$("#pageTop").offset().top } , 1000);
  });
  
  // Description behavior 
  $(".first").click(function() {
    show($(".biography"), "slow")
    active($(this));  
  });
  $(".second").click(function() {
    show($(".skills"), "slow");
    active($(this));
    
  });
  $(".third").click(function() {
    show($(".actually"), "slow");
    active($(this));
    
  });
  
});
function active(obj) {
  obj.addClass("active");
  obj.siblings().removeClass("active");
}
function show(obj, vel) {
  obj.show(vel);
  obj.siblings().hide(vel);
}