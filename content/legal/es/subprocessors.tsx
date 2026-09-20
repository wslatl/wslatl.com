import { Link } from '@/components/legal/doc-link'
import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'
import { Callout, CompanyContact, ScrollTable } from '@/components/legal/blocks'
import { Email } from '@/components/ui/email'

export default function SubprocessorsContent() {
  return (
    <>
      <LegalSection number="1" title="Descripción general y alcance">
        <p>
          Esta página enumera los terceros que tratan datos personales por cuenta de WSLATL LLC
          (&ldquo;WSLATL&rdquo;, &ldquo;nosotros&rdquo;, &ldquo;nuestro&rdquo; o &ldquo;nos&rdquo;)
          para que podamos operar nuestro sitio web, el portal de facturación, los paneles de
          hosting y los canales de soporte. Complementa la Sección 4.1 de nuestra{' '}
          <Link href={siteConfig.paths.privacy}>Política de privacidad</Link>,
          que describe a estos destinatarios solo por categorías.
        </p>
        <p>
          Un subencargado es una empresa que contratamos y que puede manejar datos personales al
          prestarnos un servicio. Cada uno recibe solo los datos necesarios para su función. No
          vendemos datos personales y no los compartimos con fines publicitarios.
        </p>
        <p>
          Esta lista cubre el tratamiento que lleva a cabo WSLATL. No cubre los servicios que tú
          eliges instalar y ejecutar por tu cuenta en un servidor que alojamos para ti. Para esos
          datos, consulta la Sección 5, más abajo.
        </p>
      </LegalSection>

      <LegalSection number="2" title="Subencargados">
        <p>
          Los siguientes terceros pueden tratar datos personales por nuestra cuenta. La columna
          &ldquo;Ubicación&rdquo; describe dónde está establecido el proveedor y, cuando es
          pertinente, la huella general de la infraestructura que utiliza.
        </p>

        <ScrollTable label="Subencargados">
          <table className="legal-table">
            <thead>
              <tr>
                <th scope="col">Subencargado</th>
                <th scope="col">Finalidad</th>
                <th scope="col">Categorías de datos</th>
                <th scope="col">Ubicación</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium text-foreground">Stripe</td>
                <td>Procesamiento de pagos con tarjeta y facturación en el portal de clientes</td>
                <td>Nombre, dirección de correo electrónico, dirección de facturación, datos de la tarjeta de pago, registros de transacciones, dirección IP</td>
                <td>Estados Unidos, con tratamiento global</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">PayPal</td>
                <td>Procesamiento de pagos alternativo en el portal de clientes</td>
                <td>Nombre, dirección de correo electrónico, identificadores de cuenta de PayPal, registros de transacciones</td>
                <td>Estados Unidos, con tratamiento global</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Cloudflare (Turnstile)</td>
                <td>Protección frente a bots y abusos en el registro, el inicio de sesión y otros formularios públicos</td>
                <td>Dirección IP, señales del navegador y del dispositivo, tokens de desafío</td>
                <td>Estados Unidos, con una red edge global</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Cloudflare (CDN y DNS)</td>
                <td>Entrega de contenido, resolución DNS y protección frente a la denegación de servicio para nuestros sitios públicos</td>
                <td>Dirección IP, metadatos de la solicitud, cabeceras HTTP, datos de la conexión TLS</td>
                <td>Estados Unidos, con una red edge global</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Pasarela de correo de WSLATL (smtp.wslatl.com)</td>
                <td>Entrega de correo transaccional, como facturas, avisos de cuenta y restablecimientos de contraseña</td>
                <td>Nombre, dirección de correo electrónico y el contenido de los mensajes que te enviamos</td>
                <td>Operada por WSLATL en su propia infraestructura</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Pterodactyl</td>
                <td>Panel de control de servidores de juego usado para aprovisionar y gestionar el hosting de juego</td>
                <td>Identificadores de cuenta, dirección de correo electrónico, configuración del servidor, logs de actividad del panel</td>
                <td>Software de código abierto operado por WSLATL en su propia infraestructura</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">VirtFusion</td>
                <td>Panel de control de VPS usado para aprovisionar y gestionar servidores virtuales</td>
                <td>Identificadores de cuenta, dirección de correo electrónico, configuración del VPS, asignaciones de IP, logs de actividad del panel</td>
                <td>Software con licencia operado por WSLATL en su propia infraestructura; es posible que el proveedor tenga acceso de soporte durante la resolución de incidencias</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Socio o socios de centro de datos</td>
                <td>Alojamiento físico, espacio de rack, energía y tránsito de red para nuestros servidores</td>
                <td>Custodia física de los servidores y, por tanto, de cualquier dato almacenado en ellos</td>
                <td>Véase la nota siguiente</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">jsDelivr y cdnjs</td>
                <td>Entrega de las librerías front-end habituales que usan nuestros paneles</td>
                <td>Dirección IP, user agent y metadatos de la solicitud, enviados por tu navegador cuando carga un recurso</td>
                <td>Redes CDN públicas con nodos edge distribuidos globalmente</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Photon (datos de OpenStreetMap)</td>
                <td>Sugerencias de autocompletado de direcciones en los formularios de registro y de perfil</td>
                <td>El texto parcial de la dirección que escribes en un campo de dirección</td>
                <td>Europa</td>
              </tr>
            </tbody>
          </table>
        </ScrollTable>

        {/*
          OWNER DECISION NEEDED: datacenter partner identity and location.

          The datacenter partner or partners could not be determined from the codebase, and this
          is the single most important entry on the page: the datacenter has physical custody of
          every server and therefore of all client data at rest.

          Fill in, for each facility actually in use:
            - the legal entity name of the operator
            - the city and country of the facility
            - whether any facility is outside the United States (this changes the transfer
              analysis in Section 4)

          A GDPR subprocessor list that omits the entity holding the hardware is not complete,
          and a client asking for a data processing agreement will ask for exactly this.
        */}
        <Callout tone="caution" title="Socio de centro de datos: pendiente de publicar">
          El operador y la ubicación de las instalaciones que albergan nuestros servidores se están
          confirmando y se indicarán aquí. Si necesitas esta información antes de que se publique,
          por ejemplo para completar tu propia revisión de proveedores, escríbenos a{' '}
          <Email name="support" />{' '}
          y te la facilitaremos.
        </Callout>

        <p>
          Podemos añadir o sustituir un subencargado a medida que cambia nuestra infraestructura.
          Cuando lo hagamos, actualizaremos esta página. A los clientes activos que hayan pedido que
          se les avise de los cambios de subencargados se les comunicará por correo electrónico;
          puedes apuntarte escribiendo a{' '}
          <Email name="support" />.
        </p>
      </LegalSection>

      <LegalSection number="3" title="Notas sobre entradas concretas">

        <LegalSubSection title="3.1 Procesadores de pago">
          <p>
            Los datos de la tarjeta se introducen directamente en el procesador de pago y los
            gestiona ese procesador. Como se indica en la Sección 2.2 de nuestra Política de
            privacidad, no almacenamos el número completo de tu tarjeta ni el CVV. Lo que
            conservamos es el tipo de método de pago, los cuatro últimos dígitos y los
            identificadores de transacción.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.2 Autocompletado de direcciones">
          <p>
            Las sugerencias de direcciones las solicita nuestro propio servidor, no tu navegador.
            Por tanto, tu dirección IP no queda expuesta al servicio de geocodificación; solo se
            envía el texto parcial de la dirección que has escrito. No enviamos con la consulta el
            resto de tu formulario, la identidad de tu cuenta ni tu dirección de correo
            electrónico.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.3 CDN públicas">
          <p>
            Cuando una página carga una librería front-end desde una CDN pública, tu navegador hace
            una solicitud directa a esa CDN, lo que necesariamente le revela tu dirección IP y tu
            user agent. Esto es lo habitual en los recursos servidos por una CDN y no es algo que
            les transmitamos nosotros.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.4 Sistemas que operamos nosotros">
          <p>
            Nuestra pasarela de correo, el panel de Pterodactyl y el panel de VirtFusion funcionan
            en infraestructura que controlamos, no como servicios alojados por terceros. Se
            enumeran aquí para que la lista sea completa, porque tratan datos personales y porque
            en algunas circunstancias puede darse acceso al proveedor del software durante una
            investigación de soporte. Cuando eso ocurre, el acceso se limita a lo necesario para
            resolver el problema.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="4" title="Transferencias internacionales">
        <p>
          WSLATL LLC está establecida en el Estado de Missouri, Estados Unidos, y nuestros servicios
          se operan desde Estados Unidos. Si te encuentras en el Espacio Económico Europeo, el Reino
          Unido o Suiza, usar nuestros servicios implica transferir tus datos personales a Estados
          Unidos y, cuando un subencargado opera una red global, a otros países.
        </p>
        <p>
          Estados Unidos no ha sido objeto de una decisión de adecuación general que cubra a todos
          los destinatarios. Cuando transferimos datos personales fuera del EEE o del Reino Unido,
          nos basamos en lo siguiente:
        </p>
        <ul>
          <li>
            <strong>Necesidad para el contrato.</strong> En la
            mayoría de las transferencias, la transferencia es necesaria para ejecutar el contrato
            que nos has pedido que ejecutemos. No se te puede dar un servidor en nuestras
            instalaciones sin que tus datos lleguen a ellas.
          </li>
          <li>
            <strong>Cláusulas Contractuales Tipo.</strong>{' '}
            Cuando un subencargado las ofrece, nos basamos en las Cláusulas Contractuales Tipo de la
            Comisión Europea y, para las transferencias al Reino Unido, en el UK International Data
            Transfer Addendum. Varios de los proveedores enumerados arriba incorporan estas
            cláusulas a sus condiciones estándar de tratamiento de datos.
          </li>
          <li>
            <strong>Marcos a nivel de proveedor.</strong> Algunos
            de los proveedores enumerados arriba mantienen sus propias certificaciones o mecanismos
            de transferencia que cubren los datos que reciben. Esos mecanismos son del proveedor, no
            nuestros, y para los detalles deberías consultar la documentación de privacidad del
            propio proveedor.
          </li>
        </ul>

        {/*
          OWNER DECISION NEEDED: EEA/UK compliance posture.

          Two items on this page state a position about WSLATL itself rather than about a vendor,
          and both need to be confirmed before publication:

            1. EU-US Data Privacy Framework. The paragraph below states that WSLATL does not
               maintain its own DPF certification. Confirm this is correct. If a certification
               has been obtained, replace the paragraph with the certification detail. Do not
               leave a claim of certification on the page that is not backed by an active
               listing.

            2. Article 27 representative. A controller or processor established outside the EEA
               that offers services to data subjects in the EEA is generally required by GDPR
               Article 27 to designate a representative in the Union, and by UK GDPR Article 27
               to designate one in the UK, unless an exemption applies. WSLATL has no such
               representative listed anywhere in these documents. Counsel should determine
               whether an exemption applies given the volume and nature of EEA/UK clients, and
               if not, a representative must be appointed and named on this page and in the
               Privacy Policy.
        */}
        <p>
          WSLATL no mantiene actualmente su propia certificación conforme al EU-US Data Privacy
          Framework. No alegamos adecuación sobre esa base.
        </p>
        <p>
          Si necesitas un contrato de encargo de tratamiento, una copia de las Cláusulas
          Contractuales Tipo tal como las aplicamos o una evaluación de impacto de las
          transferencias para tu propio expediente de cumplimiento, escríbenos a{' '}
          <Email name="support" />{' '}
          y lo revisaremos contigo.
        </p>
      </LegalSection>

      <LegalSection number="5" title="Los datos que pones en tus propios servidores">
        <p>
          Hay una distinción importante entre los dos tipos de datos que intervienen en el hosting.
        </p>
        <ul>
          <li>
            <strong>Los datos de tu cuenta.</strong> La
            información que nos das para abrir y gestionar tu cuenta, como tu nombre, tu dirección
            de correo electrónico, tu dirección de facturación y tu historial de facturas. WSLATL es
            el responsable del tratamiento de estos datos, y los subencargados enumerados arriba
            están contratados por nosotros.
          </li>
          <li>
            <strong>Los datos de tus servicios.</strong> Todo lo
            almacenado por ti o por tus usuarios en un servidor que alojamos para ti, incluidas
            bases de datos, datos de servidores de juego, archivos subidos y logs de aplicaciones.
            Tú decides qué se recoge y por qué. WSLATL es encargado del tratamiento de esos datos,
            no el responsable, y esta lista de subencargados no es la lista de tus subencargados.
          </li>
        </ul>
        <p>
          Si alojas datos personales de otras personas en un servicio de WSLATL, las obligaciones
          del responsable del tratamiento conforme al RGPD o a otra legislación aplicable recaen
          sobre ti. Eso incluye tener una base jurídica, informar a tus propios usuarios y llevar tu
          propio registro de actividades de tratamiento. Consulta la Sección 12 de nuestras{' '}
          <Link href={siteConfig.paths.terms}>Condiciones del servicio</Link>{' '}
          para la indemnización relacionada.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Cambios en esta lista">
        <p>
          Mantendremos esta página al día a medida que cambie nuestra infraestructura. Cuando se
          añada o se sustituya un subencargado, actualizaremos la fecha de entrada en vigor en la
          parte superior de esta página y publicaremos la lista actualizada en{' '}
          <Link href={siteConfig.paths.subprocessors}>
            {siteConfig.siteUrl}{siteConfig.paths.subprocessors}
          </Link>.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Contacto">
        <p>
          Las preguntas sobre esta lista, las solicitudes de un contrato de encargo de tratamiento y
          las solicitudes de privacidad en general deben dirigirse a:
        </p>
        <CompanyContact />
      </LegalSection>
    </>
  )
}
