import { Link } from '@/components/legal/doc-link'
import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'
import { uptimeTarget } from '@/data/sla'
import { Callout, CompanyContact, ScrollTable } from '@/components/legal/blocks'
import { Email } from '@/components/ui/email'
import { ShortLink } from '@/components/ui/short-link'

export default function RefundContent() {
  return (
    <>
      <LegalSection number="1" title="Descripción general y alcance">
        <p>
          Esta Política de reembolsos rige todas las solicitudes de reembolso de los servicios
          prestados por WSLATL LLC (&ldquo;WSLATL&rdquo;, &ldquo;nosotros&rdquo;,
          &ldquo;nuestro&rdquo; o &ldquo;nos&rdquo;). Se aplica a los servidores dedicados, al
          hosting de servidores de juego, al hosting VPS y al hosting web.
        </p>
        <p>
          Esta política se incorpora y pasa a formar parte de nuestras{' '}
          <Link href={siteConfig.paths.terms}>Condiciones del servicio</Link> por referencia.
          Las reglas que figuran abajo son la fuente de referencia sobre la admisibilidad de los
          reembolsos, los plazos y su tramitación. En caso de conflicto entre esta Política de
          reembolsos y cualquier otro documento de WSLATL, prevalece esta Política de reembolsos.
        </p>
        <p>
          Somos una empresa de hosting pequeña y privada. Esta política existe para ser justa, no
          para ponerse en contra. Siempre tramitaremos las solicitudes de reembolso con honestidad y
          de buena fe. Si algo no está cubierto abajo, escríbenos y lo resolveremos contigo
          directamente.
        </p>
      </LegalSection>

      <LegalSection number="2" title="Plazos de reembolso">
        <p>
          Tenemos un plazo de reembolso de dos niveles que se mide desde la fecha de tu compra
          inicial del servicio. Los dos niveles se resumen abajo:
        </p>

        <ScrollTable label="Plazos de reembolso">
          <table className="legal-table">
            <thead>
              <tr>
                <th scope="col">Plazo</th>
                <th scope="col">Admisibilidad</th>
                <th scope="col">Importe del reembolso</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium text-foreground">De 0 a 48 horas</td>
                <td>Cualquier motivo, incluido el cambio de opinión. Sin preguntas.</td>
                <td>Reembolso íntegro</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">De 49 horas a 14 días</td>
                <td>Caso por caso. Solo se aplican los motivos admitidos que se enumeran en la Sección 3.</td>
                <td>Reembolso íntegro para los servicios admisibles</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Después de 14 días</td>
                <td>Sin reembolsos.</td>
                <td>Ninguno</td>
              </tr>
            </tbody>
          </table>
        </ScrollTable>

        <p>
          La <strong>fecha de compra inicial</strong> es la fecha
          en que el servicio se activó y se aprovisionó para ti por primera vez, no la fecha de una
          renovación posterior. Las renovaciones reinician su propio plazo de 14 días (véase la
          Sección 9).
        </p>

        <LegalSubSection title="2.1 Plazo de 48 horas, por cualquier motivo">
          <p>
            Si solicitas un reembolso dentro de las{' '}
            <strong>48 horas</strong> siguientes a la fecha de
            compra inicial de un servicio, emitiremos un reembolso íntegro. Este es el plazo para el
            cambio de opinión. No exigiremos un motivo y no te pediremos que justifiques tu
            decisión.
          </p>
          <p>
            Los conceptos enumerados en la Sección 5 (Conceptos no reembolsables) quedan excluidos
            incluso dentro del plazo de 48 horas. En particular, los servidores dedicados no son
            reembolsables en ninguna circunstancia (véase la Sección 5.1).
          </p>
        </LegalSubSection>

        <LegalSubSection title="2.2 Plazo de 14 días, caso por caso">
          <p>
            Entre las <strong>49 horas y los 14 días naturales</strong>{' '}
            desde la fecha de compra inicial, solo se emiten reembolsos íntegros por los motivos
            admitidos concretos que se enumeran en la Sección 3. Las solicitudes de reembolso ajenas
            a esos motivos no son admisibles durante este plazo.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="3" title="Motivos admitidos (plazo de 14 días)">
        <p>
          Los siguientes motivos dan derecho a un reembolso íntegro durante el plazo de 14 días de
          evaluación caso por caso. Podemos pedirte información de apoyo (marcas de tiempo,
          mensajes de error, historial de tickets, etc.) para verificar el motivo.
        </p>

        <LegalSubSection title="3.1 Interrupción del servicio que supera el SLA">
          <p>
            Si tu servicio sufre una interrupción que supera el objetivo de disponibilidad aplicable de nuestro{' '}
            <Link href={siteConfig.paths.sla}>Acuerdo de Nivel de Servicio</Link>{' '}
            ({uptimeTarget('vps')} para el hosting VPS y web, {uptimeTarget('game')} para el hosting de servidores de juego), puedes solicitar un
            reembolso íntegro del servicio afectado. Las interrupciones causadas por hechos ajenos a
            nuestro control razonable (fuerza mayor) no dan derecho a reembolso.
          </p>
          <p>
            Para que se admita, la interrupción debe poder verificarse a través de nuestra página de
            estado, de nuestros sistemas de monitorización o de tus propias pruebas documentadas. El
            crédito del 10% del SLA descrito en el Acuerdo de Nivel de Servicio sigue disponible
            como recurso independiente; este derecho de reembolso se suma a él, no lo sustituye.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.2 Error de facturación">
          <p>
            Si se te ha cobrado un importe incorrecto, se te ha facturado por duplicado o se te ha
            facturado un servicio que no autorizaste, tienes derecho al reembolso íntegro del cargo
            erróneo. Esto se aplica con independencia del plazo en el que se descubra el error.
            Comunica los posibles errores de facturación en cuanto los detectes.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.3 El servicio no funcionó">
          <p>
            Si el servicio que compraste nunca funcionó o tuvo un defecto crítico que no pudimos
            resolver, puedes tener derecho a un reembolso íntegro.
          </p>
          <p>
            <strong>Tienes que habernos escrito antes.</strong>{' '}
            Para que se admita conforme a esta sección, debes haber hecho un esfuerzo razonable por
            ponerte en contacto con nosotros sobre el problema antes de solicitar el reembolso. Los
            canales de contacto válidos son:
          </p>
          <ul>
            <li>Un ticket de soporte abierto en nuestro portal de facturación</li>
            <li>Un correo electrónico a <Email name="support" /></li>
            <li>Un mensaje en nuestro servidor de Discord o un mensaje directo a nuestro equipo</li>
          </ul>
          <p>
            Necesitamos ver una prueba del contacto (un número de ticket, un hilo de correo o un
            registro de mensajes) para confirmar que se nos dio la oportunidad de diagnosticar y
            arreglar el problema. Las solicitudes de reembolso por este motivo sin ningún intento de
            contacto previo se rechazarán.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="4" title="Cambio de opinión">
        <p>
          El cambio de opinión es un motivo admitido únicamente dentro del plazo de 48 horas
          descrito en la Sección 2.1. Una vez transcurridas 48 horas desde la fecha de compra
          inicial, el cambio de opinión no es un motivo admisible para un reembolso conforme a esta
          política.
        </p>
        <p>
          Si no estás seguro de que un servicio sea el adecuado para ti, te recomendamos
          encarecidamente que nos escribas por Discord antes de comprar. Con mucho gusto respondemos
          preguntas técnicas y te ayudamos a elegir el plan adecuado. El proceso de alta solo por
          solicitud también es una buena oportunidad para preguntar y confirmar que encaja.
        </p>
      </LegalSection>

      <LegalSection number="5" title="Conceptos no reembolsables">
        <p>
          Lo siguiente <strong>no es reembolsable</strong>{' '}
          en ninguna circunstancia. Esta lista se aplica tanto al plazo de 48 horas como al de 14
          días.
        </p>

        <Callout tone="critical" title="5.1 Servidores dedicados">
          Los servidores dedicados no tienen derecho a reembolsos de ningún tipo, en ningún momento
          y por ningún motivo. La adquisición del hardware, las asignaciones de IP, el espacio de
          rack en el centro de datos y los compromisos de ancho de banda se contraen dando por
          supuesta una permanencia a largo plazo. Esta exclusión se aplica incluso dentro del plazo
          de 48 horas para el cambio de opinión.
        </Callout>

        <ul>
          <li>
            <strong>Cuotas de alta y aprovisionamiento personalizado:</strong>{' '}
            Las cuotas de alta únicas, la instalación del sistema operativo, el trabajo de
            configuración personalizada, las migraciones manuales y otros cargos no recurrentes
            similares. Cubren mano de obra y recursos que no se pueden recuperar una vez realizados.
          </li>
          <li>
            <strong>Cuotas de licencia de terceros:</strong>{' '}
            Los costes repercutidos que no podemos recuperar del proveedor, incluidas las licencias
            de cPanel, las licencias de Pterodactyl y otro software que revendemos como parte de un
            plan.
          </li>
          <li>
            <strong>Cuotas de registro y renovación de dominios:</strong>{' '}
            Cualquier cargo relacionado con dominios contraído a través de nosotros. Los registros
            de dominio se tramitan a través de un registrador y se rigen por las condiciones de
            reembolso del propio registrador.
          </li>
          <li>
            <strong>Extras ya consumidos:</strong>{' '}
            Las direcciones IP adicionales, los excesos de ancho de banda, las restauraciones de
            copias de seguridad y cualquier otro cargo por extras de consumo o de pago único que ya
            se haya entregado o contraído en el momento de la solicitud de reembolso.
          </li>
          <li>
            <strong>Servicios cancelados por vulnerar la Política de uso aceptable o las Condiciones:</strong>{' '}
            Si tu servicio se suspendió o se canceló por vulnerar nuestra{' '}
            <Link href={siteConfig.paths.acceptableUse}>Política de uso aceptable</Link>{' '}
            o las Condiciones del servicio, no se emitirá ningún reembolso. Esto se aplica incluso
            si la cancelación se produjo dentro de las 48 horas o dentro del plazo de 14 días.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="6" title="Cómo solicitar un reembolso">
        <p>
          Para solicitar un reembolso, escríbenos por cualquiera de los canales siguientes.
          Preferimos el ticket del portal de facturación porque nos da el acceso más directo a tu
          cuenta y a tu historial de facturas.
        </p>
        <ul>
          <li>
            <strong>Ticket del portal de facturación:</strong> Entra en{' '}
            <ShortLink name="billing" />{' '}
            y abre un ticket de soporte
          </li>
          <li>
            <strong>Correo:</strong>{' '}
            <Email name="support" />
          </li>
          <li>
            <strong>Discord:</strong>{' '}
            <ShortLink name="discord" />
          </li>
        </ul>
        <p>
          Para que podamos tramitar tu solicitud rápido, incluye:
        </p>
        <ul>
          <li>La dirección de correo electrónico de tu cuenta de WSLATL</li>
          <li>El servicio del que solicitas el reembolso</li>
          <li>El número o los números de factura implicados</li>
          <li>El motivo del reembolso</li>
          <li>Cualquier prueba de apoyo (números de ticket, logs de errores, capturas de pantalla) para las solicitudes de la Sección 3</li>
        </ul>
        <p>
          Las solicitudes de reembolso se revisan normalmente en un plazo de{' '}
          <strong>5 días hábiles</strong> desde su recepción.
          Te responderemos con una decisión y, si se aprueba, con una estimación del plazo de
          tramitación.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Tramitación y forma de pago">
        <p>
          Un reembolso aprobado se emite de una de estas dos formas: de vuelta al método de pago
          original o como crédito de cuenta. Te diremos cuál se aplica cuando aprobemos tu
          solicitud.
        </p>

        <LegalSubSection title="7.1 Reembolso al método de pago original">
          <p>
            Cuando un reembolso se devuelve a tu método de pago, va al{' '}
            <strong>método de pago original</strong> utilizado
            para la compra. No reembolsamos a una tarjeta o cuenta distinta de aquella a la que se
            cargó originalmente.
          </p>
          <p>
            Una vez que emitimos el reembolso, el tiempo de tramitación depende de tu proveedor de
            pago:
          </p>
          <ul>
            <li>Los reembolsos a tarjetas de crédito y débito suelen aparecer en <strong>5 a 10 días hábiles</strong>, según el emisor</li>
            <li>Los reembolsos por transferencia bancaria y ACH pueden tardar hasta 10 días hábiles</li>
            <li>Los reembolsos a través de cualquier otra plataforma de pago que aceptemos están sujetos al tiempo de tramitación de esa plataforma</li>
          </ul>
          <p>
            Si un reembolso no ha aparecido en tu extracto después de 15 días hábiles, escríbenos y
            lo investigaremos con el procesador de pagos.
          </p>
        </LegalSubSection>

        <LegalSubSection title="7.2 Reembolso como crédito de cuenta">
          <p>
            En su lugar podemos aprobar un reembolso como{' '}
            <strong>crédito de cuenta</strong>, añadido al saldo
            de tu cuenta de WSLATL. El crédito de cuenta se puede gastar en cualquier factura de
            WSLATL y no caduca, pero{' '}
            <strong>no se puede canjear por dinero</strong> y
            no se puede retirar a una cuenta bancaria ni a una tarjeta. Las condiciones completas
            están en nuestra página de{' '}
            <Link href={siteConfig.paths.accountCredit}>Crédito de cuenta</Link>.
          </p>
          <p>
            El crédito de cuenta es el resultado adecuado en situaciones como estas:
          </p>
          <ul>
            <li>Has pedido crédito en lugar de que te devolvamos el dinero, porque piensas seguir alojando con nosotros</li>
            <li>El método de pago original está cerrado, ha caducado o ya no puede aceptar una devolución</li>
            <li>El cargo original se liquidó con crédito de cuenta desde el principio</li>
            <li>El cargo es lo bastante antiguo como para que el procesador de pagos ya no lo revierta</li>
          </ul>
          <p>
            Cuando tienes derecho a un reembolso y has pedido que se te devuelva al método de pago,
            no te impondremos crédito como sustituto solo porque a nosotros nos resulte más cómodo.
            Si te proponemos crédito y prefieres que te devolvamos el dinero, dilo y lo hablamos.
          </p>
        </LegalSubSection>

        <LegalSubSection title="7.3 Los reembolsos no se prorratean">
          <p>
            Los reembolsos conforme a esta política se emiten{' '}
            <strong>solo por periodos de facturación completos</strong>. No
            calculamos un reembolso parcial en función del número de días que usaste el servicio
            antes de solicitarlo. Una solicitud admitida dentro de un plazo admisible se reembolsa
            íntegramente por el periodo en cuestión, y una solicitud fuera de esos plazos no se
            reembolsa en absoluto.
          </p>
          <p>
            Esto corta por los dos lados y es deliberado. No se te penaliza por los días que usaste
            dentro del plazo de reembolso y, del mismo modo, no puedes recuperar parte de un mes
            cancelando a mitad de un periodo. Como se indica en la Sección 9.1 de nuestras{' '}
            <Link href={siteConfig.paths.terms}>Condiciones del servicio</Link>,
            no se emite ningún reembolso por los días restantes de un periodo de facturación
            cancelado, salvo que se aplique esta política.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="8" title="Cancelación del servicio al reembolsar">
        <p>
          Cuando se aprueba un reembolso, el servicio asociado se cancela como parte del proceso de
          reembolso. El acceso al servicio y a los paneles asociados se revoca una vez tramitado el
          reembolso.
        </p>
        <p>
          Tras la cancelación se aplican las reglas de conservación de datos de la Sección 9.3 de
          nuestras Condiciones del servicio. Tus datos pueden recuperarse a petición durante un
          plazo limitado de hasta{' '}
          <strong>14 días</strong> después de la cancelación;
          pasado ese plazo, los datos que queden se eliminan de forma permanente e irreversible y,
          en todo caso, no más tarde de 90 días después del cierre de la cuenta. Si quieres intentar
          recuperar datos de un servicio reembolsado, debes pedirlo dentro de ese plazo de
          recuperación de 14 días.
        </p>
        <p>
          WSLATL no es responsable de ninguna pérdida de datos derivada de una cancelación iniciada
          por un reembolso.
        </p>
      </LegalSection>

      <LegalSection number="9" title="Renovaciones y facturación automática">
        <p>
          Los plazos de 14 días de esta política se miden desde la fecha de la compra inicial. En
          los servicios con ciclos de facturación recurrentes, cada pago de renovación abre un nuevo
          plazo de 14 días medido desde la fecha de esa renovación.
        </p>
        <p>
          Si no quieres que un servicio se renueve, debes cancelarlo antes de la fecha de
          renovación. No reembolsaremos un cargo renovado automáticamente solo porque se te olvidara
          cancelar. Ahora bien, si nos escribes dentro de los 14 días siguientes a una renovación
          inesperada, evaluaremos la solicitud conforme a la Sección 3 (Motivos admitidos) igual que
          cualquier otra compra.
        </p>
        <p>
          Enviamos recordatorios de factura antes de las renovaciones automáticas. Si estás
          recibiendo renovaciones que no pretendías, escríbenos de inmediato a{' '}
          <Email name="support" />{' '}
          y lo arreglamos.
        </p>
      </LegalSection>

      <LegalSection number="10" title="Protección frente al abuso y el fraude">
        <p>
          Esta Política de reembolsos existe para proteger a los clientes legítimos. Para evitar
          abusos, nos reservamos el derecho a rechazar solicitudes de reembolso cuando haya indicios
          de una conducta coordinada o repetida de búsqueda de reembolsos, incluidas, entre otras:
        </p>
        <ul>
          <li>Ciclos repetidos de alta, reembolso y nueva alta en las mismas cuentas o en cuentas relacionadas</li>
          <li>Solicitudes de reembolso coordinadas en varias cuentas con una titularidad común</li>
          <li>El uso de información falsa en la solicitud de alta o en las solicitudes de reembolso</li>
          <li>Las solicitudes de reembolso vinculadas a métodos de pago fraudulentos o a contracargos</li>
        </ul>
        <p>
          Si se deniega un reembolso conforme a esta sección, explicaremos el motivo por escrito. En
          los casos de abuso confirmado también puede producirse la cancelación de la cuenta.
        </p>
      </LegalSection>

      <LegalSection number="11" title="Cambios en esta política">
        <p>
          Podemos actualizar esta Política de reembolsos de vez en cuando para reflejar cambios en
          nuestras prácticas, en los requisitos legales o en nuestros servicios. Cuando hagamos
          cambios sustanciales:
        </p>
        <ul>
          <li>Actualizaremos la fecha de entrada en vigor que se muestra en la parte superior de esta página</li>
          <li>Avisaremos por correo electrónico a los clientes activos con un resumen de lo que ha cambiado</li>
          <li>Publicaremos la política actualizada en {siteConfig.paths.refund}</li>
        </ul>
        <p>
          Las solicitudes de reembolso presentadas antes de la fecha de entrada en vigor de un
          cambio se evaluarán conforme a la versión de la política vigente en el momento de la
          solicitud. Que sigas usando nuestros servicios después de la fecha de entrada en vigor de
          cualquier cambio constituye tu aceptación de la Política de reembolsos actualizada.
        </p>
      </LegalSection>

      <LegalSection number="12" title="Contacto">
        <p>
          Las preguntas sobre esta Política de reembolsos, el estado de una solicitud de reembolso o
          cualquier otra cosa relacionada con la facturación deben dirigirse a:
        </p>
        <CompanyContact />
      </LegalSection>
    </>
  )
}
