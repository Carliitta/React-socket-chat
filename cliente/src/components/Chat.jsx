import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { MdSend } from 'react-icons/md';
import {BsFillChatLeftDotsFill} from "react-icons/bs"
import swal from "sweetalert2";
import '../App.css'; 

const socket = io("http://localhost:3001");

const Chat = ({ nombre, modoOscuro, toggleModoOscuro }) => {
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [nombreUsuario, setNombreUsuario] = useState("");

  useEffect(() => {
    const receivedMessage = (message) => {
      setMensajes([message, ...mensajes]);
    };
    socket.on('message', receivedMessage);
    setNombreUsuario(nombre);

    return () => {
      socket.off('message', receivedMessage);
    };
  }, [mensajes, nombre]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nombreUsuario.trim() !== '') {
      socket.emit('message', mensaje, nombreUsuario);
      const newMessage = {
        body: mensaje,
        from: 'Yo'
      };
      setMensajes([newMessage, ...mensajes]);
      setMensaje('');
    } else {
      swal.fire({
        icon: 'error',
        text: `No puede enviar mensajes sin ingresar un nombre de usuario!`
      });
    }
  };

  return (
    <>
    <div className={`container-md chat-container ${modoOscuro ? 'modo-oscuro' : ''}`}>
     
      <div className=" mx-auto" style={{ width: '600px' }}>
        <div className="">
          <div className={`formulario card p-2 ${modoOscuro ? 'modo-oscuro' : ''}`}>
            <div className="card-header">
              <h5>Sala de Chat <BsFillChatLeftDotsFill/></h5>
            </div>
            <div className={`card-body mt-2 ${modoOscuro ? 'modo-oscuro' : ''}`}>
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
                    </div>
                </div>
                </div>
            ))}
            </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
 
      </>
  );
};

export default Chat;
