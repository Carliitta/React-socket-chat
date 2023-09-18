import React, { useState } from 'react';
import Acceso from './components/Acceso';
import Chat from './components/Chat';
import { FaSun, FaMoon } from 'react-icons/fa';
import { BsFillChatHeartFill} from 'react-icons/bs';

function App() {
  const [modoOscuro, setModoOscuro] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState('');

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
      {chatVisible ? (
        <Chat modoOscuro={modoOscuro} nombre={nombreUsuario} />
      ) : (
        <Acceso modoOscuro={modoOscuro} mostrarChat={mostrarChat} />
      )}
   
      <div  className='card-footer'>
       Creado por Carliitta Rodriguez <BsFillChatHeartFill style={{color:'green'}}/>
      </div>
    </div>
  );
}

export default App;

