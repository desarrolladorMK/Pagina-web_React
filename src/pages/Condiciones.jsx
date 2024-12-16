import "./Condiciones.css";
import { Link } from "react-router-dom";

const Condiciones = () => {
  return (
    <div className="condiciones-body">
      <div className="terminos">
      <a haref="/"> <img src="/logoMK.png" alt="" /></a>
        <h1>Términos y Condiciones</h1>

        <h2 className="condiciones-h2">1. Aceptación de Términos</h2>
        <p  className="p-condiciones">
          Bienvenido a Merkahorro S.A.S. Al acceder y utilizar nuestro sitio web{" "}
          <Link to="/">https://www.merkahorro.com/</Link>, usted acepta estar
          sujeto a estos Términos y Condiciones y a nuestra Política de
          Privacidad. Si no está de acuerdo con estos términos, por favor no
          utilice nuestro sitio web.
        </p>

        <h2 className="condiciones-h2">2. Uso del Sitio Web</h2>
        <p  className="p-condiciones">
          El propósito de nuestro sitio web es proporcionar información
          relevante sobre nuestra empresa, incluyendo imágenes y otros
          materiales promocionales. Los usuarios también tienen la opción de
          enviar su hoja de vida a través de un formulario en línea y poder
          registrarse y acceder a cursos de formación de la empresa.
        </p>

        <h2 className="condiciones-h2">3. Registro de Usuarios</h2>
        <p  className="p-condiciones">
          Para acceder a ciertas partes de nuestro sitio web, es posible que
          deba registrarse y crear una cuenta. Al registrarse, acepta
          proporcionar información precisa, actual y completa sobre usted según
          se le solicite en nuestro formulario de registro.
        </p>

        <h2 className="condiciones-h2">
          4. Envío de Información Personal y Consentimiento
        </h2>
        <p  className="p-condiciones">
          Al enviar su hoja de vida y otros datos a través de nuestro formulario,
          usted otorga su consentimiento expreso, previo e informado para que
          Merkahorro S.A.S. trate dicha información exclusivamente con fines de
          selección de personal, de acuerdo con nuestras{" "}
          <Link to="/politicas">Políticas de Privacidad</Link> y la Ley 1581 de
          2012. La información recopilada será utilizada únicamente para los
          procesos de selección y será conservada durante el tiempo necesario
          para cumplir con dicha finalidad.
        </p>

        <h2 className="condiciones-h2">
          5. Derechos de los Titulares de Datos Personales
        </h2>
        <p  className="p-condiciones">
          De acuerdo con la Ley 1581 de 2012, usted tiene derecho a acceder,
          actualizar, rectificar y solicitar la eliminación de su información
          personal. También puede solicitar que se le informe sobre el uso que
          se le ha dado a sus datos personales.
        </p>

        <h2 className="condiciones-h2">
          6. Procedimiento para Ejercer los Derechos
        </h2>
        <p  className="p-condiciones">
          Para ejercer sus derechos de acceso, corrección, actualización o
          eliminación de datos personales, o para revocar su consentimiento para
          el tratamiento de sus datos, puede contactarnos a través de los
          siguientes medios:
        </p>
        <strong>Correo electrónico: </strong> paginaweb@merkahorrosas.com
        <p  className="p-condiciones"></p>
        <strong>Teléfono:</strong> 324 5597862
        <p  className="p-condiciones"></p>

        <h2 className="condiciones-h2">7. Privacidad y Protección de Datos</h2>
        <p  className="p-condiciones">
          Su privacidad es importante para nosotros. Consulte nuestras{" "}
          <Link to="/politicas">Políticas de Privacidad</Link> para obtener
          información sobre cómo recopilamos, utilizamos y protegemos su
          información personal.
        </p>

        <h2 className="condiciones-h2">
          8. Derechos de Propiedad Intelectual
        </h2>
        <p  className="p-condiciones">
          Todos los contenidos, marcas comerciales, logotipos, y otros
          materiales de propiedad intelectual en nuestro sitio web son propiedad
          de Merkahorro S.A.S y están protegidos por las leyes de propiedad
          intelectual aplicables. Queda prohibido su uso no autorizado.
        </p>

        <h2 className="condiciones-h2">9. Limitación de Responsabilidad</h2>
        <p  className="p-condiciones">
          En la medida máxima permitida por la ley, Merkahorro S.A.S. no será
          responsable de ningún daño indirecto, incidental, especial,
          consecuente o punitivo que surja de su acceso o uso de nuestro sitio
          web.
        </p>

        <h2 className="condiciones-h2">10. Modificaciones a los Términos</h2>
        <p  className="p-condiciones">
          Nos reservamos el derecho de modificar estos Términos y Condiciones en
          cualquier momento. Cualquier cambio se publicará en esta página, y su
          uso continuo del sitio web constituirá su aceptación de los nuevos
          términos.
        </p>

        <h2 className="condiciones-h2">11. Contacto</h2>
        <ul>
          <li>Por correo electrónico: paginaweb@merkahorrosas.com</li>
          <li>Por teléfono: 324 5597862</li>
        </ul>
      </div>
    </div>
  );
};

export { Condiciones };
