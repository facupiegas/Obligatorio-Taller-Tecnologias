var favoritos = [];
var db;

$(document).ready(function(){
    db = window.openDatabase("favoritos", "1.0", "favoritos", 1024*1024*5);
    db.transaction(function(tx){
        tx.executeSql("CREATE TABLE IF NOT EXISTS favoritos (usuario INTEGER, cancha TEXT)");
    });
});

//////////////////////////////////////////////////////// login & Signup, Logout ////////////////////////////////////////////////////////
var idUsuario = -1;
function hacerLogin(){
    var usuario = $('#login #usuario').val();
    var pass = $('#login #clave').val();
    if(usuario !== '' & pass !== ''){
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "http://quierojugar.tribus.com.uy/login?user=" + usuario + "&password=" + pass,
            data:'',
            success: function(retorno){
                if(retorno.id_usuario != -1) {
                    idUsuario = retorno.id_usuario;
                    cargarPaginaListadoCanchas('slideup');
                } 
                else {
                    if(retorno.id_usuario == -1) {
                        $('#login #mensaje').html("Clave/Usuario incorrectos, verifique");
                    }
                }
            },
            error:function(retorno){
                $('#login #mensaje').html("Clave/Usuario incorrectos, verifique");
            }
        });
    } else {
        $('#login #mensaje').html("<p>Ingrese usuario y clave</p>");
    }
}
function hacerSignup(){
    var usuario = $('#signup #usuario').val();
    var pass = $('#signup #clave').val();
    var nombre = $('#signup #nombre').val();
    if(usuario !== '' && pass !== '' && nombre !== ''){
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "http://quierojugar.tribus.com.uy/registrar?user=" + usuario + "&password=" + pass + '&nombre='+ nombre,
            data:'',
            success: function(retorno){
                idUsuario = retorno.id_usuario;
                cargarPaginaListadoCanchas('slideup');
            },
            error:function(retorno){
                $('#signup #mensaje').html("<p>Usuario ya existente</p>");
            }
        });
    } else {
        $('#signup #mensaje').html("<p>Ingrese usuario, clave y nombre de usuario</p>");
    }
}
function hacerLogout(){
    //Borrar sesion del usuario
    idUsuario = -1;
    cargarLogin();
}

function cargarLogin(){
    $("#login #mensaje").html(""); //vacio div mensaje
    //vacio inputs
    $("#login input[type='text']").val(""); 
    $("#login input[type='password']").val(""); 
    $.mobile.navigate('#login', {transition: 'pop'});
}

function cargarSignup(){
    $("#signup #mensaje").html(""); //vacio div mensaje
    //vacio inputs
    $("#signup input[type='text']").val(""); 
    $("#signup input[type='password']").val(""); 
    $.mobile.navigate('#signup', {transition: 'pop'});
}

//////////////////////////////////////////////////////// Canchas ////////////////////////////////////////////////////////
function cargarPaginaListadoCanchas(efectoTransicion){
    selectFavoritos(idUsuario);
    if(idUsuario != -1){
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "http://quierojugar.tribus.com.uy/getCanchas",
            data:'',
            success: function(retorno){
                $.when(selectFavoritos(idUsuario)).then(function(){
                    var lista = $("#listadoCanchas #canchas").listview();
                    lista.empty();
                    var largo = retorno.canchas.length;
                    var i;
                    for(i=0; i<largo; i++){
                        if(favoritos.indexOf(retorno.canchas[i].nombre) > -1){
                            lista.append(
                                "<li><a href='#' onclick='cargarDetalleCancha(&quot;"+retorno.canchas[i].nombre+"&quot;, &quot;pop&quot;)'>" + retorno.canchas[i].nombre + "</a>" + "<a data-cancha='"+retorno.canchas[i].nombre+"' href='#' class='ui-icon-staryellow' onclick='borrarCanchaFavorita($(this))'></a></li>"
                            );
                        } else {
                            lista.append(
                                "<li><a href='#' onclick='cargarDetalleCancha(&quot;"+retorno.canchas[i].nombre+"&quot;,&quot;pop&quot;)'>" + retorno.canchas[i].nombre + "</a>" + "<a data-cancha='"+retorno.canchas[i].nombre+"' href='#' class='ui-icon-star' onclick='guardarCanchaFavorita($(this))'></a></li>"
                            );
                        }
                    }
                    if(efectoTransicion == "left"){
                        lista.listview('refresh',$.mobile.navigate('#listadoCanchas',{transition: 'slide', direction:''}));
                    } else {
                        lista.listview('refresh',$.mobile.navigate('#listadoCanchas',{transition: efectoTransicion}));
                    }
                    
                });
            },
            error:function(retorno){
                $('#login #mensaje').html("<p>"+ retorno.mensaje +"</p>");
            }
        });
    } else {
        $.mobile.navigate('#login');
    }
}
function cargarDetalleCancha(cancha, efectoTransicion){
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "http://quierojugar.tribus.com.uy/getCancha?nombre=" + cancha,
        success: function(retorno){
            $('#divInfoCancha h3 span').html(retorno.cancha.nombre);
            $('#nuevoPartidoCancha').attr('onclick','cargarPaginaNuevoPartido("'+retorno.cancha.nombre+'","slide")');
          
            //ARREGLAR EN CLASE TEMA RESIZE FOTOS, REDONDEO BORDES !!!!!!!!!!!!!!!!!!!!!!!!!
            $('#fotosCancha .ui-block-a ').html(
                "<a href='#foto1Popup' data-rel='popup' data-position-to='window' data-transition='fade'>" + "<img src='http://quierojugar.tribus.com.uy/canchas/" + retorno.cancha.fotos[0] + "'></a>"
            );
            $('#fotosCancha .ui-block-b ').html(
                "<a href='#foto2Popup' data-rel='popup' data-position-to='window' data-transition='fade'>" + "<img src='http://quierojugar.tribus.com.uy/canchas/" + retorno.cancha.fotos[1] + "'></a>"
            );
            $('#fotosCancha .ui-block-c ').html(
                "<a href='#foto3Popup' data-rel='popup' data-position-to='window' data-transition='fade'>" + "<img src='http://quierojugar.tribus.com.uy/canchas/" + retorno.cancha.fotos[2] + "'></a>"
            );
            $("#foto1Popup img").attr('src','http://quierojugar.tribus.com.uy/canchas/' + retorno.cancha.fotos[0]);
            $("#foto2Popup img").attr('src','http://quierojugar.tribus.com.uy/canchas/' + retorno.cancha.fotos[1]);
            $("#foto3Popup img").attr('src','http://quierojugar.tribus.com.uy/canchas/' + retorno.cancha.fotos[2]);
          
            $('#infoDireccion').html(retorno.cancha.direccion);
            $('#infoTel').html(retorno.cancha.telefono);
            var plat = retorno.cancha.ubicacion.latitud;
            var plong = retorno.cancha.ubicacion.longitud;
            gMap = new google.maps.Map(document.getElementById('map')); 
            gMap.setZoom(14); // zoom mapa
            gMap.setCenter(new google.maps.LatLng(plat, plong));
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(plat, plong),
                map: gMap,
            });
            ajaxTraerPartidos(retorno.cancha.nombre);//cargo los partidos de ka cancha en la lista
            $.mobile.navigate('#detalleCancha',{transition: efectoTransicion}); 
        },
        error:function(retorno){
        }
    });  
}
function initMap() {
    var uluru = {lat: -5, lng: -5};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: uluru
    });
    var marker = new google.maps.Marker({
        position: uluru,
        map: map
    });
}
function ajaxTraerPartidos(pNombCancha){
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "http://quierojugar.tribus.com.uy/getPartidos?nombreCancha=" + pNombCancha,
        success: function(retorno){
            if(retorno.retorno == 'OK'){
                var listaPartidos = $("#lstPartidos").listview();
                listaPartidos.empty();
                var largo = retorno.partidos.length;
                var i;
                for(i=0; i<largo; i++){               
                        listaPartidos.append("<li> <a href='#' onclick='cargarPaginaDetallePartido("+retorno.partidos[i].id+",&quot;pop&quot;)'>" + retorno.partidos[i].nombre + "<a/></li>");              
                }
                listaPartidos.listview('refresh');
            }  
        },
        error: function(err){
            //$('#detalleCancha #mensaje').html("<p>"+ JSON.parse(err.responseText) +"</p>")
        }
    });
}

////////////////////////////////////////////////////////// Favoritos ////////////////////////////////////////////////////////
function cargarPaginaFavoritos(efectoTransicion){
    if(idUsuario != -1){
        var favs = $("#listadoFavoritos #canchasfavoritas").listview();
        favs.empty();
        var largo = favoritos.length;
        var i;
        for(i=0; i<largo; i++){
            favs.append(
                "<li><a href='#detalleCancha' id='" + favoritos[i] + "' onclick='cargarDetalleCancha(" + favoritos[i] + ",'pop')'>" + favoritos[i] + "</a>" + "<a data-cancha='"+favoritos[i]+"' href='#' class='ui-icon-staryellow' onclick='borrarCanchaFavorita($(this)),borrarDeFavoritos($(this))'></a></li>"
            );
        }
        if(efectoTransicion == "left"){
            favs.listview('refresh',$.mobile.navigate('#listadoFavoritos',{transition: 'slide', direction: "reverse"} ));
        } else {
            favs.listview('refresh',$.mobile.navigate('#listadoFavoritos',{transition: efectoTransicion} ));
        }
    }
}
function guardarCanchaFavorita(esto){
    var id = esto.data('cancha');
    if(favoritos.indexOf(id) == -1){
        favoritos.push(id);
        esto.removeClass('ui-icon-star');
        esto.addClass('ui-icon-staryellow');
        esto.attr('onclick', '');
        esto.attr('onclick', 'borrarCanchaFavorita($(this))');
        insertFavorito(idUsuario, id);
        favoritos = selectFavoritos(idUsuario);
    }
}
function borrarCanchaFavorita(esto){
    var id = esto.data('cancha');
    var index = favoritos.indexOf(id);
    if(index > -1){
        favoritos.splice(index, 1);
        esto.removeClass('ui-icon-staryellow');
        esto.addClass('ui-icon-star');
        esto.attr('onclick', '');
        esto.attr('onclick', 'guardarCanchaFavorita($(this))');
        deleteFavorito(idUsuario, id);
        favoritos = selectFavoritos(idUsuario);
    }
}
function borrarDeFavoritos(esto){
    esto.closest('li').remove();
}
function selectFavoritos(usu){
    db = window.openDatabase("favoritos", "1.0", "favoritos", 1024*1024*5);
    db.transaction(function (tx) {
        tx.executeSql("SELECT cancha FROM favoritos WHERE usuario=?",[usu],
        function(tx,result){
            favoritos = [];
            var i, largo = result.rows.length;
            for(i=0; i< largo; i++){
                favoritos.push(result.rows.item(i).cancha);
            }
        }, function (error) {
        });
    });
}
function insertFavorito(usu, cha){
    db.transaction(function(tx){
        tx.executeSql("INSERT INTO favoritos(usuario,cancha) VALUES (?,?)",[usu, cha]);
    });
}
function deleteFavorito(usu, cha){
    db.transaction(function(tx){
        tx.executeSql("DELETE FROM favoritos WHERE usuario=? and cancha=?",[usu, cha]);
    });
}

////////////////////////////////////////////////////////// Detalle Partido ////////////////////////////////////////////////////////
function cargarPaginaDetallePartido(partido, efectoTransicion){
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "http://quierojugar.tribus.com.uy/getPartido?idPartido="+partido,
        success: function(retorno){
            if(retorno.retorno == 'OK'){
                if(retorno.partido.cantidad_jugadores == 10) {
                    $('#detallePartido #info').html(
                        "<p><b>Nombre:</b> " + retorno.partido.nombre + "</p>" + "<p><b>Cancha:</b> " + retorno.partido.cancha + "</p>" + "<p><b>Jugadores:</b> " + retorno.partido.cantidad_jugadores + "</p>"
                        );
                } else {
                    $('#detallePartido #info').html(
                        "<p><b>Nombre:</b> " + retorno.partido.nombre + "</p>" + "<p><b>Cancha:</b> " + retorno.partido.cancha + "</p>" + "<p><b>Jugadores:</b> " + retorno.partido.cantidad_jugadores + "</p>" + "<input type='button' id='jugar' value='Jugar' data-role='button' data-partido='"+retorno.partido.id+"' onclick='inscribirsePartido("+idUsuario+",$(this).data(&quot;partido&quot;)), cargarPaginaDetallePartido($(this).data(&quot;partido&quot;),&quot;pop&quot;)'>"
                    );
                    $('#jugar').button();
                }
                var listaJugadores = $('#detallePartido #listaJugadores').listview().empty();
                var jugadoresPartido = retorno.partido.jugadores;
                var largo =  jugadoresPartido.length;
                var i;
                for(i=0; i<largo; i++){
                    if(jugadoresPartido[i] !== ''){
                        listaJugadores.append("<li>" + jugadoresPartido[i] + "</li>");
                    }
                }
                if(efectoTransicion == 'left'){
                    listaJugadores.listview('refresh', $.mobile.navigate('#detallePartido',{transition: 'slide', direction:'reverse'}));
                } else {
                    listaJugadores.listview('refresh', $.mobile.navigate('#detallePartido',{transition: efectoTransicion}));
                }
            } else {
                if(retorno.retorno == 'ERROR') {
                    $('#detalleCancha #mensaje').html("<p>"+ retorno.mensaje +"</p>");
                }
            }
        },
        error: function(err){
            $('#detalleCancha #mensaje').html("<p>"+ JSON.parse(err.responseText) +"</p>");
        }
    });
}

////////////////////////////////////////////////////////// Crear partido ////////////////////////////////////////////////////////
function cargarPaginaNuevoPartido(idCancha){
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "http://quierojugar.tribus.com.uy/getCanchas",
            success: function(retorno){
                if(retorno.retorno == 'OK'){
                    var select = $('#nuevoPartido #selectCancha');
                    select.html("");
                    var largo = retorno.canchas.length;
                    var i;
                    for(i=0; i<largo; i++){
                        var nom = retorno.canchas[i].nombre;
                        select.append("<option value='"+nom+"'>"+nom+"</option>");
                    }
                    if(idCancha !== null){
                        $("#nuevoPartido #selectCancha option[value='"+idCancha+"']").attr("selected","selected");
                    }
                    select.selectmenu().selectmenu("refresh", $.mobile.navigate('#nuevoPartido',{transition:'slide'}));
                } else {
                    if(retorno.retorno == 'ERROR') {
                        $('#nuevoPartido #mensaje').html("<p>"+ retorno.mensaje +"</p>");
                    }
                }
            },
            error: function(err){
                $('#nuevoPartido #mensaje').html("<p>"+ JSON.parse(err.responseText) +"</p>");
            }
        });
}
function crearPartido(){
    var nombreCancha = $('#selectCancha').val();
    var nombrePartido = $('#nombrePartido').val();
    var inscripcion = $('#inscribirseSlider option[selected="selected"]').val();
    if(nombreCancha !== '' && nombrePartido !== '' && inscripcion !== ''){
        ajaxCrearPartido(nombreCancha, nombrePartido, inscripcion);
    } else{
        $('#nuevoPartido #mensaje').html("<p>Llene los campos antes de crear el partido.</p>");
    }
}
function ajaxCrearPartido(cancha, nombre, siONo){
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "http://quierojugar.tribus.com.uy/crearPartido?nombreCancha="+cancha+"&nombrePartido="+nombre+"&idUsuario="+idUsuario,          
        success: function(retorno){
            if(retorno.retorno == 'OK'){
                var ret = retorno;
                if(siONo == "true"){
                    $.when(inscribirsePartido(idUsuario, ret.idPartido)).then(cargarPaginaDetallePartido(ret.idPartido, 'slideleft'));
                } else {
                    cargarPaginaDetallePartido(ret.idPartido, "left");
                }
            } else {
                if(retorno.retorno == 'ERROR') {
                    $('#nuevoPartido #mensaje').html("<p>"+ retorno.mensaje +"</p>");
                }
            }
            navigator.vibrate(400);
        },
        error:function(err){
            $('#nuevoPartido #mensaje').html("<p>"+ $.parseJSON(err.responseText) +"</p>");
        }
    });
}
function inscribirsePartido(usuario, partido){
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "http://quierojugar.tribus.com.uy/inscribirseAPartido?idUsuario="+usuario+"&idPartido="+partido,  
        success: function(retorno){
            if(retorno.retorno == 'OK'){
                navigator.vibrate(400);
                return;
            }
            if(retorno.retorno == 'ERROR') {
               $('#nuevoPartido #mensaje').html("<p>"+ retorno.mensaje +"</p>");
            }
        },
        error:function(err){
            $('#nuevoPartido #mensaje').html("<p>"+ $.parseJSON(err.responseText) +"</p>");
        }
    });
}
