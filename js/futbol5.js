var favoritos = [];
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
                traerCanchas();
                $.mobile.navigate('#listadoCanchas');
            },
            error:function(retorno){
                $('#login #mensaje').html("<p>"+ retorno.mensaje +"</p>")
            }
        })
    } else {
        $('#mensaje').html("<p>Ingrese usuario y clave</p>")
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
                traerCanchas();
                $.mobile.navigate('#listadoCanchas');
                //borro los campos del LOGIN
                //$('#signup #usuario').text("");
                //$('#signup #clave').empty();
            },
            error:function(retorno){
                $('#login #mensaje').html("<p>"+ retorno.mensaje +"</p>")
            }
        })
    } else {
        $('#mensaje').html("<p>Ingrese usuario, clave y nombre de usuario</p>")
    }
}

function hacerLogout(){
    //Borrar sesion del usuario
    idUsuario = -1;
    //redirigir a login
    $.mobile.navigate('#login');
}

function traerCanchas(){
    if(idUsuario != -1){
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "http://quierojugar.tribus.com.uy/getCanchas",
            data:'',
            success: function(retorno){
                var lista = $("#listadoCanchas #canchas");
                lista.empty();
                var largo = retorno.canchas.length;
                var i;
                for(i=0; i<largo; i++){
                    lista.append(
                        "<li><a href='#detalleCancha' id='" + retorno.canchas[i].nombre + "'>" + retorno.canchas[i].nombre + "</a>"
                        + "<a data-cancha='"+retorno.canchas[i].nombre+"' href='#' onclick='guardarCanchaFavorita($(this))'></a></li>"
                    );
                }
                lista.listview('refresh');
                marcarFavoritos();
                $.mobile.navigate('#listadoCanchas');
            },
            error:function(retorno){
                $('#login #mensaje').html("<p>"+ retorno.mensaje +"</p>")
            }
        })
    } else {
        $.mobile.navigate('#login');
    }
}

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
