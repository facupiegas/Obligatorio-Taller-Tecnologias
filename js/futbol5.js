var favoritos = [];


// login & Signup, Logout
var idUsuario = -1;
function hacerLogin(){
    var usuario = $('#login #usuario').val();
    var pass = $('#login #clave').val();
    if(usuario != '' & pass != ''){
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "http://quierojugar.tribus.com.uy/login?user=" + usuario + "&password=" + pass,
            data:'',
            success: function(retorno){
                idUsuario = retorno.id_usuario;
                cargarPaginaListadoCanchas();
            },
            error:function(retorno){
                $('#login #mensaje').html("<p>"+ retorno.mensaje +"</p>")
            }
        })
    } else {
        $('#login #mensaje').html("<p>Ingrese usuario y clave</p>")
    }
}
function hacerSignup(){
    var usuario = $('#signup #usuario').val();
    var pass = $('#signup #clave').val();
    var nombre = $('#signup #nombre').val();
    if(usuario != '' && pass != '' && nombre != ''){
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "http://quierojugar.tribus.com.uy/registrar?user=" + usuario + "&password=" + pass + '&nombre='+ nombre,
            data:'',
            success: function(retorno){
                idUsuario = retorno.id_usuario;
                cargarPaginaListadoCanchas();
            },
            error:function(retorno){
                $('#signup #mensaje').html("<p>"+ retorno.mensaje +"</p>")
            }
        })
    } else {
        $('#signup #mensaje').html("<p>Ingrese usuario, clave y nombre de usuario</p>")
    }
}
function hacerLogout(){
    //Borrar sesion del usuario
    idUsuario = -1;
    //redirigir a login
    $.mobile.navigate('#login');
}


//Listado canchas

function cargarPaginaListadoCanchas(){
    if(idUsuario != -1){
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "http://quierojugar.tribus.com.uy/getCanchas",
            data:'',
            success: function(retorno){
                var lista = $("#listadoCanchas #canchas").listview();
                lista.empty();
                var largo = retorno.canchas.length;
                var i;
                for(i=0; i<largo; i++){
                    lista.append(
                        "<li><a href='#detalleCancha' id='" + retorno.canchas[i].nombre + "'>" + retorno.canchas[i].nombre + "</a>"
                        + "<a data-cancha='"+retorno.canchas[i].nombre+"' href='#' onclick='guardarCanchaFavorita($(this))'></a></li>"
                    );
                }
                marcarFavoritos();
                lista.listview('refresh',$.mobile.navigate('#listadoCanchas'));

                ;
            },
            error:function(retorno){
                $('#login #mensaje').html("<p>"+ retorno.mensaje +"</p>")
            }
        })
    } else {
        $.mobile.navigate('#login');
    }
}


//Favoritos
function marcarFavoritos(){
}

function guardarCanchaFavorita(esto){
    var id = esto.data('cancha');
    if(favoritos.indexOf(id) == -1){
        favoritos.push(id);
        esto.removeClass('ui-icon-star');
        esto.addClass('ui-icon-staryellow');
        esto.attr('onclick', 'borrarCanchaFavorita($(this))')
    }
    guardarFavoritos(favoritos);
}
function borrarCanchaFavorita(esto){
    var id = esto.prev().attr('id');
    var index = favoritos.indexOf(id);
    if(index > -1){
        favoritos.splice(index, 1);
        esto.removeClass('ui-icon-staryellow');
        esto.addClass('ui-icon-star');
        esto.attr('onclick', 'guardarCanchaFavorita($(this))')
    }
    guardarFavoritos(favoritos);
}
function borrarDeFavoritos(esto){
    esto.closest('li').remove();
}
function guardarFavoritos(array){
    //Funcion que guarda con SQL los favoritos en la base de datos local
}
function traerCanchasFavoritas(){
    //Funcion que trae los favoritos de la base de datos local
}

//Detalle Partido
function cargarPaginaDetallePartido(partido){
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "http://quierojugar.tribus.com.uy/getPartido?idPartido="+partido,
        success: function(retorno){
            if(retorno.retorno = 'OK'){
                if(retorno.partido.cantidad_jugadores == 10) {
                    $('#detallePartido #info').append(
                        "<p><b>Nombre:</b> " + retorno.partido.nombre + "</p>"
                        + "<p><b>Cancha:</b> " + retorno.partido.cancha + "</p>"
                        + "<p><b>Jugadores:</b> " + retorno.partido.cantidad_jugadores + "</p>"
                        );
                } else {
                    $('#detallePartido #info').append(
                        "<p><b>Nombre:</b> " + retorno.partido.nombre + "</p>"
                        + "<p><b>Cancha:</b> " + retorno.partido.cancha + "</p>"
                        + "<p><b>Jugadores:</b> " + retorno.partido.cantidad_jugadores + "</p>"
                        + "<a id='jugar' href='#' data-role='button' data-partido='"+retorno.partido.id+"' onclick='inscribirsePartido(), cargarPaginaDetallePartido($(this).data(&quot;partido&quot;))'>Jugar</a>"
                    );
                    $('#jugar').button();
                }
                var listaJugadores = $('#detallePartido #listaJugadores').listview().empty();
                var jugadoresPartido = retorno.partido.jugadores;
                var largo =  jugadoresPartido.length;
                var i;
                for(i=0; i<largo; i++){
                    listaJugadores.append("<li>" + jugadoresPartido[i] + "</li>");
                }
                listaJugadores.listview('refresh', $.mobile.navigate('#detallePartido'));
            } else {
                if(retorno.retorno == 'ERROR') {
                    $('#detalleCancha #mensaje').html("<p>"+ retorno.mensaje +"</p>")
                }
            }
        },
        error: function(err){
            $('#detalleCancha #mensaje').html("<p>"+ JSON.parse(err.responseText) +"</p>")
        }
    });
}



//Crear partido
function cargarPaginaNuevoPartido(idCancha){
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "http://quierojugar.tribus.com.uy/getCanchas",
            success: function(retorno){
                if(retorno.retorno = 'OK'){
                    var select = $('#nuevoPartido #selectCancha');
                    select.html("");
                    var largo = retorno.canchas.length;
                    var i;
                    for(i=0; i<largo; i++){
                        var nom = retorno.canchas[i].nombre;
                        select.append("<option value='"+nom+"'>"+nom+"</option>");
                    }
                    if(idCancha != null){
                        $("#nuevoPartido #selectCancha option[value='"+idCancha+"']").attr("selected","selected");
                    }
                    select.selectmenu("refresh", $.mobile.navigate('#crearPartido'))
                } else {
                    if(retorno.retorno == 'ERROR') {
                        $('#nuevoPartido #mensaje').html("<p>"+ retorno.mensaje +"</p>")
                    }
                }
            },
            error: function(err){
                $('#nuevoPartido #mensaje').html("<p>"+ JSON.parse(err.responseText) +"</p>")
            }
        });
}
function crearPartido(){
    var nombreCancha = $('#selectCancha').val();
    var nombrePartido = $('#nombrePartido').val();
    var inscripcion = $('#inscribirseSlider').val();
    if(nombreCancha != '' && nombrePartido != '' && inscripcion != ''){
        ajaxCrearPartido(nombreCancha, nombrePartido, inscripcion);
    } else{
        $('#nuevoPartido #mensaje').html("<p>Llene los campos antes de crear el partido.</p>")
    }
}
function ajaxCrearPartido(cancha, nombre, siONo){
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "http://quierojugar.tribus.com.uy/crearPartido?nombreCancha="+cancha+"&nombrePartido="+nombre+"&idUsuario="+idUsuario,
        data:'',            
        success: function(retorno){
            if(retorno.retorno == 'OK'){
                var ret = retorno
                if(siONo == true){
                    inscribirsePartido(idUsuario, ret.idPartido);
                }
                cargarPaginaDetallePartido(ret.idPartido);
            } else {
                if(retorno.retorno == 'ERROR') {
                    $('#nuevoPartido #mensaje').html("<p>"+ retorno.mensaje +"</p>")
                }
            }
        },
        error:function(err){
            $('#nuevoPartido #mensaje').html("<p>"+ $.parseJSON(err.responseText) +"</p>")
        }
    })
}
function inscribirsePartido(usuario, partido){
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "http://quierojugar.tribus.com.uy/inscribirseAPartido?idUsuario="+usuario+"&nombrePartido="+idPartido,
        data:'',            
        success: function(retorno){
            if(retorno.retorno == 'ERROR') {
               $('#nuevoPartido #mensaje').html("<p>"+ retorno.mensaje +"</p>")
            }
        },
        error:function(err){
            $('#nuevoPartido #mensaje').html("<p>"+ $.parseJSON(err.responseText) +"</p>")
        }
    })
}
