import React, { useState, useEffect } from 'react';

// Opciones de sedes (cada sede tiene un id, nombre y valor)
const sedesOptions = [
  { id: 'sede1', name: 'Parque', value: 180 },
  { id: 'sede2', name: 'Llano', value: 100 },
  { id: 'sede3', name: 'Plaza', value: 180 },
  { id: 'sede4', name: 'Vegas', value: 100 },
  { id: 'sede5', name: 'Barbosa', value: 230 },
  { id: 'sede6', name: 'San juan', value: 100 },
];

// Opciones de conductor
const conductorOptions = [
  { value: 'conductor1', label: 'Juan Carlos Alvarez Saldarriaga' },
  { value: 'conductor2', label: 'Duvan franco Morales' },
  { value: 'conductor3', label: 'Stiven flores López' },
  { value: 'otro', label: 'Otro' },
];

// Placas asociadas a cada conductor predefinido
const conductorPlacas = {
  conductor1: 'TNH 033',
  conductor2: 'THX 973',
  conductor3: 'SVO 247',
};

// URL del backend en Vercel
const API_URL = 'https://backend-transporte.vercel.app/api/registro';

const Transporte = () => {
  const today = new Date().toISOString().split('T')[0];

  // Estados generales del formulario
  const [fecha, setFecha] = useState(today);
  const [tipoServicio, setTipoServicio] = useState('');
  const [conductor, setConductor] = useState('');
  const [otroConductor, setOtroConductor] = useState('');
  const [placa, setPlaca] = useState('');
  const [fechaViaje, setFechaViaje] = useState('');
  const [observacion, setObservacion] = useState('');

  // Para "canastas": selección de sedes para el campo ORIGEN.
  // Para "transporte": selección de sedes para el campo SEDES.
  const [selectedOrigen, setSelectedOrigen] = useState([]);
  const [selectedSedes, setSelectedSedes] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

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

  // Calcula el total según el tipo de servicio:
  // - En "canastas": cada opción seleccionada vale 100.
  // - En "transporte": se usa el valor definido en sedesOptions.
  const totalValor =
    tipoServicio === 'canastas'
      ? selectedOrigen.length * 100
      : selectedSedes.reduce((acc, sedeId) => {
          const sede = sedesOptions.find((s) => s.id === sedeId);
          return sede ? acc + sede.value : acc;
        }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Se envían los arrays directamente, ya que en la BD los campos "origen" y "sedes" son arrays.
    const data = {
      fecha,
      tipo_formulario: tipoServicio, // Mapeo del tipo de servicio
      conductor: conductor === 'otro' ? otroConductor : conductor,
      placa_vehiculo: placa,
      fecha_viaje: fechaViaje || null,
      origen: tipoServicio === 'canastas' ? selectedOrigen : ["Cedi"],
      sedes: tipoServicio === 'canastas' ? ["Cedi"] : selectedSedes,
      valor_total: totalValor,
      observacion,
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      let result = {};
      try {
        result = await response.json();
      } catch (err) {
        console.error('Error al parsear JSON:', err);
      }

      if (response.ok) {
        setMessage({ type: 'success', text: 'Registro guardado correctamente' });
      } else {
        setMessage({ type: 'error', text: `Error: ${result.error || 'Error en la solicitud'}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al enviar el formulario' });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Fecha:</label>
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
      </div>

      <div>
        <label>Tipo de Servicio:</label>
        <select value={tipoServicio} onChange={handleTipoServicioChange}>
          <option value="">Seleccione tipo de servicio</option>
          <option value="canastas">Canastas</option>
          <option value="transporte">Transporte</option>
        </select>
      </div>

      <div>
        <label>Conductor:</label>
        <select value={conductor} onChange={(e) => setConductor(e.target.value)}>
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
            placeholder="Escriba el nombre"
            value={otroConductor}
            onChange={(e) => setOtroConductor(e.target.value)}
          />
        )}
      </div>

      <div>
        <label>Placa:</label>
        <input
          type="text"
          value={placa}
          onChange={(e) => setPlaca(e.target.value)}
          readOnly={conductor !== 'otro' && conductor !== ''}
        />
      </div>

      <div>
        <label>Fecha de viaje (opcional):</label>
        <input type="date" value={fechaViaje} onChange={(e) => setFechaViaje(e.target.value)} />
      </div>

      {tipoServicio === 'canastas' && (
        <>
          <div>
            <label>Origen:</label>
            {sedesOptions.map((sede) => (
              <div key={sede.id}>
                <input
                  type="checkbox"
                  value={sede.id}
                  checked={selectedOrigen.includes(sede.id)}
                  onChange={(e) => handleCheckboxChange(e, setSelectedOrigen, selectedOrigen)}
                />
                {/* En canastas, se muestra siempre "Valor: 100" */}
                <label>
                  {sede.name} (Valor: 100)
                </label>
              </div>
            ))}
          </div>
          <div>
            <label>Sedes:</label>
            <input type="text" value="Cedi" readOnly />
          </div>
        </>
      )}

      {tipoServicio === 'transporte' && (
        <>
          <div>
            <label>Origen:</label>
            <input type="text" value="Cedi" readOnly />
          </div>
          <div>
            <label>Sedes:</label>
            {sedesOptions.map((sede) => (
              <div key={sede.id}>
                <input
                  type="checkbox"
                  value={sede.id}
                  checked={selectedSedes.includes(sede.id)}
                  onChange={(e) => handleCheckboxChange(e, setSelectedSedes, selectedSedes)}
                />
                <label>
                  {sede.name} (Valor: {sede.value})
                </label>
              </div>
            ))}
          </div>
        </>
      )}

      <div>
        <label>Total Valor:</label>
        <input type="text" value={totalValor} readOnly />
      </div>

      <div>
        <label>Observación:</label>
        <textarea value={observacion} onChange={(e) => setObservacion(e.target.value)} />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Enviando...' : 'Enviar'}
      </button>

      {message && <p className={message.type}>{message.text}</p>}
    </form>
  );
};

export { Transporte };
