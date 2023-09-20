const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const path = require('path')
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
  //  origin: "http://localhost:3000",
   origin: "https://chatear.netlify.app", // URL de  cliente React
    methods: ["GET", "POST"],
  },
});
app.use(cors());

let names=[]

//Escuchamos la conexión de los clientes. Podemos imprimir el id del cliente conectado
io.on('connection', (socket) =>{
  //console.log('user connected')
  //console.log(socket.id)

  socket.on('message', (message, nickname,time) => {
      //console.log("nombre",nickname)
      //Envio al resto de clientes con broadcast.emit
      socket.broadcast.emit('message', {
          body: message,
          from: nickname,
         time:time
          
      })
  })

 
  
 //* Manejar la recepción de nombres de usuario

 socket.on('nombres', (nickname) => {
  let nombreExistente = names.indexOf(nickname) !== -1;

  // Si el nombre ya existe, agrega tres números aleatorios al final
  if (nombreExistente) { 
    let nombreModificado = nickname;
    while (names.indexOf(nombreModificado) !== -1) {
      // Genera tres números aleatorios entre 100 y 999
      const numeroAleatorio = Math.floor(100 + Math.random() * 900);
      nombreModificado = `${nickname}${numeroAleatorio}`;
    }
    nickname = nombreModificado;
  }

  // Agrega el nombre de usuario a la lista de nombres utilizados
  names.push(nickname);
  console.log(nickname);
  // Emitir el nombre de usuario a todos los clientes (broadcast)
  socket.broadcast.emit('nombres', { user: nickname });
  // Emitir la lista de usuarios conectados a todos los clientes
  actualizarUsuarios();
});



socket.on('salir', user =>{
  //Si un usuario se desconecta lo eliminamos del array
  if(!user){
      return;
  }else{
      //buscamos su posición en el array y lo eliminamos con splice()
      names.splice(names.indexOf(user), 1);
      //Enviamos al cliente el array de usuarios actualizado:
      actualizarUsuarios();

  }
});
})


function actualizarUsuarios(){
  io.sockets.emit('usuarios', names);
}

//servidor 
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Servidor Socket.io escuchando en el puerto ${PORT}`);
});
