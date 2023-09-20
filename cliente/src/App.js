import React, { useState } from "react";
import Acceso from "./components/Acceso";
import Chat from "./components/Chat";
import { FaSun, FaMoon } from "react-icons/fa";
import { BsFillChatHeartFill } from "react-icons/bs";
import {  Routes, Route} from 'react-router-dom';
function App() {
  const [modoOscuro, setModoOscuro] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState("");

  const toggleModoOscuro = () => {
    setModoOscuro(!modoOscuro);
  };

  const mostrarChat = (nombre) => {
    setNombreUsuario(nombre);
    setChatVisible(true);
   
  };

  return (
    <div className={`App ${modoOscuro ? 'modo-oscuro' : ''}`}>
        <h1>Chat React</h1>

      <div className="toggle-modo" onClick={toggleModoOscuro}>
        {modoOscuro ? <FaSun /> : <FaMoon />}
      </div>
     
    <Routes>
      <Route exact path="/" element={<Acceso modoOscuro={modoOscuro} mostrarChat={mostrarChat} />} />
      <Route exact path="/sala" element={<Chat  modoOscuro={modoOscuro} nombre={nombreUsuario} />} />
    </Routes>
  
    
   
      <div  className='card-footer'>
       Creado por Carliitta Rodriguez <BsFillChatHeartFill style={{color:'green'}}/>
      </div>
    </div>
  );
      }

export default App;


