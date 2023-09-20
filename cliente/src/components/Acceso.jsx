import React, { useState, useEffect } from "react";
import { RiLoginBoxLine } from "react-icons/ri";
import io from "socket.io-client";
import swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
//const socket = io("http://localhost:3001");
const socket = io("https://chat-ln21.onrender.com"); 

const Acceso = ({ modoOscuro, mostrarChat }) => {
  const [nombre, setNombre] = useState("");
  const navigate = useNavigate()


  const AccederChat = (e) => {
    e.preventDefault();
 
    if (nombre.trim() === "") {
      swal.fire({
        icon: "error",
        text: `Para chatear debe ingresar un nombre de usuario!`,
      });
    } else {
      // Intenta registrarse con el nombre de usuario
      socket.emit("nombres", nombre);
    
      mostrarChat(nombre);
      navigate("/sala");
      swal.fire({
        icon: "success",
        text: `Bienvenid@ ${nombre}, ya puedes comenzar a chatear:)`,
      });
    }
  
    
  };

  return (
    <>
      <div id="inicio" className={`card p-2 mx-auto ${modoOscuro ? "modo-oscuro" : ""}`} style={{ width: "20rem" }}>
        <h5 className="card-header">Ingrese un nombre de usuario</h5>
        <div className="card-body">
          <form onSubmit={AccederChat}>
            <div className="input-group">
              <input
             
                required
                className={`form-control ${modoOscuro ? "modo-oscuro" : ""}`}
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              <div className="input-group-append">
                <button type="submit" style={{ border: "none", background: "none" }}>
                  <RiLoginBoxLine style={{ fontSize: "30px", color: "green" }} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Acceso;

