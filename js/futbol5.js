favoritos = [];
function hacerLogin(){
  var usuarioLogin = $("#usuarioLogin").val();
  var claveLogin = $("#claveLogin").val()
  if(usuarioLogin != "" && claveLogin !=""){
    $.ajax({
      url:'http://quierojugar.tribus.com.uy/login',
      type:'GET',
      dataType:'json',
      data: {user:usuarioLogin, password:claveLogin},
      success: function(response){
          $.mobile.navigate('#listadoCanchas');
      },
      error: function(err)
      {
        console.log("error! -> " + err);
      }
    });
    //llamada a la api para verificar que exista el usuario con esa clave
    //Crear mensaje de error si falla
    //Si hay exito
        //1- Guardar nombre usuario: Como evito que se pueda cambiar luego?
        //2- hacer llamada a traer canchas y partidos, levantar favoritos y cargar paginas necesarias
        //2- mensaje de bienvenida y mas transiciones
    //Aca se redirige a la pagina
    }
    $("#messageLogin").text("(*) Por favor complete todos los campos requeridos");
}
function irARegistro(){
    $.mobile.navigate('#registro');
}
function hacerRegistro(){
  var nombre = $("#nombreNew").val();
  var username = $("#usuarioNew").val();
  var password = $("#claveNew").val();
  if(nombre != "" && username !="" && password != ""){
    $.ajax({
      url:'http://quierojugar.tribus.com.uy/registrar ',
      type:'POST',
      dataType:'json',
      data: {user:username, password:password, nombre:nombre},
      success: function(response){
          //vacio variables y redirecciono a login
          $.mobile.navigate('#login');
          //doy aviso de registo existoso
        //$("#mensaje").text(response);
      },
      error: function(err)
      {
        console.log("error! -> " + err);
      }
    });
  }
    //llamada a la api para verificar que no exista el usuario,
    //Crear mensaje de error si falla
    //Si hay exito
        //1- Guardar nombre usuario: Como evito que se pueda cambiar luego?
        //2- hacer llamada a traer canchas y partidos, levantar favoritos y cargar paginas necesarias
        //2- mensaje de bienvenida y mas transiciones
    //Aca se redirige a la pagina
    $("#messageRegister").text("(*) Por favor complete todos los campos requeridos");
}
function hacerLogout(){
    //Borrar sesion del usuario
    //Transiciones
    //redirigir a login
    $.mobile.navigate('#login');
}
//Al cargar las paginas siempre debo checkear que estoy logeado y sino redirigirme al login
    //evento beforepagechange puede checkear si estoy logeado.
function traerCanchasyPartidos(){

}
function guardarCanchaFavorita(esto){
    var id = esto.prev().attr('id');
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
