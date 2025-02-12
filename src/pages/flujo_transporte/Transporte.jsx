import React, { useState, useEffect } from 'react';

// Opciones de sedes (cada sede tiene un id, nombre y valor)
const sedesOptions = [
  { id: 'sede1', name: 'Sede 1', value: 100 },
  { id: 'sede2', name: 'Sede 2', value: 200 },
  { id: 'sede3', name: 'Sede 3', value: 300 },
];

// Opciones de conductor
const conductorOptions = [
  { value: 'conductor1', label: 'Conductor 1' },
  { value: 'conductor2', label: 'Conductor 2' },
  { value: 'otro', label: 'Otro' },
];

// Placas asociadas a cada conductor predefinido
const conductorPlacas = {
  conductor1: 'ABC-123',
  conductor2: 'XYZ-789',
};

const Transporte = () => {
  // Fecha actual (formato YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];

  // Estados generales del formulario
  const [fecha, setFecha] = useState(today);
  const [tipoServicio, setTipoServicio] = useState(''); // Valores: "canastas" o "transporte"
  const [conductor, setConductor] = useState('');
  const [otroConductor, setOtroConductor] = useState('');
  const [placa, setPlaca] = useState('');
  const [fechaViaje, setFechaViaje] = useState('');
  const [observacion, setObservacion] = useState('');

  // Estados para la selección de sedes u origen, según el tipo de servicio
  // Para "canastas": en el campo ORIGEN se seleccionan las sedes disponibles.
  const [selectedOrigen, setSelectedOrigen] = useState([]);
  // Para "transporte": en el campo SEDES se seleccionan las sedes disponibles.
  const [selectedSedes, setSelectedSedes] = useState([]);

  // Actualiza la placa automáticamente si se selecciona un conductor predefinido
  useEffect(() => {
    if (conductor && conductor !== 'otro' && conductorPlacas[conductor]) {
      setPlaca(conductorPlacas[conductor]);
    } else {
      // Si es "otro" o se limpia el campo, se permite editar la placa
      setPlaca('');
    }
  }, [conductor]);

  // Al cambiar el tipo de servicio se limpian las selecciones previas
  const handleTipoServicioChange = (e) => {
    setTipoServicio(e.target.value);
    setSelectedOrigen([]);
    setSelectedSedes([]);
  };

  // Handler para las checkboxes del campo ORIGEN (modo canastas)
  const handleOrigenChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedOrigen([...selectedOrigen, value]);
    } else {
      setSelectedOrigen(selectedOrigen.filter((id) => id !== value));
    }
  };

  // Handler para las checkboxes del campo SEDES (modo transporte)
  const handleSedesChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedSedes([...selectedSedes, value]);
    } else {
      setSelectedSedes(selectedSedes.filter((id) => id !== value));
    }
  };

  // Se calcula el total sumando los valores de las sedes seleccionadas según el modo
  const totalValor =
    tipoServicio === 'canastas'
      ? selectedOrigen.reduce((acc, sedeId) => {
          const sede = sedesOptions.find((s) => s.id === sedeId);
          return sede ? acc + sede.value : acc;
        }, 0)
      : selectedSedes.reduce((acc, sedeId) => {
          const sede = sedesOptions.find((s) => s.id === sedeId);
          return sede ? acc + sede.value : acc;
        }, 0);

  // Función para enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Armar el objeto a enviar, usando los nombres de campo de la base de datos
    const data = {
      fecha, // Fecha de registro
      tipo_servicio: tipoServicio,
      conductor: conductor === 'otro' ? otroConductor : conductor,
      placa,
      fecha_viaje: fechaViaje || null,
      // Según el modo:
      // - Canastas: ORIGEN es la selección de sedes y SEDES se fija en "Cedi".
      // - Transporte: ORIGEN se fija en "Cedi" y SEDES es la selección de sedes.
      origen: tipoServicio === 'canastas' ? selectedOrigen : 'Cedi',
      sedes: tipoServicio === 'canastas' ? 'Cedi' : selectedSedes,
      total_valor: totalValor,
      observacion,
    };

    try {
      const response = await fetch('/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log('Respuesta del servidor:', result);
      // Aquí puedes agregar lógica para notificar al usuario (por ejemplo, mensajes de éxito o error)
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campo de fecha predeterminada */}
      <div>
        <label>Fecha (predeterminada hoy):</label>
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
      </div>

      {/* Selector de Tipo de Servicio */}
      <div>
        <label>Tipo de Servicio:</label>
        <select value={tipoServicio} onChange={handleTipoServicioChange}>
          <option value="">Seleccione tipo de servicio</option>
          <option value="canastas">Canastas</option>
          <option value="transporte">Transporte</option>
        </select>
      </div>

      {/* Campo de selección de Conductor */}
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
            placeholder="Escriba el nombre del conductor"
            value={otroConductor}
            onChange={(e) => setOtroConductor(e.target.value)}
          />
        )}
      </div>

      {/* Campo de Placa */}
      <div>
        <label>Placa:</label>
        <input
          type="text"
          value={placa}
          onChange={(e) => setPlaca(e.target.value)}
          readOnly={conductor !== 'otro' && conductor !== ''}
          placeholder="Placa del vehículo"
        />
      </div>

      {/* Campo de Fecha de Viaje (opcional) */}
      <div>
        <label>Fecha de viaje (opcional):</label>
        <input type="date" value={fechaViaje} onChange={(e) => setFechaViaje(e.target.value)} />
      </div>

      {/* Según el Tipo de Servicio se muestran los campos ORIGEN y SEDES */}
      {tipoServicio === '' && (
        <p>Seleccione un tipo de servicio para continuar.</p>
      )}

      {tipoServicio === 'canastas' && (
        <>
          {/* En modo CANASTAS: en ORIGEN se seleccionan las sedes disponibles */}
          <div>
            <label>Origen:</label>
            {sedesOptions.map((sede) => (
              <div key={sede.id}>
                <input
                  type="checkbox"
                  id={`origen-${sede.id}`}
                  value={sede.id}
                  checked={selectedOrigen.includes(sede.id)}
                  onChange={handleOrigenChange}
                />
                <label htmlFor={`origen-${sede.id}`}>
                  {sede.name} (Valor: {sede.value})
                </label>
              </div>
            ))}
          </div>

          {/* El campo SEDES queda fijo a "Cedi" */}
          <div>
            <label>Sedes:</label>
            <input type="text" value="Cedi" readOnly />
          </div>
        </>
      )}

      {tipoServicio === 'transporte' && (
        <>
          {/* En modo TRANSPORTE: ORIGEN queda fijo a "Cedi" */}
          <div>
            <label>Origen:</label>
            <input type="text" value="Cedi" readOnly />
          </div>

          {/* En SEDES se seleccionan las sedes disponibles */}
          <div>
            <label>Sedes:</label>
            {sedesOptions.map((sede) => (
              <div key={sede.id}>
                <input
                  type="checkbox"
                  id={`sedes-${sede.id}`}
                  value={sede.id}
                  checked={selectedSedes.includes(sede.id)}
                  onChange={handleSedesChange}
                />
                <label htmlFor={`sedes-${sede.id}`}>
                  {sede.name} (Valor: {sede.value})
                </label>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Campo que muestra el Total Valor */}
      <div>
        <label>Total Valor:</label>
        <input type="text" value={totalValor} readOnly />
      </div>

      {/* Campo de Observación */}
      <div>
        <label>Observación:</label>
        <textarea value={observacion} onChange={(e) => setObservacion(e.target.value)} />
      </div>

      <button type="submit">Enviar</button>
    </form>
  );
};

export { Transporte };
