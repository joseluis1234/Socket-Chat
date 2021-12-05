let socket = io();

var params = new URLSearchParams(window.location.search);

if(!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}

let usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('entrarChat', usuario,(resp)=>{
        renderizarUsuarios(resp);
    });
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});

// Escuchar información
socket.on('crearMensaje', function(mensaje) {

    renderizarMensajes(mensaje,false);
    scrollBottom();

});

//Escuhar cambios de usuarios cuando entra y sale
socket.on('listaPersonas', function(personas) {

    renderizarUsuarios(personas);

});

//Mensajes Privados
socket.on('mensajePrivado',(mensaje)=>{
    console.log('Mensaje Privado: ',mensaje)
})