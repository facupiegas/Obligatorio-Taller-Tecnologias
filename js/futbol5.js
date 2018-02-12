function hacerLogin(){
    //llamada a la api para verificar que exista el usuario con esa clave
    //Crear mensaje de error si falla
    //Si hay exito
        //1- Guardar nombre usuario: Como evito que se pueda cambiar luego?
        //2- hacer llamada a traer canchas y partidos, levantar favoritos y cargar paginas necesarias
        //2- mensaje de bienvenida y mas transiciones
    //Aca se redirige a la pagina
    $.mobile.navigate('#listadoCanchas');
}
function hacerSignup(){
    //llamada a la api para verificar que no exista el usuario,
    //Crear mensaje de error si falla
    //Si hay exito
        //1- Guardar nombre usuario: Como evito que se pueda cambiar luego?
        //2- hacer llamada a traer canchas y partidos, levantar favoritos y cargar paginas necesarias
        //2- mensaje de bienvenida y mas transiciones
    //Aca se redirige a la pagina
    $.mobile.navigate('#listadoCanchas');
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
function guardarCanchaFavorita(){

}
function traerCanchasFavoritas(){

}
