import { Link } from '@/components/legal/doc-link'
import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'
import { Callout, CompanyContact, InfoCard, InfoRow, ScrollTable, Tier, Tiers } from '@/components/legal/blocks'
import { Email } from '@/components/ui/email'
import { ShortLink } from '@/components/ui/short-link'

export default function AcceptableUseContent() {
  return (
    <>
      <LegalSection number="1" title="Introducción y alcance">
        <p>
          Esta Política de uso aceptable (&ldquo;AUP&rdquo;) se aplica a todos los clientes,
          usuarios y personas que accedan a los servicios prestados por WSLATL LLC, incluidos, entre
          otros, los servidores dedicados, el hosting de servidores de juego, el hosting VPS y el
          hosting web.
        </p>
        <p>
          Esta AUP se incorpora y pasa a formar parte de nuestras{' '}
          <Link href={siteConfig.paths.terms}>Condiciones del servicio</Link>. Al usar
          cualquier servicio de WSLATL, aceptas cumplir esta política. Las infracciones pueden dar
          lugar a la suspensión o cancelación inmediata de tus servicios sin reembolso y, en su
          caso, a la remisión a las fuerzas del orden.
        </p>
        <p>
          Somos una empresa de hosting pequeña y privada. Nuestra infraestructura da servicio a
          clientes reales cuyos negocios y proyectos dependen de una disponibilidad fiable.
          Protegemos esa infraestructura de forma contundente y tenemos tolerancia cero con
          cualquier actividad que la ponga en riesgo a ella o a esos clientes.
        </p>

        <Tiers title="Requisitos de edad">
          <Tier tone="critical" title="Menores de 13 años: prohibido">
            Las personas menores de 13 años no pueden usar ningún servicio de WSLATL. Las cuentas
            que resulten pertenecer a usuarios menores de 13 años se bloquean de forma permanente de
            inmediato y se eliminan todos sus datos. Sin excepciones.
          </Tier>
          <Tier tone="caution" title="De 13 a 17 años: se requiere el consentimiento de un adulto">
            Los usuarios de 13 a 17 años son bienvenidos, pero un padre, una madre o un tutor legal
            debe haber revisado y aceptado estas condiciones en su nombre antes de que se use la
            cuenta. El adulto que da el consentimiento es responsable de toda la actividad y de
            todos los cargos de la cuenta.
          </Tier>
          <Tier tone="good" title="18 años o más: permitido sin restricciones">
            Ningún requisito adicional relacionado con la edad más allá de la aprobación estándar de
            la cuenta.
          </Tier>
        </Tiers>
      </LegalSection>

      <LegalSection number="2" title="Usos permitidos">
        <p>Los servicios de WSLATL se prestan para fines lícitos. Entre los usos permitidos se incluyen:</p>
        <ul>
          <li>Alojar sitios web, aplicaciones web, API REST y contenido estático</li>
          <li>Ejecutar servidores de juego para uso personal o comunitario (conforme a las condiciones de la editora del juego)</li>
          <li>Entornos de desarrollo y de staging, repositorios de código y pipelines de CI/CD</li>
          <li>Proyectos personales, portafolios y aplicaciones de aficionados</li>
          <li>Aplicaciones comerciales legítimas e infraestructura de empresa</li>
          <li>Bases de datos, almacenamiento de archivos e infraestructura de backend</li>
          <li>Servicios de VPN o proxy usados para proteger la privacidad personal (deben declararse al darse de alta; operar un servicio de VPN público requiere aprobación previa)</li>
          <li>Servidores de correo para correo transaccional o personal legítimo (deben declararse al darse de alta; el correo masivo requiere aprobación previa por escrito)</li>
          <li>Pruebas de software e investigación de seguridad en sistemas de tu propiedad o para los que tengas autorización expresa por escrito</li>
        </ul>
      </LegalSection>

      <LegalSection number="3" title="Contenido prohibido">
        <p>
          El siguiente contenido está terminantemente prohibido en la infraestructura de WSLATL en
          cualquier circunstancia. Infringir esta sección dará lugar a la cancelación inmediata sin
          aviso ni reembolso:
        </p>
        <ul>
          <li>
            <strong>Material de abuso sexual infantil (CSAM):</strong>{' '}
            Cualquier contenido que explote sexualmente a menores, los represente o los ponga en
            peligro. Tolerancia cero. Las infracciones se denunciarán de inmediato al National
            Center for Missing &amp; Exploited Children (NCMEC) y a las fuerzas del orden.
          </li>
          <li>
            <strong>Terrorismo y extremismo violento:</strong>{' '}
            Contenido que promueva, capte, financie o facilite el terrorismo, la violencia masiva o
            los movimientos extremistas violentos.
          </li>
          <li>
            <strong>Malware y software malicioso:</strong>{' '}
            Alojar, distribuir o desarrollar virus, ransomware, spyware, troyanos, keyloggers,
            rootkits o cualquier otro software diseñado para dañar o alterar sistemas informáticos,
            o para acceder a ellos sin autorización.
          </li>
          <li>
            <strong>Phishing y fraude:</strong>{' '}
            Páginas, dominios o aplicaciones diseñados para engañar a los usuarios y conseguir que
            faciliten credenciales, información financiera o datos personales con falsos pretextos.
          </li>
          <li>
            <strong>Contenido que infringe derechos de autor:</strong>{' '}
            Alojar o distribuir contenido que infrinja los derechos de autor, las marcas u otros
            derechos de propiedad intelectual de cualquier persona o entidad.
          </li>
          <li>
            <strong>Contenido falsificado o fraudulento:</strong>{' '}
            Tiendas falsas, productos falsificados, fábricas de títulos o cualquier actividad
            comercial fraudulenta.
          </li>
          <li>
            <strong>Armas ilegales y sustancias controladas:</strong>{' '}
            Contenido que facilite la venta, la fabricación o la distribución ilegales de armas,
            sustancias controladas u otro contrabando.
          </li>
          <li>
            <strong>Juego sin licencia:</strong>{' '}
            Operar servicios de juego en línea sin todas las licencias y autorizaciones legales aplicables.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="4" title="Actividades prohibidas">

        <LegalSubSection title="4.1 Ataques de red y abuso de la infraestructura">
          <p>Las siguientes actividades están terminantemente prohibidas y darán lugar a la cancelación inmediata:</p>
          <ul>
            <li>
              <strong>Ataques DDoS:</strong> Realizar,
              facilitar, lanzar o participar en ataques de denegación de servicio distribuido contra
              cualquier objetivo, incluidos otros clientes de WSLATL, servicios externos o cualquier
              infraestructura de internet. Es la regla que aplicamos con más rigor.
            </li>
            <li>
              <strong>Escaneo de puertos y de vulnerabilidades:</strong>{' '}
              Escanear, sondear o mapear la red o los servicios de sistemas que no sean de tu
              propiedad o para los que no tengas autorización expresa por escrito
            </li>
            <li>
              <strong>Interceptación de red:</strong>{' '}
              Ataques man-in-the-middle, envenenamiento ARP, secuestro de DNS, SSL stripping o
              cualquier técnica destinada a interceptar o alterar el tráfico de red
            </li>
            <li>El IP spoofing o el envío de tráfico con direcciones de origen falsificadas</li>
            <li>Intentar explotar vulnerabilidades de la infraestructura de WSLATL o de los servicios de otros clientes</li>
            <li>Usar la infraestructura de WSLATL como punto de preparación o de reenvío para ataques contra sistemas externos</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="4.2 Spam y comunicaciones no solicitadas">
          <ul>
            <li>Enviar correo masivo no solicitado (spam) de cualquier tipo</li>
            <li>Operar un relay de correo abierto que pueda usarse para enviar spam</li>
            <li>La suplantación de correo, las campañas de phishing o la suplantación de identidad</li>
            <li>El spam por SMS o cualquier forma de mensajería masiva no solicitada</li>
            <li>Extraer, recolectar o recopilar direcciones de correo electrónico o datos personales sin consentimiento</li>
            <li>Enviar correo comercial masivo sin mecanismos de baja que cumplan la CAN-SPAM</li>
          </ul>
          <p>
            Los clientes que necesiten enviar correo transaccional o de marketing legítimo en
            volumen deben declarar este caso de uso al darse de alta y mantener el cumplimiento de
            la CAN-SPAM Act y de cualquier otra legislación antispam aplicable.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.3 Acceso no autorizado">
          <ul>
            <li>Intentar acceder a cualquier sistema informático, cuenta, base de datos o red a la que no estés autorizado a acceder</li>
            <li>Los ataques de fuerza bruta contra cualquier interfaz de inicio de sesión, incluidos SSH, RDP, aplicaciones web y API</li>
            <li>El credential stuffing con conjuntos de credenciales filtradas o robadas</li>
            <li>La ingeniería social dirigida al personal de WSLATL, a otros clientes o a cualquier tercero</li>
            <li>Usar nuestros servicios para facilitar el acceso no autorizado a sistemas de terceros</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="4.4 Minería de criptomonedas">
          <ul>
            <li>La minería de criptomonedas o de blockchain de cualquier tipo está <strong>prohibida por defecto</strong> en los planes de hosting de juego y de hosting web</li>
            <li>Minar en planes de VPS o de servidor dedicado requiere una <strong>aprobación por escrito</strong> previa de WSLATL antes de comenzar la actividad</li>
            <li>Las operaciones de minería aprobadas no deben afectar negativamente al consumo eléctrico del centro de datos, a los sistemas de refrigeración ni a la infraestructura compartida</li>
            <li>Nos reservamos el derecho a revocar la aprobación de minería en cualquier momento si afecta a nuestra infraestructura o a otros clientes</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="4.5 Actividades ilegales">
          <ul>
            <li>Usar la infraestructura de WSLATL para cualquier actividad que infrinja la legislación local, estatal, federal o internacional aplicable</li>
            <li>Facilitar el fraude, el blanqueo de capitales, el fraude electrónico o los delitos financieros</li>
            <li>Operar mercados ilegales o servicios de la darknet</li>
            <li>Eludir órdenes judiciales legítimas u obstruir la acción de las fuerzas del orden</li>
            <li>Eludir sanciones o realizar actividades prohibidas por la legislación de control de exportaciones aplicable</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="4.6 Vulneraciones de la privacidad">
          <ul>
            <li>Recoger, tratar o almacenar datos personales sin una base jurídica adecuada o sin consentimiento</li>
            <li>Operar servicios infringiendo el RGPD, la CCPA, la COPPA u otra legislación de protección de datos aplicable</li>
            <li>El doxing o la publicación de información personal privada sobre personas sin su consentimiento</li>
            <li>El stalkerware o el software de vigilancia que funciona sin conocimiento de la persona vigilada</li>
          </ul>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="5" title="Pautas de uso de recursos">
        <p>
          Es necesario un uso responsable de los recursos para mantener un entorno justo y estable
          para todos los clientes. Se aplican las siguientes pautas:
        </p>
        <ul>
          <li>
            <strong>Ancho de banda:</strong> Puedes usar ancho
            de banda hasta la asignación incluida en tu plan. Los excesos se facturan a las tarifas
            que figuran en tu portal de facturación. Los planes de ancho de banda sin medir están
            sujetos a un uso razonable; abusar de los planes sin medir puede dar lugar a una
            limitación de velocidad o a una mejora de plan obligatoria.
          </li>
          <li>
            <strong>CPU y RAM:</strong> Está prohibido
            consumir intencionadamente recursos por encima de la asignación de tu plan en perjuicio
            de otros clientes (en infraestructura compartida) o para eludir los límites del plan.
          </li>
          <li>
            <strong>E/S de disco:</strong> Las cargas de
            trabajo que generan una E/S de disco alta y sostenida que afecta a la infraestructura de
            almacenamiento compartido deben hablarse con nosotros por adelantado.
          </li>
          <li>
            <strong>Conexiones salientes:</strong> Está
            prohibido generar volúmenes anormalmente altos de conexiones de red salientes (por
            ejemplo, inundaciones de conexiones) sin notificación previa.
          </li>
        </ul>
        <p>
          Si tienes un caso de uso legítimo que requiere un consumo alto de recursos, háblalo con
          nosotros antes de que se convierta en un problema. Somos flexibles con los clientes que se
          comunican con franqueza.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Reglas específicas de los servidores de juego">
        <p>Para los clientes que usan nuestros servicios de hosting de servidores de juego:</p>
        <ul>
          <li>Los servidores de juego deben ejecutar software y configuraciones que cumplan las condiciones del servicio y el contrato de licencia de usuario final de la editora del juego correspondiente</li>
          <li>Está prohibido alojar software de servidor de juego pirateado, clientes crackeados o cualquier contenido de juego que infrinja derechos de autor</li>
          <li>No ejecutes en los planes de hosting de juego procesos ajenos a tu servidor de juego sin aprobación previa (por ejemplo, minería, bots o scraping)</li>
          <li>Los mods, los plugins y las configuraciones del servidor no deben usarse para realizar ninguna de las actividades prohibidas que se enumeran en esta AUP</li>
          <li>Nuestra protección DDoS se proporciona para defender tu servidor; no intentes eludirla, desactivarla ni abusar de ella</li>
          <li>Superar el límite de slots de jugador o los recursos asignados de tu plan requiere una mejora de plan antes de usarlos, no después</li>
          <li>Los servidores de juego usados para acosar, amenazar o dañar a otros jugadores pueden ser suspendidos a la espera de una investigación</li>
        </ul>
      </LegalSection>

      <LegalSection number="7" title="Pruebas e investigación de seguridad">
        <p>
          La investigación de seguridad y las pruebas de penetración solo se permiten en las siguientes condiciones:
        </p>
        <ul>
          <li>
            <strong>Tus propios sistemas:</strong> Puedes
            realizar pruebas de seguridad en servidores y servicios de tu propiedad y bajo tu
            control, sin más restricciones que las prohibiciones de la Sección 4.
          </li>
          <li>
            <strong>Sistemas de terceros autorizados:</strong>{' '}
            Puedes realizar pruebas de seguridad en sistemas de terceros solo si cuentas con una
            autorización expresa, documentada y por escrito del propietario del sistema. Podemos pedirte una prueba de esa autorización.
          </li>
          <li>
            <strong>La infraestructura de WSLATL:</strong> Las
            pruebas contra la propia infraestructura de WSLATL (nuestros paneles, nuestras redes o los servidores de otros clientes)
            están prohibidas sin nuestra autorización previa por escrito, sea cual sea la intención.
          </li>
        </ul>
        <p>
          La infraestructura de competiciones CTF (Capture the Flag) y los honeypots deliberados se
          permiten avisando antes a nuestro equipo.
        </p>
      </LegalSection>

      <LegalSection number="8" title="Denunciar un abuso">
        <p>
          Si crees que la infraestructura de WSLATL se está usando para una actividad abusiva,
          ilegal o dañina, denúncialo de inmediato. Nos tomamos en serio todas las denuncias de
          abuso y las investigamos sin demora.
        </p>
        <InfoCard title="Dónde denunciar un abuso">
          <InfoRow label="Correo">
            <Email name="abuse" /> (Asunto: Abuse Report)
          </InfoRow>
          <InfoRow label="Discord">
            <ShortLink name="discord" />
          </InfoRow>
        </InfoCard>
        <p>
          Incluye en tu denuncia todo el detalle que puedas: las direcciones IP implicadas, las
          marcas de tiempo (con la zona horaria), extractos de logs, URL y una descripción de la
          actividad abusiva. Cuanto más detalle aportes, más rápido podremos investigar y responder.
        </p>
      </LegalSection>

      <LegalSection number="9" title="Aplicación de las medidas">
        <p>
          WSLATL se reserva el derecho a tomar cualquier medida que consideremos adecuada en
          respuesta a las infracciones de esta AUP. Las medidas son proporcionales a la gravedad,
          pero siempre damos prioridad a proteger nuestra red y a los demás clientes.
        </p>

        <ScrollTable label="Medidas según la gravedad">
          <table className="legal-table">
            <thead>
              <tr>
                <th scope="col">Gravedad</th>
                <th scope="col">Ejemplos</th>
                <th scope="col">Respuesta</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium text-foreground">Leve</td>
                <td>Un primer exceso de recursos, una desviación leve de las Condiciones</td>
                <td>Aviso + subsanación obligatoria en el plazo indicado</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Moderada</td>
                <td>Spam, escaneo no autorizado, infracciones leves reiteradas</td>
                <td>Suspensión inmediata a la espera de la investigación; posible restablecimiento si se subsana</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Grave</td>
                <td>Ataques DDoS, alojamiento de malware, CSAM, actividad ilegal</td>
                <td>Cancelación inmediata, sin reembolso, conservación de datos para las fuerzas del orden, remisión a las autoridades</td>
              </tr>
            </tbody>
          </table>
        </ScrollTable>

        <p>WSLATL se reserva el derecho a:</p>
        <ul>
          <li>Suspender servicios de inmediato y sin aviso previo cuando haya una amenaza activa y en curso para nuestra red o para terceros</li>
          <li>Cooperar plena y proactivamente con las investigaciones de las fuerzas del orden</li>
          <li>Compartir denuncias de abuso, logs e información identificativa con las autoridades competentes y con los registros de abuso (AbuseIPDB, SpamCop, etc.)</li>
          <li>Cancelar las cuentas de los infractores reincidentes sin derecho a reembolso</li>
          <li>Ejercer acciones legales civiles o penales contra los clientes que causen un daño significativo</li>
        </ul>

        <Callout tone="caution" title="Nota sobre el abuso de red">
          Si tu servidor es el
          origen de tráfico de abuso saliente (DDoS, spam, escaneo), suspenderemos el servicio
          primero e investigaremos después. Esto es para proteger a los demás clientes y al resto de
          internet. Nos pondremos en contacto contigo enseguida después de la suspensión para
          comentar lo que hayamos encontrado.
        </Callout>
      </LegalSection>

      <LegalSection number="10" title="Cambios en esta política">
        <p>
          Podemos actualizar esta Política de uso aceptable de vez en cuando para hacer frente a
          nuevas amenazas, nuevos servicios o nuevos requisitos legales. Cuando hagamos cambios
          sustanciales:
        </p>
        <ul>
          <li>Actualizaremos la fecha de entrada en vigor en la parte superior de esta página</li>
          <li>Avisaremos por correo electrónico a los clientes activos con un resumen de lo que ha cambiado</li>
          <li>Publicaremos la AUP actualizada en {siteConfig.paths.acceptableUse}</li>
        </ul>
        <p>
          Que sigas usando los servicios de WSLATL después de la fecha de entrada en vigor de
          cualquier cambio constituye la aceptación de la política actualizada.
        </p>
      </LegalSection>

      <LegalSection number="11" title="Contacto">
        <p>
          Las preguntas sobre esta Política de uso aceptable o sobre si un caso de uso concreto está
          permitido deben dirigirse a nosotros antes de empezar, no después.
        </p>
        <CompanyContact>
          <InfoRow label="Correo">
            <Email name="support" />
          </InfoRow>
        </CompanyContact>
      </LegalSection>
    </>
  )
}
