const { io } = require('../server');
const {Usuarios} = require('../clases/usuarios');
const {crearMensaje} = require('../utils/utilidades')

const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (data,callback) => {
        

        
        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre y la sala es necesario'
            })
        }

        client.join(data.sala);//Permite unirlo a una sala

         usuarios.agregarPersona(client.id, data.nombre, data.sala);

        client.broadcast.to(data.sala).emit('listaPersonas',usuarios.getPersonasPorSala(data.sala));
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador',`${data.nombre} se unio al  chat`));

        return callback(usuarios.getPersonasPorSala(data.sala));
    });

    client.on('crearMensaje',(data,callback)=>{

        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre,data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje',mensaje);

        return callback(mensaje);

    })

    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador',`${personaBorrada.nombre} abandono el chat`));
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas',usuarios.getPersonasPorSala(personaBorrada.sala));
    });
    
    //Mensaje Privados
    client.on('mensajePrivado', data =>{
        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit('mensajePrivado',crearMensaje(persona.nombre,data.mensaje));
    })

});