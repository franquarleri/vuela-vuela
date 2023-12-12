import React, { useState, useEffect } from 'react';
import './App.css';
import CuotasContadoCalculator from './component/Calculator';

const Cotizaciones = () => {
  const [data, setData] = useState({});
  const [fechaActualizacion, setFechaActualizacion] = useState(new Date());
  const [cantidadDinero, setCantidadDinero] = useState('');
  const [conversor, setConversor] = useState('pesosAdolares');
  const [tipoCambio, setTipoCambio] = useState('oficial');
  const [errorCantidadDinero, setErrorCantidadDinero] = useState('');
  const [resultado, setResultado] = useState('');
  const [modalVisible, setModalVisible] = useState(false);


  useEffect(() => {
    obtenerCotizaciones();
    obtenerCotizacionUru();
    obtenerCotizacionReal();
    obtenerCotizacionEuro();
  }, []);
  

  const obtenerCotizacionUru = async () => {
    const UruApiUrl = 'https://dolarapi.com/v1/cotizaciones/uyu';

    try {
      const response = await fetch(UruApiUrl);
      const data = await response.json();

      const uru = {
        compra: data.compra,
        venta: data.venta,
      };

      actualizarTarjeta('urug-card', uru);
    } catch (error) {
      console.error('Error al obtener la cotización del peso uruguayo:', error);
    }
  };

  const obtenerCotizacionReal = async () => {
    const realApiUrl = 'https://dolarapi.com/v1/cotizaciones/brl';

    try {
      const response = await fetch(realApiUrl);
      const data = await response.json();

      const real = {
        compra: data.compra,
        venta: data.venta,
      };

      actualizarTarjeta('real-card', real);
    } catch (error) {
      console.error('Error al obtener la cotización del Real:', error);
    }
  };

  const obtenerCotizacionEuro = async () => {
    const euroApiUrl = 'https://dolarapi.com/v1/cotizaciones/eur';

    try {
      const response = await fetch(euroApiUrl);
      const data = await response.json();

      const euro = {
        compra: data.compra,
        venta: data.venta,
      };

      actualizarTarjeta('euro-card', euro);
    } catch (error) {
      console.error('Error al obtener la cotización del Euro:', error);
    }
  };

  const obtenerCotizaciones = async () => {
    const apiUrl = 'https://dolarapi.com/v1/dolares';

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        actualizarTarjeta('dolar-oficial-card', data[0]);
        actualizarTarjeta('dolar-blue-card', data[1]);
        actualizarTarjeta('Bolsa-card', data[2]);
        actualizarTarjeta('liqui-card', data[3]);
        actualizarTarjeta('solidario-card', data[4]);
        actualizarTarjeta('Mayorista-card', data[5]);

        // Actualiza la fecha en el footer
        const fechaActualizacion = new Date();
        setFechaActualizacion(fechaActualizacion);
      } else {
        console.error('La respuesta de la API no tiene la estructura esperada:', data);
      }
    } catch (error) {
      console.error('Error al obtener las cotizaciones:', error);
    }
  };

  const actualizarTarjeta = (cardId, moneda) => {
    setData((prevData) => ({
      ...prevData,
      [cardId]: moneda,
    }));
  };

  const calcularValor = () => {
    // Restablece los mensajes de error
    setErrorCantidadDinero('');
    setResultado('');
  
    const cantidad = parseFloat(cantidadDinero);
  
    if (isNaN(cantidad) || cantidad <= 0) {
      setErrorCantidadDinero('Debe ingresar una cantidad válida.');
      return;
    }
  
    const cards = {
      oficial: data['dolar-oficial-card'],
      blue: data['dolar-blue-card'],
      Bolsa: data['Bolsa-card'],
      liqui: data['liqui-card'],
      solidario: data['solidario-card'],
      Mayorista: data['Mayorista-card'],
      real: data['real-card'],
      uru: data['urug-card'],
      euro: data['euro-card'],
    };
  
    const valorCambio = cards[tipoCambio]?.[conversor.toLowerCase()] || 0;
  
    // Asegúrate de que valorCambio no sea cero antes de la operación de división
    if (valorCambio === 0) {
      setErrorCantidadDinero('El tipo de cambio no puede ser cero.');
      return;
    }
  
    // Actualiza el resultado directamente
    const resultadoCalculado = conversor === 'pesosAdolares' ? cantidad / valorCambio : cantidad * valorCambio;
  
    setResultado(isNaN(resultadoCalculado) ? 'No se puede calcular' : `$${resultadoCalculado.toFixed(2)}`);
  };
   
  const limpiarCampos = () => {
    setCantidadDinero('');
    setTipoCambio('oficial');
    setConversor('pesosAdolares');
    setResultado('');
    setErrorCantidadDinero('');
  };

  const openModal = () => {
    console.log('Abrir modal');
    setModalVisible(true);
  };
  

  const closeModal = () => {
    setModalVisible(false);
  };


  return (
    <div className="App">
      <nav>
        <ul>
          <li>
          <a href="#openModal" onClick={(e) => { e.preventDefault(); openModal(); }}>
              Currency
                      </a>

            <div className="centered-container"></div>
          </li>
          <li>
            <a href="#cuotas">Cuotas o Contado</a>
          </li>
          <li><a href="#cuotas">  Politicas de Privacidad</a></li>
        </ul>
      </nav>
      <section>
        <div className="container">
          <h1>Cotización de Monedas</h1>
          <div className="cards">
            
            {/* Tarjeta Dólar Oficial */}
            <div className="card" id="dolar-oficial-card">
              <h2>Dólar Oficial</h2>
              <p className="compra">Compra: {data['dolar-oficial-card']?.compra || 'Cargando...'}</p>
              <p className="venta">Venta: {data['dolar-oficial-card']?.venta || 'Cargando...'}</p>
            </div>

            {/* Tarjeta Dólar Blue */}
            <div className="card" id="dolar-blue-card">
              <h2>Dólar Blue</h2>
              <p className="compra">Compra: {data['dolar-blue-card']?.compra || 'Cargando...'}</p>
              <p className="venta">Venta: {data['dolar-blue-card']?.venta || 'Cargando...'}</p>
            </div>
            {/* Tarjeta Dólar Bolsa */}
            <div className="card" id="Bolsa-card">
              <h2>Dólar Bolsa</h2>
              <p className="compra">Compra: {data['Bolsa-card']?.compra || 'Cargando...'}</p>
              <p className="venta">Venta: {data['Bolsa-card']?.venta || 'Cargando...'}</p>
            </div>
            {/* Tarjeta Dólar liqui */}
            <div className="card" id="liqui-card">
              <h2>Dólar Contado con Liqui</h2>
              <p className="compra">Compra: {data['liqui-card']?.compra || 'Cargando...'}</p>
              <p className="venta">Venta: {data['liqui-card']?.venta || 'Cargando...'}</p>
            </div>
            {/* Tarjeta Dólar solidario */}
            <div className="card" id="solidario-card">
              <h2>Dólar Solidario</h2>
              <p className="compra">Compra: {data['solidario-card']?.compra || 'Cargando...'}</p>
              <p className="venta">Venta: {data['solidario-card']?.venta || 'Cargando...'}</p>
            </div>
            {/* Tarjeta Dólar Mayorista */}
            <div className="card" id="Mayorista-card">
              <h2>Dólar Mayorista</h2>
              <p className="compra">Compra: {data['Mayorista-card']?.compra || 'Cargando...'}</p>
              <p className="venta">Venta: {data['Mayorista-card']?.venta || 'Cargando...'}</p>
            </div>
            {/* Tarjeta Real */}
            <div className="card" id="real-card">
              <h2>Real</h2>
              <p className="compra">Compra: {data['real-card']?.compra || 'Cargando...'}</p>
              <p className="venta">Venta: {data['real-card']?.venta || 'Cargando...'}</p>
            </div>
            {/* Tarjeta peso uruguayo */}
            <div className="card" id="urug-card">
              <h2>Peso Uruguayo</h2>
              <p className="compra">Compra: {data['urug-card']?.compra || 'Cargando...'}</p>
              <p className="venta">Venta: {data['urug-card']?.venta || 'Cargando...'}</p>
            </div>
            {/* Tarjeta Dólar Euro */}
            <div className="card" id="euro-card">
              <h2>Euro</h2>
              <p className="compra">Compra: {data['euro-card']?.compra || 'Cargando...'}</p>
              <p className="venta">Venta: {data['euro-card']?.venta || 'Cargando...'}</p>
            </div>
          </div>
        </div>
      </section>
      {/* Calculadora de Cuotas o Contado */}
      <CuotasContadoCalculator />
      <footer>
        <p className="update-time">Actualizado el: {fechaActualizacion.toLocaleString() || 'Cargando...'}</p>
        <p>© 2023 Vuela Vuela. Todos los derechos reservados.</p>
      </footer>
      <div id="cookie-banner" className="cookie-banner">
        <p>Este sitio web utiliza cookies. Al continuar navegando, aceptas nuestro uso de cookies.</p>
        <button id="accept-cookies">Aceptar</button>
        <button id="reject-cookies">Rechazar</button>
      </div>

      {/* Modal de la calculadora */}
      <div id="myModal" className={`modal ${modalVisible ? 'visible' : ''}`}>
        <div className="modal-content">
          <span id="closeModal" className="close" onClick={closeModal}>
            &times;
          </span>
          <div id="calculator" className="calculator">
            <label htmlFor="cantidadDinero">Cantidad de Dinero:</label>
            <input
              type="number"
              id="cantidadDinero"
              value={cantidadDinero}
              onChange={(e) => setCantidadDinero(e.target.value)}
            />
            <span className="error" id="errorCantidadDinero">
              {errorCantidadDinero}
            </span>
            <label htmlFor="conversor">Conversión:</label>
            <select
              id="conversor"
              value={conversor}
              onChange={(e) => setConversor(e.target.value)}
            >
              <option value="pesosAdolares">Pesos a ...</option>
              <option value="dolaresApesos">... a Pesos</option>
            </select>

            <label htmlFor="tipoCambio">Moneda:</label>
            <select
              id="tipoCambio"
              value={tipoCambio}
              onChange={(e) => setTipoCambio(e.target.value)}
            >
              <option value="blue">Dólar Blue</option>
              <option value="Bolsa">Dólar Bolsa</option>
              <option value="liqui">Dólar Liqui</option>
              <option value="solidario">Dólar Solidario</option>
              <option value="Mayorista">Dólar Mayorista</option>
              <option value="real">Real</option>
              <option value="uru">P.Uruguayo</option>
              <option value="euro">Euro</option>
            </select>

            <button onClick={calcularValor}>Calcular</button>
            <button onClick={limpiarCampos}>Limpiar</button>

            <p>
              <span id="resultado">{resultado}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cotizaciones;
