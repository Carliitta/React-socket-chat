const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const path = require('path')
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // URL de  cliente React
    methods: ["GET", "POST"],
  },
});
app.use(cors());
//<---------------------------------------------->
app.use(express.static(path.join(__dirname, '../cliente/build')));
//console.log(__dirname);
//-------------------------------------------//
let names=[]
const usedUsernames = new Set();
//Escuchamos la conexión de los clientes. Podemos imprimir el id del cliente conectado
io.on('connection', (socket) =>{
  //console.log('user connected')
  //console.log(socket.id)

  socket.on('message', (message, nickname) => {
      //console.log("nombre",nickname)
      //Envio al resto de clientes con broadcast.emit
      socket.broadcast.emit('message', {
          body: message,
          from: nickname
      })
  })
  //recibir los nombres
 
 /*  socket.on('nombres', (nickname) => {
    names.push(nickname)
  /*   console.log(names) */
    //Envio al resto de clientes con broadcast.emit
  /*   socket.broadcast.emit('nombres', {
        user: names
    }) */ 
   
//})
 //* Manejar la recepción de nombres de usuario

 socket.on('nombres', (nickname) => {
  if (usedUsernames.has(nickname)) {
    // Enviar un mensaje al cliente para indicar que el nombre ya existe
    socket.emit('nombre-existe', nickname);
  } else {
    // Agregar el nombre de usuario a la lista de nombres utilizados
    usedUsernames.add(nickname);
    // Emitir el nombre de usuario a todos los clientes (broadcast)
    socket.broadcast.emit('nombres', { user: nickname });
  }
});
})

//servidor 
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Servidor Socket.io escuchando en el puerto ${PORT}`);
});
