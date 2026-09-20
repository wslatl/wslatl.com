import { Link } from '@/components/legal/doc-link'
import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'
import { CompanyContact, ScrollTable, Tier, Tiers } from '@/components/legal/blocks'
import { Email } from '@/components/ui/email'

export default function PrivacyContent() {
  return (
    <>
      <LegalSection number="1" title="Quiénes somos">
        <p>
          WSLATL LLC es una sociedad de responsabilidad limitada de Missouri que presta servicios de hosting
          privado, incluidos servidores dedicados, hosting de servidores de juego, hosting VPS y
          hosting web. Las referencias a &ldquo;WSLATL&rdquo;, &ldquo;nosotros&rdquo;,
          &ldquo;nuestro&rdquo; o &ldquo;nos&rdquo; en esta política se refieren a WSLATL LLC.
        </p>
        <p>
          Esta Política de privacidad se aplica a la información recogida a través de nuestro sitio web
          (wslatl.com), el portal de facturación (billing.wslatl.com), los paneles de hosting
          (panel.wslatl.com, vps.wslatl.com) y todos los servicios y comunicaciones que presta WSLATL. Al
          usar cualquiera de nuestros servicios, aceptas las prácticas descritas en esta política.
        </p>

        <LegalSubSection title="1.1 Responsable y encargado del tratamiento">
          <p>
            El hosting implica dos tipos de datos distintos, y nuestro papel jurídico es diferente
            en cada uno. La distinción importa, así que vale la pena decirla con claridad.
          </p>
          <ul>
            <li>
              <strong>Los datos de tu cuenta.</strong> La
              información que nos das para que podamos abrir y gestionar tu cuenta: tu nombre, tus
              datos de contacto, los registros de facturación, los tickets de soporte y la actividad
              en los paneles descrita en la Sección 2. Respecto de estos datos, WSLATL es el{' '}
              <strong>responsable del tratamiento</strong>. Nosotros decidimos qué se
              recoge y por qué, y esta Política de privacidad describe esa decisión.
            </li>
            <li>
              <strong>Los datos que pones en tus propios servicios.</strong>{' '}
              Todo lo almacenado por ti o por tus usuarios en un servidor que alojamos para ti:
              bases de datos, datos de servidores de juego, archivos subidos, contenido de sitios
              web, logs de aplicaciones. Respecto de estos datos, WSLATL es{' '}
              <strong>encargado del tratamiento</strong>, no el responsable.
              Los almacenamos y los transmitimos para que el servicio funcione, y no decidimos qué
              recoges ni por qué lo recoges.
            </li>
          </ul>
          <p>
            Si alojas datos personales de otras personas en un servicio de WSLATL, tú eres el
            responsable del tratamiento de esos datos. Las obligaciones que conlleva ese papel son
            tuyas: tener una base jurídica para el tratamiento, informar a tus propios usuarios,
            atender sus solicitudes de ejercicio de derechos y llevar tu propio registro de
            actividades de tratamiento. Esta Política de privacidad no hace nada de eso por ti, y no
            es una política de privacidad en la que tus usuarios puedan apoyarse.
          </p>
          <p>
            Actuamos siguiendo tus instrucciones respecto de esos datos, y solo accedemos a ellos
            cuando es necesario para prestar, mantener o proteger el servicio, o cuando la ley nos
            lo exige. Si necesitas un contrato de encargo de tratamiento que cubra nuestro papel
            como encargado, escríbenos a{' '}
            <Email name="support" />.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="2" title="Información que recogemos">
        <p>Recogemos las siguientes categorías de información:</p>

        <LegalSubSection title="2.1 Información de cuenta y de registro">
          <p>Cuando solicitas o creas una cuenta, recogemos:</p>
          <ul>
            <li>Nombre completo</li>
            <li>Dirección de correo electrónico</li>
            <li>Dirección de facturación</li>
            <li>Número de teléfono (obligatorio al darse de alta, y usado para recuperar la cuenta y verificar su titularidad)</li>
            <li>Fecha de nacimiento (usada para aplicar los requisitos de edad de la Sección 9)</li>
            <li>
              Número de identificación fiscal, cuando facilitas uno para que podamos facturarte como
              empresa o aplicar una exención fiscal
            </li>
            <li>El nombre de usuario y la contraseña de la cuenta (almacenada como un hash seguro; nunca vemos tu contraseña en texto plano)</li>
            <li>
              La identidad de tu cuenta de Discord, cuando eliges vincular tu cuenta de Discord con
              tu cuenta de WSLATL. La vinculación nos da tu ID de usuario, tu nombre de usuario y tu
              avatar de Discord para que podamos asociarte con las conversaciones de soporte y con
              el acceso por roles en nuestro servidor. La vinculación es opcional y se puede
              deshacer.
            </li>
            <li>Cualquier información que facilites voluntariamente durante el proceso de solicitud o de alta</li>
          </ul>
          <p>
            También mantenemos un{' '}
            <strong>registro de movimientos del crédito de cuenta</strong> para tu
            cuenta, que anota todos los cambios en tu saldo de crédito, incluidas las compras de
            recarga, los créditos que emitimos, los importes aplicados a facturas, los regalos
            enviados o recibidos, y la fecha, el importe y el motivo de cada apunte. Este registro
            se conserva como parte de tus registros de facturación. Consulta nuestras{' '}
            <Link href={siteConfig.paths.accountCredit}>Condiciones del crédito de cuenta</Link>{' '}
            para ver cómo funciona el saldo en sí.
          </p>
        </LegalSubSection>

        <LegalSubSection title="2.2 Información de facturación y de pago">
          <p>
            Los pagos se tramitan a través de nuestro portal de facturación mediante procesadores de pago de
            terceros que cumplen PCI-DSS. No almacenamos el número completo de tu tarjeta ni el CVV. Conservamos:
          </p>
          <ul>
            <li>El historial de facturas y los registros de facturación</li>
            <li>El tipo de método de pago (marca de la tarjeta, cuatro últimos dígitos)</li>
            <li>Los identificadores y las fechas de las transacciones</li>
            <li>Los registros exigidos por la contabilidad y el cumplimiento legal</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="2.3 Datos de servicio y de uso">
          <p>Cuando usas nuestros servicios de hosting, recogemos:</p>
          <ul>
            <li>Las direcciones IP asignadas a tus servicios o usadas por ellos</li>
            <li>El uso de recursos del servidor (CPU, RAM, ancho de banda, uso de disco)</li>
            <li>Los logs de acceso y de actividad de los paneles de control y los cuadros de mando</li>
            <li>Los metadatos del tráfico de red (no el contenido) usados para detectar abusos y monitorizar el rendimiento</li>
            <li>Los logs de actividad de los servidores de juego, incluidas las marcas de tiempo de conexión y los datos de sesión</li>
            <li>Los registros de tiempo de actividad y de disponibilidad</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="2.4 Datos de las comunicaciones">
          <p>Cuando nos escribes, conservamos registros de:</p>
          <ul>
            <li>Los tickets de soporte y todo su contenido</li>
            <li>Las comunicaciones por Discord (mensajes en nuestro servidor o mensajes directos con nuestro equipo)</li>
            <li>La correspondencia por correo electrónico</li>
            <li>Los archivos, las capturas de pantalla o los logs que compartes al pedir soporte</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="2.5 Datos del sitio web">
          <p>Cuando visitas wslatl.com, podemos recoger:</p>
          <ul>
            <li>La dirección IP y la región geográfica general</li>
            <li>El tipo de navegador y el sistema operativo</li>
            <li>Las páginas visitadas y el tiempo en el sitio</li>
            <li>La URL de procedencia</li>
            <li>Las cookies de sesión (véase la Sección 7)</li>
          </ul>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="3" title="Cómo usamos tu información">
        <p>Usamos la información que recogemos exclusivamente para:</p>
        <ul>
          <li>Aprovisionar, operar y mantener tus servicios de hosting</li>
          <li>Tramitar pagos, generar facturas y gestionar tu cuenta de facturación</li>
          <li>Verificar tu identidad y evitar la creación fraudulenta de cuentas</li>
          <li>Responder a solicitudes de soporte, preguntas y consultas</li>
          <li>Monitorizar el rendimiento de la red, la disponibilidad y el estado de la infraestructura</li>
          <li>Detectar, investigar y prevenir abusos, accesos no autorizados e infracciones de nuestra Política de uso aceptable</li>
          <li>Cumplir las leyes, los reglamentos y las obligaciones legales aplicables</li>
          <li>Hacer cumplir nuestras Condiciones del servicio</li>
          <li>Enviar comunicaciones relacionadas con el servicio, como avisos de mantenimiento, alertas de facturación y novedades de la cuenta</li>
          <li>Mejorar nuestros servicios y nuestra infraestructura a partir de los patrones de uso</li>
        </ul>
        <p className="font-medium text-foreground">
          No usamos tus datos para publicidad. No vendemos, alquilamos ni intercambiamos tu información
          personal con ningún tercero para ningún fin comercial.
        </p>
      </LegalSection>

      <LegalSection number="4" title="Cómo compartimos tu información">
        <p>
          Solo compartimos tu información en las siguientes circunstancias limitadas, y solo en la medida
          necesaria para cada finalidad:
        </p>

        <LegalSubSection title="4.1 Proveedores de servicios">
          <p>
            Trabajamos con proveedores externos que nos ayudan a prestar nuestros servicios. Esos proveedores
            reciben solo los datos necesarios para desempeñar su función y están obligados por contrato a
            proteger esos datos. Esto incluye:
          </p>
          <ul>
            <li>Procesadores de pago (para gestionar las transacciones de facturación)</li>
            <li>Socios de centro de datos y de infraestructura (para el alojamiento físico de los servidores)</li>
            <li>Proveedores de protección frente a bots y abusos, de entrega de contenido y de DNS</li>
            <li>Entrega de correo para mensajes transaccionales como facturas y avisos de cuenta</li>
            <li>Autocompletado de direcciones y geocodificación para los formularios de introducción de direcciones</li>
            <li>Servicios de monitorización del estado (por ejemplo, status.wslatl.com)</li>
          </ul>
          <p>
            Publicamos los proveedores concretos, no solo estas categorías. Cada subencargado está
            nombrado en nuestra página de{' '}
            <Link href={siteConfig.paths.subprocessors}>Subencargados</Link>,
            junto con para qué se usa, qué categorías de datos recibe y dónde está ubicado. Esa
            página se mantiene al día a medida que cambia nuestra infraestructura.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.2 Requisitos legales">
          <p>
            Podemos revelar tu información cuando lo exija la ley, una orden judicial válida, una
            citación o un requerimiento legítimo de autoridades públicas. Cuando la ley lo permita,
            intentaremos avisarte antes de atender esos requerimientos.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.3 Prevención del abuso y fuerzas del orden">
          <p>
            Podemos compartir direcciones IP, logs de red u otros datos técnicos con:
          </p>
          <ul>
            <li>Otros proveedores de hosting que investiguen abusos originados en nuestra red</li>
            <li>Registros de abuso (por ejemplo, AbuseIPDB) cuando tratamos un abuso de red confirmado</li>
            <li>Las fuerzas del orden cuando investiguen una actividad ilegal</li>
            <li>El NCMEC u otras autoridades en casos relacionados con la seguridad de menores</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="4.4 Transmisiones de la empresa">
          <p>
            Si WSLATL LLC es adquirida, se fusiona con otra entidad o atraviesa una transición empresarial
            significativa, tu información puede transferirse como parte de esa operación. Avisaremos por
            correo electrónico a los clientes activos de cualquier cambio de este tipo antes de que se produzca.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.5 Transferencias internacionales">
          <p>
            WSLATL LLC está establecida en el Estado de Missouri, Estados Unidos, y nuestros
            servicios se operan desde Estados Unidos. Si te encuentras en el Espacio Económico
            Europeo, el Reino Unido o Suiza, usar nuestros servicios implica que tus datos
            personales se transfieren a Estados Unidos y, cuando un subencargado opera una red
            global, potencialmente a otros países.
          </p>
          <p>
            Estados Unidos no está cubierto por una decisión de adecuación general aplicable a todos
            los destinatarios. Cuando transferimos datos personales fuera del EEE o del Reino Unido,
            nos basamos en que la transferencia sea necesaria para ejecutar el contrato que nos has
            pedido que ejecutemos, y en las Cláusulas Contractuales Tipo de la Comisión Europea
            junto con el UK International Data Transfer Addendum cuando un subencargado las ofrece.
          </p>
          <p>
            Los mecanismos que se aplican a cada destinatario, y más detalles sobre nuestra posición
            en materia de transferencias, están expuestos en nuestra página de{' '}
            <Link href={siteConfig.paths.subprocessors}>Subencargados</Link>.
            Si necesitas un contrato de encargo de tratamiento o una copia de las cláusulas tal como
            las aplicamos, escríbenos a{' '}
            <Email name="support" />.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="5" title="Conservación de los datos">
        <p>Conservamos tus datos durante los siguientes periodos:</p>
        <ScrollTable label="Periodos de conservación de los datos">
          <table className="legal-table">
            <thead>
              <tr>
                <th scope="col">Tipo de datos</th>
                <th scope="col">Periodo de conservación</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Registros de la cuenta</td>
                <td>La duración de la cuenta + 3 años</td>
              </tr>
              <tr>
                <td>Registros de facturación</td>
                <td>7 años (requisitos fiscales y legales)</td>
              </tr>
              <tr>
                <td>Logs de servidor y de red</td>
                <td>Hasta 90 días (más tiempo si hace falta para una investigación activa)</td>
              </tr>
              <tr>
                <td>Comunicaciones de soporte</td>
                <td>2 años desde la última interacción</td>
              </tr>
              <tr>
                <td>Datos posteriores a la cancelación</td>
                <td>Recuperables a petición hasta 14 días después de la cancelación; se eliminan o se anonimizan no más tarde de 90 días después del cierre de la cuenta (los datos del servicio se retiran antes, conforme a la Sección 9.3 de las Condiciones del servicio)</td>
              </tr>
            </tbody>
          </table>
        </ScrollTable>
        <p>
          Los datos pueden conservarse más allá de estos periodos si lo exige la legislación aplicable, un
          procedimiento legal en curso o una disputa comercial legítima.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Seguridad de los datos">
        <p>
          Proteger tus datos es una responsabilidad fundamental que nos tomamos en serio. Nuestras medidas
          de seguridad incluyen:
        </p>
        <ul>
          <li>El cifrado de los datos sensibles en reposo y en tránsito (HTTPS/TLS en todos los paneles y portales)</li>
          <li>El almacenamiento de contraseñas con hash y salt: las contraseñas en texto plano nunca se almacenan ni son visibles para nosotros</li>
          <li>Controles de acceso internos estrictos que limitan quién de nuestro equipo puede ver los datos de los clientes</li>
          <li>La revisión y el hardening periódicos de nuestra infraestructura de hosting</li>
          <li>La monitorización de patrones de acceso inusuales y de posibles intrusiones</li>
        </ul>
        <p>
          Ninguna transmisión por internet es 100% segura. Aunque usamos protecciones estándar del sector,
          no podemos garantizar una seguridad absoluta. Si crees que tu cuenta se ha visto comprometida,
          escríbenos de inmediato a{' '}
          <Email name="support" />.
        </p>
        <p>
          En caso de una brecha de datos que afecte a tu información, te avisaremos conforme a la
          legislación aplicable, incluida la ley de notificación de brechas de datos de Missouri
          (Mo. Rev. Stat. &sect;&nbsp;407.1500), con la mayor rapidez que permitan las circunstancias.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Cookies">
        <p>
          Usamos cookies de forma mínima y solo cuando es necesario. Nuestro uso de cookies incluye:
        </p>
        <ul>
          <li>
            <strong>Cookies de sesión:</strong> Necesarias para mantener
            tu sesión iniciada en nuestro portal de facturación y en los paneles de hosting. Caducan cuando
            cierras el navegador o cierras la sesión.
          </li>
          <li>
            <strong>Cookies de preferencias:</strong> Pueden almacenar
            preferencias de visualización o ajustes que hayas elegido dentro de nuestros paneles.
          </li>
        </ul>
        <p>
          No usamos cookies publicitarias de terceros, píxeles de seguimiento ni herramientas de analítica
          del comportamiento en wslatl.com. Puedes gestionar o desactivar las cookies en los ajustes de tu
          navegador, pero hacerlo puede afectar al funcionamiento de las áreas autenticadas, como nuestro
          portal de facturación y los paneles de hosting.
        </p>
      </LegalSection>

      <LegalSection number="8" title="Tus derechos y opciones">
        <p>
          Según dónde te encuentres, puedes tener los siguientes derechos sobre tus datos personales:
        </p>
        <ul>
          <li><strong>Acceso:</strong> Solicitar una copia de los datos personales que tenemos sobre ti.</li>
          <li><strong>Rectificación:</strong> Solicitar que corrijamos datos inexactos o incompletos.</li>
          <li><strong>Supresión:</strong> Solicitar la eliminación de tus datos personales, sujeta a los requisitos legales de conservación.</li>
          <li><strong>Portabilidad:</strong> Solicitar tus datos en un formato estructurado y legible por máquina.</li>
          <li><strong>Limitación:</strong> Solicitar que limitemos cómo tratamos tus datos.</li>
          <li><strong>Oposición:</strong> Oponerte a determinados tipos de tratamiento de datos.</li>
        </ul>
        <p>
          Para ejercer cualquiera de estos derechos, escríbenos a{' '}
          <Email name="support" />.
          Responderemos en un plazo de 30 días. Puede que necesitemos verificar tu identidad antes de tramitar tu solicitud.
        </p>
        <p>
          <strong>Los residentes de California</strong> pueden tener
          derechos adicionales conforme a la California Consumer Privacy Act (CCPA) y la California Privacy
          Rights Act (CPRA), incluido el derecho a saber qué información personal se vende o se comparte y el
          derecho a excluirse. No vendemos información personal, por lo que los derechos de exclusión de la
          CCPA no se aplican.
        </p>
        <p>
          <strong>Los residentes del EEE y del Reino Unido</strong> tienen derechos conforme
          al RGPD y al RGPD del Reino Unido, incluidos los derechos enumerados arriba. Nuestra base jurídica
          para tratar tus datos es principalmente la ejecución de un contrato (prestar los servicios que has
          solicitado) y el cumplimiento de obligaciones legales. Las transferencias de tus datos fuera del
          EEE o del Reino Unido se describen en la Sección 4.5.
        </p>

        <LegalSubSection title="8.1 Derecho a reclamar ante una autoridad de control">
          <p>
            Si te encuentras en el Espacio Económico Europeo, el Reino Unido o Suiza, tienes
            derecho, conforme al artículo 77 del RGPD y a la disposición equivalente del RGPD del
            Reino Unido, a presentar una reclamación ante una autoridad de control de protección de
            datos. Puedes reclamar ante la autoridad del país donde vives, donde trabajas o donde
            creas que se ha producido el problema.
          </p>
          <p>
            En el Reino Unido, esa autoridad es la Information Commissioner&rsquo;s Office. En el
            EEE, cada Estado miembro tiene su propia autoridad, y el Comité Europeo de Protección de
            Datos publica la lista actualizada.
          </p>
          <p>
            No tienes que acudir a nosotros primero, y ejercer este derecho no afecta a ningún otro
            recurso a tu disposición. Dicho esto, de verdad preferimos que nos cuentes el problema
            directamente. Escribe a{' '}
            <Email name="support" />{' '}
            y nos lo tomaremos en serio.
          </p>
        </LegalSubSection>

        <LegalSubSection title="8.2 Solicitudes sobre datos alojados en el servicio de otra persona">
          <p>
            Si tus datos personales están alojados en un servicio que un cliente de WSLATL ejecuta
            en nuestra infraestructura, somos el encargado del tratamiento de esos datos y no el
            responsable, como se explica en la Sección 1.1. Por lo general no podemos acceder a
            ellos, corregirlos ni eliminarlos a petición tuya, porque no nos corresponde a nosotros
            decidir sobre ellos.
          </p>
          <p>
            Dirige tu solicitud al operador del servicio que usaste. Si no consigues identificarlo o
            contactar con él, escríbenos y trasladaremos tu solicitud al cliente siempre que
            razonablemente podamos.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="9" title="Requisitos de edad y privacidad de los menores">
        <p>Tenemos una política de edad estricta de tres niveles que se aplica a nuestro sitio web, al portal de facturación y a todos los servicios de hosting:</p>

        <Tiers>
          <Tier tone="critical" title="Menores de 13 años: no permitido">
            Las personas menores de 13 años tienen terminantemente prohibido usar cualquier servicio
            de WSLATL, incluidos nuestro sitio web, el portal de facturación y los paneles de
            hosting. No recogemos a sabiendas información personal de menores de 13 años. Si
            descubrimos, o se nos comunica, que un usuario es menor de 13 años, su cuenta se
            bloqueará de forma inmediata y permanente y se eliminarán todos los datos asociados. Nos
            lo tomamos en serio y tenemos tolerancia cero con el acceso por debajo de la edad mínima.
          </Tier>
          <Tier tone="caution" title="De 13 a 17 años: permitido con el consentimiento de un adulto">
            Damos la bienvenida a los usuarios de 13 a 17 años, pero un padre, una madre o un tutor
            legal debe dar su consentimiento expreso antes de que se use la cuenta. Al registrarse o
            usar nuestros servicios, los usuarios de este grupo de edad confirman que un padre, una
            madre o un tutor ha revisado y aceptado en su nombre nuestras Condiciones del servicio,
            nuestra Política de privacidad y nuestra Política de uso aceptable. El adulto que da el
            consentimiento asume toda la responsabilidad por la actividad de la cuenta del menor y
            por cualquier cargo asociado. Si descubrimos que una cuenta de este rango de edad se creó
            sin el consentimiento de un adulto, la suspenderemos hasta que se facilite un
            consentimiento válido.
          </Tier>
          <Tier tone="good" title="18 años o más: permitido sin restricciones">
            Los adultos de 18 años o más pueden registrarse y usar nuestros servicios sin requisitos
            de consentimiento adicionales, sujeto a la aprobación de la cuenta conforme a nuestro
            modelo solo por solicitud y al cumplimiento de nuestras Condiciones y de la Política de
            uso aceptable.
          </Tier>
        </Tiers>

        <p>
          Si eres padre, madre o tutor y crees que tu hijo o hija menor de 13 años se ha registrado con
          nosotros o nos ha facilitado información personal sin tu conocimiento, escríbenos de inmediato a{' '}
          <Email name="support" />.
          Eliminaremos de forma permanente la cuenta y todos los datos asociados lo antes posible.
        </p>
      </LegalSection>

      <LegalSection number="10" title="Enlaces y servicios de terceros">
        <p>
          Nuestro sitio web y nuestros paneles pueden contener enlaces a servicios de terceros o
          integraciones con ellos, incluidos Discord, GitHub y otros. Esta Política de privacidad no se
          aplica a esos servicios de terceros. Te animamos a revisar las políticas de privacidad de
          cualquier servicio de terceros que uses en relación con nuestra plataforma. No somos
          responsables de las prácticas de privacidad de terceros.
        </p>
      </LegalSection>

      <LegalSection number="11" title="Cambios en esta política">
        <p>
          Podemos actualizar esta Política de privacidad de vez en cuando para reflejar cambios en
          nuestras prácticas, en los requisitos legales o en nuestros servicios. Cuando hagamos cambios
          sustanciales:
        </p>
        <ul>
          <li>Actualizaremos la fecha de entrada en vigor que se muestra en la parte superior de esta página</li>
          <li>Avisaremos por correo electrónico a los clientes activos con un resumen de lo que ha cambiado</li>
          <li>Publicaremos la política actualizada en {siteConfig.paths.privacy}</li>
        </ul>
        <p>
          Que sigas usando nuestros servicios después de la fecha de entrada en vigor de cualquier cambio
          constituye tu aceptación de la Política de privacidad actualizada. Si no estás de acuerdo con
          cambios sustanciales, puedes cancelar tu servicio antes de la fecha de entrada en vigor.
        </p>
      </LegalSection>

      <LegalSection number="12" title="Contacto">
        <p>
          Las preguntas, las dudas o las solicitudes relacionadas con esta Política de privacidad deben
          dirigirse a:
        </p>
        <CompanyContact />
      </LegalSection>
    </>
  )
}
