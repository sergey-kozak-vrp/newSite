ymaps.ready(init);

var myMap,from,to,coordstart,coordstop,price,distance,address,flag;

function myTrim(x) {
    return x.replace(/[,]/g,'');
}

function init() {
    myMap = new ymaps.Map('map', {
            center: [53.9,27.5666700],
            zoom: 14,
            controls: []
        }, {
            searchControlProvider: 'yandex#search'
        });
    
}


$(document).ready(function () {
    
    $("#from").keyup(function() {
            
            
            
            from = "Минск" + $("#from").val();
           
           
                ymaps.geocode(from, { results: 1 }).then(function (res) {
                 var firstGeoObject = res.geoObjects.get(0);
                 address = firstGeoObject.getAddressLine();
                 $("#address1data :nth-child(1)").text(myTrim(address));
                 $("#address1data :nth-child(1)").val(address);
                 $("#address1data :nth-child(2)").text(address);
                });
            

    });
         $("#to").keyup(function() {

       
            from = "Минск" + $("#to").val();
         
            ymaps.geocode(from, { results: 1 }).then(function (res) {
                 var firstGeoObject = res.geoObjects.get(0);
                 address = firstGeoObject.getAddressLine();
                 $("#address2data :nth-child(1)").text(myTrim(address));
                 $("#address2data :nth-child(1)").val(address);
                 $("#address2data :nth-child(2)").text(address);
            });

    });
   

    
    function checkvalide() {
        if ($("#from").val() == "" || $("#to").val() == "") {
            if ($("#to").val() == "") {
                $("#to").css("border", "#FE717D solid 1px");
                $("#to").css("opacity", "1");
            }
            if ($("#from").val() == "") {
                $("#from").css("border", "#FE717D solid 1px");
                $("#from").css("opacity", "1");
            }
        } else {
            from = "Минск" + $("#from").val();
            to = "Минск" + $("#to").val();

            var typecar = $("#sel1").val();

            ymaps.geocode(from, { results: 1 }).then(function (res) {
                // Выбираем первый результат геокодирования
                var firstGeoObject = res.geoObjects.get(0);
                coordstart = firstGeoObject.geometry.getCoordinates();
                ymaps.geocode(to, { results: 1 }).then(function (res) {
                    // Выбираем первый результат геокодирования
                    var firstGeoObject = res.geoObjects.get(0);
                    coordstop = firstGeoObject.geometry.getCoordinates();
                    distance = ymaps.coordSystem.geo.getDistance(coordstart, coordstop);
                    distance = distance / 1000;
                    if (distance < 10) {
                        $(".modal_lenght").text(distance + "KM");
                    } else {
                        $(".modal_lenght").text(distance + "KM");
                    }
                    if (typecar == "Легковая" || typecar == "Универсал") {
                        $(".modal_price").text((distance * 0.7 + 3) + "BYN");
                    } else {
                        $(".modal_price").text((distance * 1 + 3)+ "BYN");
                    }
                    $(".modal_address2").text($("#to").val());
                    $(".modal_address1").text($("#from").val());
                });

                
            });
            $('#overlay').fadeIn(400,
        function () {
            $('#modal_form1')
                .css('display', 'block')
                .animate({ opacity: 1, top: '50%' }, 200);

        });


            $('#modal_close, #overlay').click(function () {
                $('#modal_form1')
                    .animate({ opacity: 0, top: '45%' }, 200,
                        function () { // пoсле aнимaции
                            $(this).css('display', 'none');
                            $('#overlay').fadeOut(400);
                        }
                    );
            });
        }
    }
        
    
    
    $(".ord").mouseenter(function () {
        $(this).css("opacity", "1");
    });
        $('#btnorder').click( function(event){ 
            event.preventDefault(); 
                
            checkvalide();
        });

        $(".ord").keyup(function (e) {
            var placeholder = $(this).attr("placeholder");
            if ($(this).val() == "" && (placeholder == "Конечный адрес" || placeholder == "Начальный адрес")) {
                $(this).css("border", "#FE717D solid 1px");
            } else {
                $(this).css("border", "none");
            }
        });

        $(".ord").mouseleave(function () {
            if ($(this).val() != "") {
                $(this).css("opacity", "1");
            } else {
                if ($(this).css("border") != "1px solid rgb(254, 113, 125)")
                    $(this).css("opacity", ".7");
                else
                    $(this).css("opacity", "1");
            }

        });
   
});


