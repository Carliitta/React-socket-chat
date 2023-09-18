import React, { useState, useEffect } from "react";
import { RiLoginBoxLine } from "react-icons/ri";
import io from "socket.io-client";
import swal from "sweetalert2";

const socket = io("http://localhost:3001");

const Acceso = ({ modoOscuro, mostrarChat }) => {
  const [nombre, setNombre] = useState("");
  const [habilitado, setHabilitado] = useState(false);

  useEffect(() => {
    socket.on("nombre-existe", (nickname) => {
      swal.fire({
        icon: "error",
        text: `Ya existe alguien con el nombre de usuario "${nickname}" en el chat. Por favor, elija otro.`,
      });
      setHabilitado(false);
    });
    return () => {
      socket.off("nombre-existe");
    };
  }, []);

  const AccederChat = (e) => {
    e.preventDefault();

    if (nombre.trim() !== "") {
      socket.emit("nombres", nombre);
      setHabilitado(true);

      mostrarChat(nombre); // Llama a la función mostrarChat para mostrar el chat
      swal.fire({
        icon: "success",
        text: `Bienvenid@ ${nombre}, ya puedes comenzar a chatear:)`,
      });
    } else {
      swal.fire({
        icon: "error",
        text: `Para chatear debe ingresar un nombre de usuario!`,
      });
    }
  };

  return (
    <>
      <div className={`card p-2 mx-auto ${modoOscuro ? "modo-oscuro" : ""}`} style={{ width: "20rem" }}>
        <h5 className="card-header">Ingrese un nombre de usuario</h5>
        <div className="card-body">
          <form onSubmit={AccederChat}>
            <div className="input-group">
              <input
                disabled={habilitado}
                required
                className={`form-control ${modoOscuro ? "modo-oscuro" : ""}`}
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              <div className="input-group-append">
                <button type="submit" style={{ border: "none", background: "none" }} disabled={habilitado}>
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

