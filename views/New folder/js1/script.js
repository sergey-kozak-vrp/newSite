ymaps.ready(init);

var coordsstart,coordsstop,address1,address2,myroute,lat,lng;
var myMap,myPlacemark2,firstButton;
var flag1 = false,flag2 = false;
var deny = false;  
var distance,price;

function init() {
    lng = 27.5666700;
    lat = 53.9000000;
    navigator.geolocation.getCurrentPosition(function(pos) {
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
        workmap();
    },function(err) {
        deny = true;
        workmap();
    });
    
}

function calc() {
    alert("calc");
}

function getAddress(coords,btn,flag) {
        if(myroute) {
            myMap.geoObjects.remove(myroute);
        }
        ymaps.geocode(coords).then(function (res) {
            var firstGeoObject = res.geoObjects.get(0);
            var address = firstGeoObject.getAddressLine().split(", ");
            var coords = firstGeoObject.geometry.getCoordinates();
            var bounds = firstGeoObject.properties.get('boundedBy');
             myMap.setBounds(bounds, {
                // Проверяем наличие тайлов на данном масштабе.
                checkZoomRange: true
            });
            if(btn == 0) {
                address1 = firstGeoObject.getAddressLine().split(", ");
                coordsstart = coords;
                flag1 = true;
                if(flag == true) {
                    
                    var adsrt = "";
                   
                 
                    if(address[address.length-1].length < 6) {
                        for(var i = 0;i<address.length-1;i++) {
                            adsrt += address[i];
                            if(i != address.length-2) {
                                adsrt += ", ";
                            }
                        }
                        $("#adress").val(adsrt);
                        $("#home").val(address[address.length-1]);
                    }else {
                        for(var i = 0;i<address.length;i++) {
                            adsrt += address[i];
                            if(i != address.length-1) {
                                adsrt += ", ";
                            }
                        }
                        $("#adress").val(adsrt);
                        $("#home").val("");
                    }
                    if($("#adress").val() != "") {
                        $("#adress").css("opacity","1");
                    } else {
                        $("#adress").css("opacity","0.5");
                    }
                    if($("#home").val() != "") {
                        $("#home").css("opacity","1");
                    } else {
                        $("#home").css("opacity","0.5");
                    }
                }
                
            
            } else if(btn == 2) {
                address2 = firstGeoObject.getAddressLine().split(", ");
                coordsstop = coords;
                $("#address2").val(address[address.length - 2] + " " + address[address.length-1]);
                flag2 = true;
                if(flag == true) {
                    if($("#address2").val() != "") {
                        $("#address2").css("opacity","1");
                    } else {
                        $("#address2").css("opacity","0.5");
                    }
                }
            }
            

            
            
            if(myPlacemark1 && myPlacemark2 && address1[2] && address2[2] ) {
                distance = ymaps.coordSystem.geo.getDistance(coordsstart, coordsstop);
                distance = distance / 1000;
                
                ymaps.route([address1.join(' '), address2.join(' ')], {
                    multiRoute: false
                }).done(function (route) {
                    route.options.set("mapStateAutoApply", false);
                    myMap.geoObjects.add(myroute = route);
                }, function (err) {
                    throw err;
                }, this);
                 
            }
            
        });
    }

function workmap() {
    
    
        myMap = new ymaps.Map('map', {
            center: [lat,lng],
            zoom: 14,
            controls: []
        }, {
            searchControlProvider: 'yandex#search'
        });

        
        
        myPlacemark1 = new ymaps.Placemark([lat,lng], {
        balloonContentBody: [
            '<address>',
            '<strong>Это вы</strong>',
            '<br/>',
            '<small>Если посадка не будет произовиться отсюда, <br/> то перетащите метку</small>',
            '<br/>',
            '</address>'
        ].join('')
        }, {
            preset: 'islands#greenDotIcon'
        });

    myMap.geoObjects.add(myPlacemark1);
    
    if(deny != true) {
        getAddress([lat,lng], 0,true);
    }
    deny = false;
        
        myMap.events.add('mousedown', function (e) {
        // 0, 1 или 2 в зависимости от того, какая кнопка мыши нажата (В IE значение может быть от 0 до 7).
            if(e.get('domEvent').originalEvent.button == 0) {
                coordsstart = e.get('coords');
        
                // Если метка уже создана – просто передвигаем ее.
                if (myPlacemark1) {
                    myPlacemark1.geometry.setCoordinates(coordsstart);
                }
                // Если нет – создаем.
                getAddress(coordsstart,0,true);
            } else if(e.get('domEvent').originalEvent.button == 2) {
                coordsstop = e.get('coords');
                // Если метка уже создана – просто передвигаем ее.
                if (myPlacemark2) {
                    myPlacemark2.geometry.setCoordinates(coordsstop);
                }
                // Если нет – создаем.
                else {
                    
                        myPlacemark2 = new ymaps.Placemark([coordsstop[0],coordsstop[1]], {
                        balloonContentBody: [
                            '<address>',
                            '<strong>Конечная точка маршрута</strong>',
                            '<br/>',
                            '<small>Если конечная точка <br/> не будет находиться здесь, <br/> то перетащите метку</small>',
                            '<br/>',
                            '</address>'
                        ].join('')
                        }, {
                            preset: 'islands#redDotIcon'
                        });
                    
                        myMap.geoObjects.add(myPlacemark2);
                }
                    
             
                
                getAddress(coordsstop, 2,true);
            }
        });
     
        // Определяем адрес по координатам (обратное геокодирование).
    
}

$(document).ready(function(){ 
        
    
            $("body").keydown(function(e) {
                 if(e.which == 17) {
                     $('#overlay').fadeIn(400, 
                        function(){ 
                            $('#map').css('width', '1200px');
                            $('#map').css('height', '700px');
                            $('#map').css('position', 'fixed');
                            $('#map').css('top', '45%');
                            $('#map').css('left', '50%');
                            $('#map').css('margin-top', '-350px');
                            $('#map').css('margin-left', '-600px');
                            $('#map').css('z-index', '10');
                            $("#modal_close1").css("display","block");
                            myMap.container.fitToViewport();
                            $('#map').css('display', 'block').animate({opacity: 1,top: '50%'}, 100); 

                      });


                      $('#modal_close1, #overlay').click( function(){ 
                            
                            $('#map')
                                .animate({opacity: 1, top: '45%'}, 200,  
                                    function(){ // пoсле aнимaции
                                     $('#map').css('width', '500px');
                                     $('#map').css('height', '370px');
                                     $('#map').css('position', 'relative');
                                     $('#map').css('top', '0');
                                     $('#map').css('left', '0');
                                     $('#map').css('margin-top', '0');
                                     $('#map').css('margin-left', '0');
                                     $('#map').css('z-index', '0');
                                     myMap.container.fitToViewport();
                                     $("#modal_close1").css("display","none");
                                     $('#overlay').fadeOut(400); 
                                    }
                                );
                           });
                 }
            });
         
            function checkvalide() {
                if($("#adress").val() == "" || $("#home").val() == "" || $("#name").val() == "" || $("#tel").val() == "") {
                   if($("#adress").val() == "") {
                       $("#adress").css("border", "#FE717D solid 1px");
                       $("#adress").css("opacity","1");
                   }
                   if($("#home").val() == "") {
                       $("#home").css("border", "#FE717D solid 1px");
                       $("#home").css("opacity","1");
                   }
                   if($("#name").val() == "") {
                       $("#name").css("border", "#FE717D solid 1px");
                       $("#name").css("opacity","1");
                   }
                   if($("#tel").val() == "") {
                       $("#tel").css("border", "#FE717D solid 1px");
                       $("#tel").css("opacity","1");
                   }
            } else {
                if($("#podezd").text() != "") {
                    $(".modal_address1").text($("#adress").val() + ", " + $("#home").val() + ", " + $("#podezd").val());
                } else {
                    $(".modal_address1").text($("#adress").val() + ", " + $("#home").val());
                }
                if($("#address2").val() == "") {
                    $(".modal_address2").text("Не указано");
                } else {
                    $(".modal_address2").text($("#address2").val());
                }
                $(".modal_name").text($("#name").val());
                $(".modal_tel").text($("#tel").val());
                
                if(!distance) {
                    $(".modal_lenght").text("После посадки и указания маршрута");
                } else {
                    $(".modal_lenght").text(distance + "KM");
                }
                
                var typecar = $(".active").text();
                
                if (!distance) {
                    $(".modal_price").text("После посадки и указания маршрута");
                } else if(typecar == "Минивен") {
                    $(".modal_price").text((distance * 1 + 3) + "BYN");
                } else if(typecar == "Легковая" || typecar == "Универсал") {
                    $(".modal_price").text((distance * 0.7 + 3) + "BYN");
                } 
                else {
                    $(".modal_price").text("25(30)" + "BYN");
                }
                
            $('#overlay').fadeIn(400, 
                function(){ 
                    $('#modal_form') 
                        .css('display', 'block') 
                        .animate({opacity: 1, top: '50%'}, 200); 
                      
            });
            
          
            $('#modal_close, #overlay').click( function(){ 
                $('#modal_form')
                    .animate({opacity: 0, top: '45%'}, 200,  
                        function(){ // пoсле aнимaции
                            $(this).css('display', 'none'); 
                            $('#overlay').fadeOut(400); 
                        }
                    );
               });
            }
                
                
            }
    
       

            var child = 0;
    
            $(window).scroll(function() {
                 if($(this).scrollTop() > 450) {
                     $(".inf").css("opacity","1");
                     $(".inf").css("transition","2s all");                         
                 }
                 if($(this).scrollTop() > 1) {
                    $("#symb").attr("src","img/taxisymb2.svg");
                    $(".taxi").css("color","#385E82");
                    $(".header_topline").css("background","none");
                    $(".header_topline").css("transition","1s all");
                } else {
                    $(".header_topline").css("background","#385E82");
                    $(".taxi").css("color","white");
                    $("#symb").attr("src","img/taxisymb.svg");
                    
                    $(".inf").css("opacity","0");
                   
                   
                    $(".header_topline").css("transition"," 0.25s all");
                }
                if($(this).scrollTop() > 900) {
                    $("#iphone").css("opacity","1");
                    $("#iphone").css("transition","2s all");
                }
            });
    
    
           $(".ord").keyup(function(e) {
               var placeholder = $(this).attr("placeholder");
               if(placeholder == "Улица" || placeholder == "Дом") {
                   flag1 = false;
               }
               if(placeholder == "Адрес") {
                    flag2 = false;
               }
                if($(this).val() == "" && (placeholder == "Улица" || placeholder == "Дом" || placeholder == "Имя" || placeholder == "Телефон")) {
                    $(this).css("border","#FE717D solid 2px");
                }else{
                    $(this).css("border","none");
                }
           });
            
           $(".ord").mousedown(function() {
              var placeholder = $(this).attr("placeholder");
           
               if($("#address2").val() !="" && flag2 == false) {
                   var address = "Минск, " + $("#address2").val();
                   flag2 = true;
                    ymaps.geocode(address, { results: 1 }).then(function (res) 
                    {
                        // Выбираем первый результат геокодирования
                        var firstGeoObject = res.geoObjects.get(0);
                        var cords = firstGeoObject.geometry.getCoordinates();
                       
                        if (myPlacemark2) {
                        myPlacemark2.geometry.setCoordinates([cords[0],cords[1]]);
                        }
                        // Если нет – создаем.
                        else {

                            myPlacemark2 = new ymaps.Placemark([cords[0],cords[1]], {
                            balloonContentBody: [
                                '<address>',
                                '<strong>Конечная точка маршрута</strong>',
                                '<br/>',
                                '<small>Если конечная точка <br/> не будет находиться здесь, <br/> то перетащите метку</small>',
                                '<br/>',
                                '</address>'
                            ].join('')
                            }, {
                                preset: 'islands#redDotIcon'
                            });

                            myMap.geoObjects.add(myPlacemark2);
                        }
                    
                    getAddress([cords[0],cords[1]],2,true);
                    }, 
                    function (err) 
                    {
                        // Если геокодирование не удалось,
                        // сообщаем об ошибке
                        alert("Адрес не найден!");
                    });
                   
               }
               if($("#adress").val() !="" && $("#home").val() !="" && flag1 == false) {
                   var address = "Минск, " + $("#adress").val() + ", " + $("#home").val();
                   flag1 = true;
                   ymaps.geocode(address, { results: 1 }).then(function (res) 
                    {
                        // Выбираем первый результат геокодирования
                        var firstGeoObject = res.geoObjects.get(0);
                        var cords = firstGeoObject.geometry.getCoordinates();

                        if (myPlacemark1) {
                            myPlacemark1.geometry.setCoordinates([cords[0],cords[1]]);
                        }else{
                            myPlacemark1 = new ymaps.Placemark([cords[0],cords[1]], {
                                balloonContentBody: [
                                    '<address>',
                                    '<strong>Это вы</strong>',
                                    '<br/>',
                                    '<small>Если посадка не будет произовиться отсюда, <br/> то перетащите метку</small>',
                                    '<br/>',
                                    '</address>'
                                ].join('')
                            }, {
                                preset: 'islands#greenDotIcon'
                            });

                            myMap.geoObjects.add(myPlacemark1);
                        }
                        // Если нет – создаем.
                        getAddress([cords[0],cords[1]],0,true);
                    }, 
                    function (err) 
                    {
                        // Если геокодирование не удалось,
                        // сообщаем об ошибке
                        alert("Адрес не найден!");
                    });
               }
               
               if(placeholder == "Улица" || placeholder == "Дом" || placeholder == "Имя" || placeholder == "Телефон") {
                  if($(this).val() == "") {
                       $(this).css("border","#FE717D solid 2px");
                  } 
               }
           });
    
           $(".ord").mouseenter(function() {
               $(this).css("transition", "opacity .25s");
               $(this).css("opacity","1");
               var placeholder = $(this).attr("placeholder");
               if(placeholder == "Улица" || placeholder == "Дом" || placeholder == "Имя" || placeholder == "Телефон") {
                  if($(this).val() == "") {
                       $(this).css("border", "#FE717D dashed 2px");
                  }
               } 
           });
           $(".ord").mouseleave(function() {
              
               if($(this).val() != "") {
                   $(this).css("border","none");
               } else {
                   $(this).css("opacity","0.5");
                   $(this).css("border","none");
               }
           });
    
     
          
        
          
         $(".type").mouseenter(function() {
            $(this).css("opacity","1");
            $(".type").css("transition","all 0.1s");
             $(this).mouseup(function() {
              $(".type").css("transition","all 1s ease .1s");
                 $(".type").removeClass("active");
                $(".type").css("opacity","0.5");
                $(this).addClass("active");
                $(this).css("opacity","1"); 
              $(".type").css("border-radius","10px 0 10px 0");
              $(".type").css("padding-top","1%");
              $(".type").css("padding-bottom","1%");
              $(".type").css("width","20%");
              $(".type").css("background","#FFF");
              $(this).css("padding-top","1.5%");
              $(this).css("padding-bottom","1.5%");
              $(this).css("border-radius","0 0 10px 0");
              $(this).css("width","25%");
              $(this).css("background","#F8A71A");
              $(".type").css("color","black");
              $(this).css("color","white");
             });
         });
    
        $(".type").mouseleave(function() {
            $(".type").css("opacity","0.5");
            $(".active").css("opacity","1");
        });
    
          
    $('#address2').keydown(function(e){ //отлавливаем нажатие клавиш
      if (e.keyCode == 13) { //если нажали Enter, то true
        checkvalide();
      }
    });
    $('#adress').keydown(function(e){ //отлавливаем нажатие клавиш
      if (e.keyCode == 13) { //если нажали Enter, то true
        checkvalide();
      }
    });     
    $('#home').keydown(function(e){ //отлавливаем нажатие клавиш
      if (e.keyCode == 13) { //если нажали Enter, то true
        checkvalide();
      }
    });     
    $('#name').keydown(function(e){ //отлавливаем нажатие клавиш
      if (e.keyCode == 13) { //если нажали Enter, то true
        checkvalide();
      }
    });     
    $('#tel').keydown(function(e){ //отлавливаем нажатие клавиш
      if (e.keyCode == 13) { //если нажали Enter, то true
        checkvalide();
      }
    });     
    $('#kv').keydown(function(e){ //отлавливаем нажатие клавиш
      if (e.keyCode == 13) { //если нажали Enter, то true
        checkvalide();
      }
    }); 
    $('#podezd').keydown(function(e){ //отлавливаем нажатие клавиш
      if (e.keyCode == 13) { //если нажали Enter, то true
        checkvalide();
      }
    });     
            
	$('#btnorder').click( function(event){ 
             event.preventDefault(); 
                
            checkvalide();
    });  

            
    $('#msg').keyup(function() {
       if($('#msg').val().length == 3) {
           $('#smscode').css("background","#F8A71A");
           $('#smscode').css("color","#fff");
           $('#smscode').css("border","#f7a10c");
       }
    });
            
});