import React, { useState, useEffect } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Transporte.css';

// Componente para un input de fecha personalizado (botón)
// Se agregó type="button" para evitar que se dispare el submit al hacer click.
const CustomDateInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
  <button type="button" className="custom-date-input" onClick={onClick} ref={ref}>
    {value || placeholder || "Selecciona una fecha"}
  </button>
));

const sedesOptions = [
  { id: 'sede1', name: 'Parque', value: 180000 },
  { id: 'sede2', name: 'Llano', value: 100000 },
  { id: 'sede3', name: 'Plaza', value: 180000 },
  { id: 'sede4', name: 'Vegas', value: 100000 },
  { id: 'sede5', name: 'Barbosa', value: 230000 },
  { id: 'sede6', name: 'San juan', value: 100000 },
];

const conductorOptions = [
  { value: 'conductor1', label: 'Juan Carlos Alvarez Saldarriaga' },
  { value: 'conductor2', label: 'Duvan Franco Morales' },
  { value: 'conductor3', label: 'Stiven Flores López' },
  { value: 'otro', label: 'Otro' },
];

const conductorPlacas = {
  conductor1: 'TNH 033',
  conductor2: 'THX 973',
  conductor3: 'SVO 247',
};

const API_URL = 'https://backend-transporte.vercel.app/api/registro';

const Transporte = () => {
  // Usamos objetos Date para las fechas
  const [fecha, setFecha] = useState(new Date());
  const [tipoServicio, setTipoServicio] = useState('');
  const [conductor, setConductor] = useState('');
  const [otroConductor, setOtroConductor] = useState('');
  const [placa, setPlaca] = useState('');
  const [fechaViaje, setFechaViaje] = useState(null);
  const [observacion, setObservacion] = useState('');

  const [selectedOrigen, setSelectedOrigen] = useState([]);
  const [selectedSedes, setSelectedSedes] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [pendingData, setPendingData] = useState(null);

  // Actualiza la placa automáticamente si se selecciona un conductor predefinido
  useEffect(() => {
    if (conductor && conductor !== 'otro' && conductorPlacas[conductor]) {
      setPlaca(conductorPlacas[conductor]);
    } else {
      setPlaca('');
    }
  }, [conductor]);

  // Al cambiar el tipo de servicio se limpian las selecciones previas
  const handleTipoServicioChange = (e) => {
    setTipoServicio(e.target.value);
    setSelectedOrigen([]);
    setSelectedSedes([]);
  };

  // Handler genérico para las checkboxes
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
      ? selectedOrigen.length * 100000
      : selectedSedes.reduce((acc, sedeId) => {
          const sede = sedesOptions.find((s) => s.id === sedeId);
          return sede ? acc + sede.value : acc;
        }, 0);

  const formattedTotalValor = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(totalValor);

  // Validación: solo se habilita el botón si todos los campos requeridos tienen contenido
  const isFormValid =
    tipoServicio.trim() !== "" &&
    conductor.trim() !== "" &&
    (conductor !== "otro" || otroConductor.trim() !== "") &&
    placa.trim() !== "" &&
    fechaViaje !== null &&
    // formData.sede?.trim() !== "" &&        // Línea original sin uso, se comenta para mantener el código
    // formData.correo_asignado?.trim() !== "" &&  // Línea original sin uso, se comenta para mantener el código
    ((tipoServicio === "canastas" && selectedOrigen.length > 0) ||
      (tipoServicio === "transporte" && selectedSedes.length > 0));

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
Total Valor: ${formattedTotalValor}
Observación: ${observacion}

¿Desea enviar el formulario?`;

    setPendingData({
      fecha: fecha.toISOString().split('T')[0],
      tipo_formulario: tipoServicio,
      conductor: fullConductor,
      placa_vehiculo: placa,
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
        <form onSubmit={handleSubmit}>
          <div className="transporte-form-field">
            <label className="transporte-label">Fecha:</label>
            <ReactDatePicker 
              selected={fecha} 
              onChange={(date) => setFecha(date)} 
              dateFormat="yyyy-MM-dd" 
              customInput={<CustomDateInput />}
              disabled
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

          <div className="transporte-form-field">
            <label className="transporte-label">Placa:</label>
            <input
              type="text"
              className="transporte-input"
              value={placa}
              onChange={(e) => setPlaca(e.target.value)}
              readOnly={conductor !== 'otro' && conductor !== ''}
              required
            />
          </div>

          <div className="transporte-form-field">
            <label className="transporte-label">Fecha de viaje:</label>
            <ReactDatePicker 
              selected={fechaViaje} 
              onChange={(date) => setFechaViaje(date)} 
              dateFormat="yyyy-MM-dd" 
              placeholderText="Seleccione fecha de viaje"
              required
              customInput={<CustomDateInput />}
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
