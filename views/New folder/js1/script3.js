function send() {
     nick = $("#nick").val();
     temp = $("#otziv").val();
     $('.otz').append('<div class="row" style="margin-bottom: 3%;"><div class="comment"><span class="col-md-1 nameotz"><span class="nameotz1">' + nick + '</span></span><div class="col-md-10 textotz">' + temp + '</div></div></div>');
     $("#nick").val("");
     $("#otziv").val("");
   
 }


$(document).ready(function() {
   $(".mach").mouseenter(function() {
      if ($(window).width() >= '980'){
        $('#overlay1').fadeIn(200,
        function () {
            $(".mach").mouseleave(function () {
                            $('#overlay1').fadeOut(200);
            });
            $("body").click(function () {
                            $('#overlay1').fadeOut(200);
            });
         });  
      }
   });
});