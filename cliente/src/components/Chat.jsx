import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { MdSend } from 'react-icons/md';
import { BsFillChatLeftDotsFill, BsFillPersonLinesFill } from "react-icons/bs"
import swal from "sweetalert2";
import '../App.css';
import { useNavigate } from "react-router-dom";
//const socket = io("http://localhost:3001");
const socket = io("https://chat-ln21.onrender.com"); 

const Chat = ({ nombre, modoOscuro }) => {
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [mostrarBotonSalir, setMostrarBotonSalir] = useState(false);

  const navigate = useNavigate()

  useEffect(() => {
      const receivedMessage = (message) => {
        setMensajes([message, ...mensajes]);
      };
      socket.on('message', receivedMessage);
      setNombreUsuario(nombre);
      // Manejar el evento beforeunload para desconectar al usuario
      const handleBeforeUnload = () => {
        if (nombreUsuario) {
          socket.emit('salir', nombreUsuario);
        }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      socket.off('message', receivedMessage);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [mensajes, nombre]);


  //* Escuchar el evento 'usuarios' para recibir la lista de usuarios conectados
  useEffect(() => {
    const receivedUsuarios = (lista) => {
      setUsuarios(lista);

    };
    setMostrarBotonSalir(true);
    socket.on('usuarios', receivedUsuarios);

  }, [usuarios]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombreUsuario || nombreUsuario.trim() === "") {
      swal.fire({
        icon: 'error',
        text: `No puede enviar mensajes sin ingresar un nombre de usuario!`
      });
      return; // Evita continuar si nombreUsuario no tiene un valor válido
    }

    else {
      const horaActual = new Date().toLocaleTimeString().slice(0, 5) // Obtiene la hora actual en formato de cadena
      socket.emit('message', mensaje, nombreUsuario, horaActual);
      const newMessage = {
        body: mensaje,
        from: 'Yo',
        time: horaActual
      };
      // console.log(newMessage)
      setMensajes([newMessage, ...mensajes]);
      setMensaje('');
    }
  };

  const salirUsuario = (user) => {

    socket.emit('salir', user);
    navigate('/');
  };

  return (
    <>
      <div id="sala" className={`container-md chat-container ${modoOscuro ? 'modo-oscuro' : ''}`}>

        <div className="row mx-auto" >
          <div className="col-md-8 ">
            <div className={`formulario card p-2 ${modoOscuro ? 'modo-oscuro' : ''}`}>
              <div className="card-header">
                <h5>Sala de Chat <BsFillChatLeftDotsFill /></h5>
              </div>
            
              <div className={`chat card-body mt-2 ${modoOscuro ? 'modo-oscuro' : ''}`}>
                <form className="form mx-auto" onSubmit={handleSubmit}>
                  <div className={`input-group ${modoOscuro ? 'modo-oscuro' : ''}`}>
                    <input
                      required
                      className={`form-control ${modoOscuro ? 'modo-oscuro' : ''}`}
                      type="text"
                      value={mensaje}
                      onChange={(e) => setMensaje(e.target.value)}
                      placeholder="Escribe un mensaje..."
                    />
                    <div className="input-group-append">
                      <button type="submit" style={{ border: 'none', background: 'none' }}>
                        <MdSend style={{ fontSize: '30px', color: 'green' }} />
                      </button>
                    </div>
                  </div>
                </form>
                <ul className="list-unstyled">
                  {mensajes.map((message, index) => (
                    <div key={index} className={`d-flex p-2 ${message.from === "Yo" ? "justify-content-end" : "justify-content-start"}`}>
                      <div className={`card mb-1 shadow border-1 ${message.from === "Yo" ? (modoOscuro ? "mensaje-cliente-oscuro" : "mensaje-cliente-claro") : (modoOscuro ? "mensaje-otros-oscuro" : "mensaje-otros-claro")}`}>
                        <div className={`card-body ${modoOscuro ? 'texto-mensaje-oscuro' : 'texto-mensaje-claro'}`}>
                          <small className="">{message.from}: {message.body}</small>
                          <small style={{ opacity: '0.6', marginLeft: '10px', fontSize: '12px' }}> {message.time}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          {/*     <!-- Lista de usuarios conectados --> */}

          <div className="usuarios col-md-3">
            <div className={` card p-2 ${modoOscuro ? 'modo-oscuro' : ''}`}>
              <div className=" lista-user card-header">
                <h5>Usuarios conectados</h5>
              </div>
              <div className="contenedor-lista card-body ">

                {usuarios?.map((user, index) => {
                  return (
                    <ul key={index} className="lista">
                      <li>
                        <BsFillPersonLinesFill
                          style={{ color: 'green', marginRight: '5px' }}
                        />
                        {user}
                      </li>
                      {nombreUsuario === user && mostrarBotonSalir && (
                        <button className="btn btn-danger btn-sm" onClick={() => salirUsuario(user)}>Salir</button>
                      )}
                    </ul>
                  );
                })}

              </div>
            </div>

          </div>

        </div>
      </div>

    </>
  );
};

export default Chat;
