import { Link } from '@/components/legal/doc-link'
import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'
import { Callout, CompanyContact, InfoCard, InfoRow } from '@/components/legal/blocks'
import { Email } from '@/components/ui/email'
import { ShortLink } from '@/components/ui/short-link'

export default function AbuseContent() {
  return (
    <>
      <LegalSection number="1" title="Descripción general y alcance">
        <p>
          Esta Política de abuso explica cómo denunciar un abuso de la infraestructura operada por
          WSLATL LLC (&ldquo;WSLATL&rdquo;, &ldquo;nosotros&rdquo;, &ldquo;nuestro&rdquo; o
          &ldquo;nos&rdquo;), qué hacemos con una denuncia una vez la recibimos y cómo actuamos con
          los servicios de nuestra red que son el origen del abuso.
        </p>
        <p>
          Acompaña a nuestra{' '}
          <Link href={siteConfig.paths.acceptableUse}>Política de uso aceptable</Link>,
          que define qué está y qué no está permitido en nuestra infraestructura, y a nuestras{' '}
          <Link href={siteConfig.paths.terms}>Condiciones del servicio</Link>,
          en las que ambas se incorporan por referencia. Las reclamaciones por derechos de autor se
          tramitan a través de nuestra{' '}
          <Link href={siteConfig.paths.dmca}>Política DMCA</Link>{' '}
          y no a través de esta página.
        </p>
        <p>
          Somos una empresa de hosting pequeña y privada, y nos tomamos en serio el abuso de nuestra
          red, tanto porque perjudica a otras personas como porque pone en riesgo a los clientes que
          comparten nuestra infraestructura. Se investiga toda denuncia creíble.
        </p>
      </LegalSection>

      <LegalSection number="2" title="Cómo denunciar un abuso">
        <p>
          Si crees que alguna infraestructura de WSLATL (un servidor, una dirección IP, un sitio
          web, un servidor de juego o un correo electrónico) se está usando para una actividad
          abusiva, ilegal o dañina, denúncialo a nuestro equipo de abuso. Es la forma más rápida de
          llegar a las personas que pueden actuar.
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
          El correo electrónico es el canal que vigilamos para los abusos y el que deja un registro
          sobre el que podemos actuar. Una denuncia hecha solo en un canal de Discord puede pasar
          desapercibida; si un asunto es urgente, envíalo por correo electrónico.
        </p>
      </LegalSection>

      <LegalSection number="3" title="Qué incluir en una denuncia">
        <p>
          Cuanto más precisa sea tu denuncia, más rápido podremos encontrar el origen y actuar.
          Incluye todo lo siguiente que tengas:
        </p>
        <ul>
          <li>La dirección IP, el dominio, la URL o el servidor implicado</li>
          <li>Las marcas de tiempo de la actividad, con la zona horaria o un desfase respecto a UTC</li>
          <li>Los extractos de logs pertinentes, las cabeceras de correo o las capturas de paquetes, pegados como texto siempre que sea posible</li>
          <li>Una descripción clara de la actividad y de por qué crees que es abusiva</li>
          <li>Cómo ponernos en contacto contigo si necesitamos más información</li>
        </ul>
        <p>
          Los logs son más útiles en su formato de texto original y con las cabeceras completas
          intactas. Las capturas de pantalla sirven como complemento, pero por sí solas son más
          difíciles de verificar.
        </p>
      </LegalSection>

      <LegalSection number="4" title="Qué consideramos abuso">
        <p>
          Abuso es cualquier uso de nuestra infraestructura que infrinja nuestra{' '}
          <Link href={siteConfig.paths.acceptableUse}>Política de uso aceptable</Link>{' '}
          o la legislación aplicable. Entre las categorías habituales sobre las que actuamos se
          incluyen:
        </p>
        <ul>
          <li>
            <strong>Ataques de red.</strong> Tráfico DDoS,
            escaneo de puertos y de vulnerabilidades, intentos de fuerza bruta o intentos de
            intrusión originados en nuestro espacio de IP.
          </li>
          <li>
            <strong>Spam y correo no solicitado.</strong> Correo
            masivo o no solicitado, relays de correo abiertos y suplantación de correo.
          </li>
          <li>
            <strong>Phishing y fraude.</strong> Páginas o
            servicios creados para robar credenciales o datos de pago, o para engañar a las personas
            con ánimo de lucro.
          </li>
          <li>
            <strong>Malware.</strong> Alojar o distribuir
            virus, ransomware, servidores de mando y control u otro software malicioso.
          </li>
          <li>
            <strong>Contenido ilegal.</strong> Contenido cuyo
            alojamiento es ilícito, incluido el material descrito en la Sección 3 de nuestra
            Política de uso aceptable.
          </li>
          <li>
            <strong>Acoso y amenazas.</strong> Usar nuestros
            servicios para acosar, amenazar, doxear o poner en peligro a una persona.
          </li>
        </ul>
        <p>
          Para conocer al detalle todo lo que está prohibido, consulta las Secciones 3 y 4 de la
          Política de uso aceptable. La infracción de derechos de autor se trata por separado en la{' '}
          <Link href={siteConfig.paths.dmca}>Política DMCA</Link>.
        </p>
      </LegalSection>

      <LegalSection number="5" title="Qué pasa después de que denuncies">
        <p>Revisamos todas las denuncias creíbles. Nuestro proceso general es este:</p>
        <ul>
          <li>
            <strong>Acusamos recibo.</strong> Procuramos
            confirmar la recepción de una denuncia enviada por correo lo antes posible, y damos
            prioridad al abuso activo y en curso frente al trabajo rutinario.
          </li>
          <li>
            <strong>Investigamos.</strong> Identificamos el
            servicio implicado, revisamos las pruebas y determinamos si se han incumplido nuestras
            políticas o la ley.
          </li>
          <li>
            <strong>Actuamos de forma proporcionada.</strong> Según
            la gravedad, podemos contactar con el cliente para que lo subsane, retirar o desactivar
            contenido concreto, suspender el servicio o cancelar la cuenta. La aplicación de las
            medidas sigue la Sección 9 de la Política de uso aceptable.
          </li>
        </ul>

        <LegalSubSection title="5.1 Abuso saliente activo: primero suspendemos">
          <p>
            Cuando un servicio de nuestra red es el origen activo de un abuso saliente, como un DDoS
            en curso, un envío masivo de spam en marcha o un escaneo activo, suspenderemos el
            servicio primero e investigaremos después, para proteger a los demás clientes y al resto
            de internet. Nos ponemos en contacto con el cliente afectado enseguida después de la
            suspensión para explicarle qué hemos encontrado.
          </p>
        </LegalSubSection>

        <LegalSubSection title="5.2 Qué podemos contarte">
          <p>
            Confirmaremos que una denuncia se ha recibido y que se ha actuado sobre ella siempre que
            razonablemente podamos. No compartimos los datos de la cuenta de otro cliente, los
            detalles de una investigación ni el resultado de las medidas adoptadas contra un
            tercero, y puede que estemos limitados en lo que podemos revelar mientras una
            investigación está abierta o cuando la ley exige confidencialidad.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="6" title="Cooperación con registros y autoridades">
        <p>
          Cuando procede, cooperamos con los registros de abuso y los servicios de denuncia, y
          podemos compartir con ellos, o con los operadores de las redes afectadas, los logs
          pertinentes y la información identificativa. Conservamos las pruebas y damos parte a las
          fuerzas del orden cuando la ley lo exige o cuando la conducta lo justifica.
        </p>
        <Callout tone="critical" title="Material de abuso sexual infantil">
          Tenemos tolerancia cero con el material de abuso sexual infantil (CSAM). El CSAM
          confirmado se denuncia de inmediato al National Center for Missing &amp; Exploited
          Children (NCMEC) y a las fuerzas del orden, la cuenta se cancela y se conservan las
          pruebas. Para denunciar un posible CSAM en nuestra infraestructura, escribe a{' '}
          <Email name="abuse" /> con &ldquo;CSAM&rdquo; en el asunto, o denúncialo directamente al
          NCMEC a través de su CyberTipline.
        </Callout>
      </LegalSection>

      <LegalSection number="7" title="Solicitudes de las fuerzas del orden">
        <p>
          Las fuerzas del orden que busquen registros o su conservación deben escribirnos a{' '}
          <Email name="abuse" />{' '}
          con &ldquo;Law Enforcement Request&rdquo; en el asunto. Respondemos a los requerimientos
          legales válidos notificados a WSLATL LLC, y conservaremos los registros pertinentes ante
          una solicitud de conservación de alcance adecuado mientras se obtiene el procedimiento
          correspondiente. No revelamos datos de clientes sin un requerimiento legal válido, salvo
          cuando la ley lo permita o lo exija, como en una emergencia que implique riesgo de muerte
          o de daño físico grave.
        </p>
      </LegalSection>

      <LegalSection number="8" title="Denuncias que no podemos atender aquí">
        <p>Algunos asuntos corresponden a otro canal:</p>
        <ul>
          <li>
            <strong>Derechos de autor.</strong> Las
            notificaciones de retirada por derechos de autor y las contranotificaciones se tramitan
            a través de nuestra{' '}
            <Link href={siteConfig.paths.dmca}>Política DMCA</Link>,
            no en esta página.
          </li>
          <li>
            <strong>Contenido que no alojamos.</strong> Si se
            trata de un dominio registrado en otro sitio, de contenido en una red de terceros o de
            una cuenta en una plataforma que no operamos, no somos el destinatario correcto y no
            podemos retirar el material. Denúncialo ante el operador de ese servicio.
          </li>
          <li>
            <strong>Dudas de facturación y de cuenta.</strong>{' '}
            Las dudas sobre tu propio servicio o tu facturación van a{' '}
            <Email name="support" />, no al canal de abuso.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="9" title="Denunciar de buena fe">
        <p>
          Denuncia con honestidad y de buena fe. Las denuncias de abuso falsas a sabiendas o de mala
          fe, las presentadas para acosar a otro cliente y los intentos de usar este canal como arma
          contra un competidor nos hacen perder el tiempo que dedicaríamos a un daño real. Podemos
          negarnos a actuar sobre las denuncias procedentes de una fuente que haya abusado
          reiteradamente de este proceso.
        </p>
      </LegalSection>

      <LegalSection number="10" title="Cambios en esta política">
        <p>
          Podemos actualizar esta Política de abuso para reflejar cambios en nuestras prácticas, en
          nuestros servicios o en la legislación aplicable. Cuando hagamos cambios sustanciales,
          actualizaremos la fecha de entrada en vigor en la parte superior de esta página y
          publicaremos la política actualizada en{' '}
          <Link href={siteConfig.paths.abuse}>
            {siteConfig.siteUrl}{siteConfig.paths.abuse}
          </Link>.
        </p>
      </LegalSection>

      <LegalSection number="11" title="Contacto">
        <p>
          Las denuncias de abuso deben ir a nuestro equipo de abuso. Las preguntas generales sobre
          esta política pueden enviarse a las direcciones que figuran abajo.
        </p>
        <CompanyContact>
          <InfoRow label="Abuso">
            <Email name="abuse" />
          </InfoRow>
          <InfoRow label="General">
            <Email name="support" /> o <Email name="hello" />
          </InfoRow>
        </CompanyContact>
      </LegalSection>
    </>
  )
}
