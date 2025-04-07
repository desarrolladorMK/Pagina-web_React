import "./Politicas.css";

const Politicas = () => {
  return (
    <div className="politicas-body">
      <div className="container-politicas">
        <a href="/">
          <img src="/logoMK.webp" alt="Logo Merkahorro" />
        </a>
        <h1>Política de Privacidad</h1>
        <p className="p-politicas">
          <strong>Última actualización: 17/09/2024</strong>
        </p>

        <p className="p-politicas">
          Esta Política de Privacidad describe nuestras políticas y
          procedimientos sobre la recopilación, uso y divulgación de su
          información cuando utiliza el Servicio y le informa sobre sus derechos
          de privacidad y cómo la ley lo protege.
        </p>

        <h2 className="politicas-h2">Interpretación y Definiciones</h2>
        <h3>Interpretación</h3>
        <p className="p-politicas">
          Las palabras con la primera letra en mayúscula tienen significados definidos bajo las siguientes condiciones.
        </p>

        <h3>Definiciones</h3>
        <p className="p-politicas">Para los fines de esta Política de Privacidad:</p>
        <ul>
          <li><strong>Cuenta:</strong> significa una cuenta única creada para usted para acceder a nuestro Servicio.</li>
          <li><strong>Empresa:</strong> se refiere a Merkahorro S.A.S.</li>
          <li><strong>País:</strong> se refiere a Colombia.</li>
          <li><strong>Dispositivo:</strong> significa cualquier equipo que pueda acceder al Servicio.</li>
          <li><strong>Datos Personales:</strong> cualquier información que se relacione con una persona identificada o identificable.</li>
          <li><strong>Servicio:</strong> se refiere al Sitio Web y sus plataformas asociadas.</li>
          <li><strong>Proveedor de Servicios:</strong> cualquier persona o entidad que procese datos por encargo de la Empresa.</li>
          <li><strong>Sitio Web:</strong> se refiere a merkahorro.com.</li>
          <li><strong>Usted:</strong> significa el individuo que utiliza el Servicio o representa a una empresa u otra entidad legal.</li>
        </ul>

        <h2 className="politicas-h2">Recopilación y Uso de sus Datos Personales</h2>
        <h4>Datos Personales</h4>
        <p className="p-politicas">
          Podemos solicitar información como nombre, correo electrónico, número de teléfono, dirección y más para contactarlo o identificarlo.
        </p>
        <h4>Datos de Uso</h4>
        <p className="p-politicas">
          Incluyen información como dirección IP, tipo de navegador, páginas visitadas, fecha y hora, entre otros.
        </p>
        <h4>Redes Sociales de Terceros</h4>
        <p className="p-politicas">
          Si se registra mediante servicios como Microsoft, podemos acceder a ciertos datos ya asociados con esa cuenta.
        </p>

        {/* 🔐 NUEVA SECCIÓN SOBRE MOODLE */}
        <h2 className="politicas-h2">Tratamiento de Datos Personales en la Plataforma Educativa</h2>
        <p className="p-politicas">
          SUPERMERCADOS MERKAHORRO S.A.S. informa a sus colaboradores que los datos personales recolectados a través de la plataforma educativa Moodle son tratados de acuerdo con las finalidades establecidas en esta Política de Privacidad y conforme a la normativa vigente en Colombia, especialmente la Ley 1581 de 2012.
        </p>
        <p className="p-politicas">
          Esta plataforma es utilizada para fines de capacitación, evaluación, certificación y seguimiento del desarrollo del talento humano dentro de la organización. Los datos que pueden ser recolectados incluyen nombre completo, número de identificación, correo institucional, rol en la empresa, datos de navegación, calificaciones, participación en actividades, progreso en los cursos, entre otros necesarios para su formación.
        </p>
        <p className="p-politicas">
          La información recolectada será utilizada únicamente para fines académicos, de seguimiento de desempeño y mejora continua de los programas de formación interna. No será compartida con terceros no autorizados, salvo obligación legal o requerimiento de entidades competentes.
        </p>
        <p className="p-politicas">
          El acceso a estos datos está restringido al personal autorizado de Merkahorro, y se aplican medidas técnicas y organizacionales adecuadas para proteger dicha información de accesos no autorizados, pérdidas, alteraciones o divulgaciones indebidas.
        </p>

        <h2 className="politicas-h2">Uso de sus Datos Personales</h2>
        <ul>
          <li>Para proporcionar y mantener nuestro Servicio</li>
          <li>Para gestionar su Cuenta</li>
          <li>Para ejecutar un contrato</li>
          <li>Para contactarlo</li>
          <li>Para enviarle información relevante sobre su proceso de formación</li>
        </ul>

        <h2 className="politicas-h2">Derechos de los Titulares de Datos Personales</h2>
        <ul>
          <li>Acceder a sus datos</li>
          <li>Solicitar su actualización o corrección</li>
          <li>Revocar la autorización para su tratamiento</li>
          <li>Presentar reclamos ante la autoridad competente</li>
        </ul>

        <h2 className="politicas-h2">Seguridad de sus Datos Personales</h2>
        <p className="p-politicas">
          Usamos medidas adecuadas para proteger sus datos, pero ningún sistema es 100% seguro.
        </p>

        <h2 className="politicas-h2">Enlaces a Otros Sitios Web</h2>
        <p className="p-politicas">
          Podemos incluir enlaces a sitios externos. No nos hacemos responsables por sus políticas de privacidad.
        </p>

        <h2 className="politicas-h2">Cambios en esta Política</h2>
        <p className="p-politicas">
          Podemos actualizar esta Política ocasionalmente. Le recomendamos revisarla periódicamente.
        </p>

        <h2 className="politicas-h2">Contáctenos</h2>
        <ul>
          <li>Correo: paginaweb@merkahorrosas.com</li>
          <li>Teléfono: 324 5597862</li>
        </ul>
      </div>
    </div>
  );
};

export { Politicas };
