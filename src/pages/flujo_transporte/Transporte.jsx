import React, { useState, useEffect } from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Transporte.css';
import es from 'date-fns/locale/es'; // Importa la localización en español

// Registra la localización en español
registerLocale('es', es);

// Componente para un input de fecha personalizado (botón)
const CustomDateInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
  <button type="button" className="custom-date-input" onClick={onClick} ref={ref}>
    {value || placeholder || "Selecciona una fecha"}
  </button>
));

const sedesOptions = [
  { id: 'sede1', name: 'Parque', value: 200000 },
  { id: 'sede2', name: 'Llano', value: 100000 },
  { id: 'sede3', name: 'Plaza', value: 200000 },
  { id: 'sede4', name: 'Vegas', value: 100000 },
  { id: 'sede5', name: 'Barbosa', value: 250000 },
  { id: 'sede6', name: 'San juan', value: 100000 },
];

const conductorOptions = [
  { value: 'conductor1', label: 'Juan Carlos Alvarez Saldarriaga' },
  { value: 'conductor2', label: 'Duvan Franco Morales' },
  { value: 'conductor3', label: 'Stiven Flores López' },
  { value: 'conductor4', label: 'Juan Guillermo Arango Osorio' },
  { value: 'conductor5', label: 'Ivan Dario Echavarria Torres' },
  { value: 'conductor6', label: 'Jorge Luis Velasquez Giraldo' },
  { value: 'conductor7', label: 'Edwin Leandro Guerra Gaviria' },
  { value: 'conductor8', label: 'Manuel Alexander Lujan Meneses' },
  { value: 'conductor9', label: 'Juan Felipe Diaz Serna' },
  { value: 'conductor10', label: 'Norbey Zapata' },
  { value: 'otro', label: 'Otro' },
];

const conductorPlacas = {
  conductor1: 'TNH 033',
  conductor2: 'THX 973',
  conductor3: 'SVO 247',
  conductor4: 'WNP585',
  conductor5: 'ESQ501',
  conductor6: 'GTX302',
  conductor7: 'KSK176',
  conductor8: 'KPP267',
  conductor9: 'SUPERNUMERARIO',
  conductor10: 'SUPERNUMERARIO',
};

const conductorDatos = {
  conductor1: { cedula: "1035418709", cuenta: "3217203306" },
  conductor2: { cedula: "1041328787", cuenta: "60959324231" },
  conductor3: { cedula: "1001244007", cuenta: "3116950743" },
  conductor4: { cedula: "15507093", cuenta: "" },
  conductor5: { cedula: "3482971", cuenta: "" },
  conductor6: { cedula: "1216713188", cuenta: "" },
  conductor7: { cedula: "1001463806", cuenta: "" },
  conductor8: { cedula: "15516297", cuenta: "" },
  conductor9: { cedula: "1020482654", cuenta: "" },
  conductor10: { cedula: "15516827", cuenta: "" },
};

// Mapeo para autocompletar el tipo de cuenta según el conductor
const conductorTipoCuenta = {
  conductor1: 'Nequi',
  conductor2: 'Ahorros',
  conductor3: 'Nequi',
  conductor4: '',
  conductor5: '',
  conductor6: '',
  conductor7: '',
  conductor8: '',
  conductor9: '',
  conductor10: '',
};

const API_URL = 'https://backend-transporte.vercel.app/api/registro';

const Transporte = () => {
  const [fecha, setFecha] = useState(new Date());
  const [tipoServicio, setTipoServicio] = useState('');
  const [conductor, setConductor] = useState('');
  const [otroConductor, setOtroConductor] = useState('');
  const [placa, setPlaca] = useState('');
  const [cedula, setCedula] = useState("");
  const [tipoCuenta, setTipoCuenta] = useState("");
  const [cuentaBancaria, setCuentaBancaria] = useState("");
  const [fechaViaje, setFechaViaje] = useState(null);
  const [observacion, setObservacion] = useState('');
  const [selectedOrigen, setSelectedOrigen] = useState([]);
  const [selectedSedes, setSelectedSedes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [pendingData, setPendingData] = useState(null);

  useEffect(() => {
    if (conductor && conductor !== 'otro' && conductorPlacas[conductor]) {
      setPlaca(conductorPlacas[conductor]);
      if (conductorDatos[conductor]) {
        setCedula(conductorDatos[conductor].cedula);
        setCuentaBancaria(conductorDatos[conductor].cuenta);
      }
      // Asigna el tipo de cuenta automáticamente usando el mapeo
      setTipoCuenta(conductorTipoCuenta[conductor] || "");
    } else {
      setPlaca('');
      setCedula("");
      setCuentaBancaria("");
      setTipoCuenta("");
    }
  }, [conductor]);

  const handleTipoServicioChange = (e) => {
    setTipoServicio(e.target.value);
    setSelectedOrigen([]);
    setSelectedSedes([]);
  };

  const handleCheckboxChange = (e, setter, selectedItems) => {
    const { value, checked } = e.target;
    if (checked) {
      setter([...selectedItems, value]);
    } else {
      setter(selectedItems.filter((id) => id !== value));
    }
  };

  const totalValor =
    tipoServicio === 'canastas'
      ? selectedOrigen.length > 0 ? 100000 : 0
      : selectedSedes.reduce((acc, sedeId) => {
          const sede = sedesOptions.find((s) => s.id === sedeId);
          return sede ? acc + sede.value : acc;
        }, 0);

  const formattedTotalValor = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(totalValor);

  const isFormValid =
    tipoServicio.trim() !== "" &&
    conductor.trim() !== "" &&
    (conductor !== "otro" || otroConductor.trim() !== "") &&
    placa.trim() !== "" &&
    fechaViaje !== null &&
    ((tipoServicio === "canastas" && selectedOrigen.length > 0) ||
      (tipoServicio === "transporte" && selectedSedes.length > 0)) &&
    tipoCuenta.trim() !== ""; // Se valida que el tipo de cuenta no esté vacío

  const handleSubmit = (e) => {
    e.preventDefault();

    const fullConductor =
      conductor === 'otro'
        ? otroConductor
        : (conductorOptions.find((opt) => opt.value === conductor)?.label || conductor);

    const origenFull =
      tipoServicio === 'canastas'
        ? selectedOrigen.map((id) => {
            const sede = sedesOptions.find((s) => s.id === id);
            return sede ? sede.name : id;
          })
        : ["CEDI"];
    const sedesFull =
      tipoServicio === 'transporte'
        ? selectedSedes.map((id) => {
            const sede = sedesOptions.find((s) => s.id === id);
            return sede ? sede.name : id;
          })
        : ["CEDI"];

    const confirmationMsg = `Por favor, revise los datos ingresados:
      
      Fecha: ${fecha.toISOString().split('T')[0]}
      Tipo de Servicio: ${tipoServicio}
      Conductor: ${fullConductor}
      Placa: ${placa}
      Fecha de Viaje: ${fechaViaje ? fechaViaje.toISOString().split('T')[0] : "N/A"}
      Origen: ${origenFull.join(", ")}
      Sedes: ${sedesFull.join(", ")}
      Tipo de Cuenta: ${tipoCuenta}
      Total Valor: ${formattedTotalValor}
      Observación: ${observacion}
      
      ¿Desea enviar el formulario?`;

    // Se agrega la propiedad tipo_cuenta en el objeto pendingData
    setPendingData({
      fecha: fecha.toISOString().split('T')[0],
      tipo_formulario: tipoServicio,
      conductor: fullConductor,
      placa_vehiculo: placa,
      cedula: cedula,
      // Si cuentaBancaria es cadena vacía, se envía null en lugar de ""
      cuenta_bancaria: cuentaBancaria === "" ? null : cuentaBancaria,
      tipo_cuenta: tipoCuenta,
      fecha_viaje: fechaViaje ? fechaViaje.toISOString().split('T')[0] : null,
      origen: origenFull,
      sedes: sedesFull,
      valor_total: totalValor,
      observacion,
    });
    setConfirmationMessage(confirmationMsg);
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    setShowConfirmation(false);
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pendingData),
      });

      let result = {};
      try {
        result = await response.json();
      } catch (err) {
        console.error('Error al parsear JSON:', err);
      }

      if (response.ok) {
        setMessage({ type: 'success', text: 'Registro guardado correctamente' });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setMessage({ type: 'error', text: `Error: ${result.error || 'Error en la solicitud'}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al enviar el formulario' });
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setPendingData(null);
  };

  return (
    <div className="transporte-container">
      {message && message.type === 'success' && (
        <div className="transporte-announcement">{message.text}</div>
      )}

      {showConfirmation && (
        <div className="confirmation-overlay">
          <div className="confirmation-modal">
            <h3>Confirme sus datos</h3>
            <pre>{confirmationMessage}</pre>
            <div className="confirmation-buttons">
              <button className="confirm-btn" onClick={handleConfirm}>
                Confirmar
              </button>
              <button className="cancel-btn" onClick={handleCancel}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="transporte-header">Registro de Transporte</h1>
      <div className="transporte-form-container">
        <h2 className="transporte-form-title">Formulario de Registro</h2>
        <h4 className="fraseMotivacional">
          “Hablar con verdad puede doler, pero vivir sin ella es perderse a uno mismo.”
        </h4>
        <form onSubmit={handleSubmit}>
          <div className="transporte-form-field">
            <label className="transporte-label">Fecha:</label>
            <ReactDatePicker
              selected={fecha}
              onChange={(date) => setFecha(date)}
              dateFormat="yyyy-MM-dd"
              customInput={<CustomDateInput />}
              disabled
              locale="es" // Localización en español
            />
          </div>

          <div className="transporte-form-field">
            <label className="transporte-label">Tipo de Servicio:</label>
            <select
              className="transporte-select"
              value={tipoServicio}
              onChange={handleTipoServicioChange}
              required
            >
              <option value="" disabled>Seleccione tipo de servicio</option>
              <option value="canastas">Canastas</option>
              <option value="transporte">Transporte</option>
            </select>
          </div>

          <div className="transporte-form-field">
            <label className="transporte-label">Conductor:</label>
            <select
              className="transporte-select"
              value={conductor}
              onChange={(e) => setConductor(e.target.value)}
              required
            >
              <option value="">Seleccione un conductor</option>
              {conductorOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {conductor === 'otro' && (
              <input
                type="text"
                className="transporte-input"
                placeholder="Escriba el nombre"
                value={otroConductor}
                onChange={(e) => setOtroConductor(e.target.value)}
                required
              />
            )}
          </div>

          {conductor !== '' && (
            <div className="detalles-conductor">
              <div className="transporte-form-field">
                <label className="transporte-label">Placa:</label>
                {conductor === 'otro' ? (
                  <input
                    type="text"
                    className="transporte-input"
                    placeholder="Ingrese placa"
                    value={placa}
                    onChange={(e) => setPlaca(e.target.value)}
                    required
                  />
                ) : (
                  <input
                    type="text"
                    className="transporte-input"
                    value={placa}
                    readOnly
                    style={{ userSelect: 'none' }}
                    required
                  />
                )}
              </div>

              <div className="transporte-form-field">
                <label className="transporte-label">Cédula:</label>
                {conductor === 'otro' ? (
                  <input
                    type="text"
                    className="transporte-input"
                    placeholder="Ingrese cédula"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
                    required
                  />
                ) : (
                  <input
                    type="text"
                    className="transporte-input"
                    value={cedula}
                    readOnly
                    style={{ userSelect: 'none' }}
                    required
                  />
                )}
              </div>

              <div className="transporte-form-field">
                <label className="transporte-label">Tipo de Cuenta:</label>
                {conductor === 'otro' ? (
                  <select
                    className="transporte-select"
                    value={tipoCuenta}
                    onChange={(e) => setTipoCuenta(e.target.value)}
                    required
                  >
                    <option value="" disabled>Seleccione tipo de cuenta</option>
                    <option value="Ahorros">Ahorros</option>
                    <option value="Nequi">Nequi</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    className="transporte-input"
                    value={tipoCuenta}
                    readOnly
                    style={{ userSelect: 'none' }}
                    required
                  />
                )}
              </div>

              <div className="transporte-form-field">
                <label className="transporte-label">Cuenta Bancaria:</label>
                {conductor === 'otro' ? (
                  <input
                    type="text"
                    className="transporte-input"
                    placeholder="Ingrese cuenta bancaria"
                    value={cuentaBancaria}
                    onChange={(e) => setCuentaBancaria(e.target.value)}
                  />
                ) : (
                  <input
                    type="text"
                    className="transporte-input"
                    value={cuentaBancaria}
                    readOnly
                    style={{ userSelect: 'none' }}
                  />
                )}
              </div>
            </div>
          )}

          <div className="transporte-form-field">
            <label className="transporte-label">Fecha de viaje:</label>
            <ReactDatePicker
              selected={fechaViaje}
              onChange={(date) => setFechaViaje(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Seleccione fecha de viaje"
              required
              customInput={<CustomDateInput />}
              locale="es" // Localización en español
            />
          </div>

          {tipoServicio === 'canastas' && (
            <>
              <div className="transporte-form-field">
                <label className="transporte-label">Origen:</label>
                <div className="transporte-checkbox-group">
                  {sedesOptions.map((sede) => (
                    <div key={sede.id}>
                      <input
                        type="checkbox"
                        value={sede.id}
                        checked={selectedOrigen.includes(sede.id)}
                        onChange={(e) => handleCheckboxChange(e, setSelectedOrigen, selectedOrigen)}
                      />
                      <label>{sede.name} (Valor: 100.000 COP)</label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="transporte-form-field">
                <label className="transporte-label">Sedes:</label>
                <input type="text" className="transporte-input" value="CEDI" readOnly />
              </div>
            </>
          )}

          {tipoServicio === 'transporte' && (
            <>
              <div className="transporte-form-field">
                <label className="transporte-label">Origen:</label>
                <input type="text" className="transporte-input" value="CEDI" readOnly />
              </div>
              <div className="transporte-form-field">
                <label className="transporte-label">Sedes:</label>
                <div className="transporte-checkbox-group">
                  {sedesOptions.map((sede) => (
                    <div key={sede.id}>
                      <input
                        type="checkbox"
                        value={sede.id}
                        checked={selectedSedes.includes(sede.id)}
                        onChange={(e) => handleCheckboxChange(e, setSelectedSedes, selectedSedes)}
                      />
                      <label>
                        {sede.name} (Valor:{" "}
                        {new Intl.NumberFormat("es-CO", {
                          style: "currency",
                          currency: "COP",
                          minimumFractionDigits: 0,
                        }).format(sede.value)}
                        )
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="transporte-form-field">
            <label className="transporte-label">Total Valor:</label>
            <input type="text" className="transporte-input" value={formattedTotalValor} readOnly />
          </div>

          <div className="transporte-form-field">
            <label className="transporte-label">Observación:</label>
            <textarea
              className="transporte-textarea"
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading || !isFormValid} className="transporte-submit-button">
            {loading ? 'Enviando...' : 'Enviar'}
          </button>

          {message && message.type === 'error' && (
            <p className={`transporte-message ${message.type}`}>{message.text}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export { Transporte };
