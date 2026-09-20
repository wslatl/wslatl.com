import { Link } from '@/components/legal/doc-link'
import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'
import { Callout, CompanyContact, InfoCard, InfoRow } from '@/components/legal/blocks'
import { Email } from '@/components/ui/email'

export default function DmcaContent() {
  return (
    <>
      <LegalSection number="1" title="Descripción general y alcance">
        <p>
          WSLATL LLC (&ldquo;WSLATL&rdquo;, &ldquo;nosotros&rdquo;, &ldquo;nuestro&rdquo; o
          &ldquo;nos&rdquo;) respeta los derechos de propiedad intelectual de terceros y espera que
          sus clientes hagan lo mismo. Esta Política DMCA explica cómo denunciar material alojado en
          la infraestructura de WSLATL que creas que infringe tus derechos de autor, cómo puede un
          cliente impugnar una retirada y cómo tratamos a los clientes que infringen de forma
          reiterada.
        </p>
        <p>
          Esta política está redactada para ajustarse a la Digital Millennium Copyright Act,
          17 U.S.C. &sect;&nbsp;512. Sustituye y amplía el resumen que antes figuraba en la
          Sección 8 de nuestras{' '}
          <Link href={siteConfig.paths.terms}>Condiciones del servicio</Link>,
          y se incorpora a esas Condiciones por referencia.
        </p>
        <p>
          WSLATL es un proveedor de hosting. En la mayoría de los casos no creamos, seleccionamos ni
          revisamos el material que los clientes almacenan en nuestra infraestructura. Actuamos ante
          las reclamaciones por derechos de autor que cumplen los requisitos que figuran abajo.
        </p>
      </LegalSection>

      <LegalSection number="2" title="Agente designado para derechos de autor">
        <p>
          Las notificaciones de presunta infracción deben enviarse a nuestro agente designado. Las
          notificaciones enviadas a otras direcciones, a miembros del personal o a nuestro servidor
          de Discord pueden retrasarse y puede que no se traten como notificación válida.
        </p>

        {/*
          Designated agent registration status.

          WSLATL acts as its own designated copyright agent; there is no separate named
          individual. The contact details below are the channel we monitor for copyright
          complaints.

          Note that the DMCA safe harbor under 17 U.S.C. 512(c)(2) requires the designated agent
          to be registered with the US Copyright Office through the DMCA Designated Agent
          Directory (dmca.copyright.gov), a paid filing renewed every three years. Publishing
          this page does NOT create the safe harbor on its own. Until that filing is completed and
          kept current, do not add any statement to this page claiming the agent is registered.
        */}
        <InfoCard title="Agente designado para derechos de autor">
          <InfoRow label="Agente">
            WSLATL Copyright Agent
          </InfoRow>
          <InfoRow label="Empresa">
            WSLATL LLC
          </InfoRow>
          <InfoRow label="Dirección postal">
            2414 County Road 1310, Moberly, MO 65270, United States
          </InfoRow>
          <InfoRow label="Teléfono">
            1-660-998-8016
          </InfoRow>
          <InfoRow label="Correo">
            <Email name="dmca" />
          </InfoRow>
          <InfoRow label="Asunto">
            DMCA Takedown Notice
          </InfoRow>
        </InfoCard>

        <Callout tone="caution" title="Estado del registro del agente">
          Los datos de contacto anteriores son el canal que vigilamos para las reclamaciones por
          derechos de autor. En esta página no afirmamos que se haya completado el registro de un
          agente designado ante la United States Copyright Office. Si necesitas confirmar el estado
          actual del registro antes de cursar una notificación, escríbenos a <Email name="support" /> y
          te lo diremos.
        </Callout>
      </LegalSection>

      <LegalSection number="3" title="Presentar una notificación de retirada">
        <p>
          Para ser eficaz conforme a 17 U.S.C. &sect;&nbsp;512(c)(3), una notificación de presunta
          infracción debe ser una comunicación escrita que incluya sustancialmente todos los seis
          elementos siguientes:
        </p>
        <ol>
          <li>
            Una firma física o electrónica de una persona autorizada para actuar en nombre del
            titular de un derecho exclusivo presuntamente infringido.
          </li>
          <li>
            La identificación de la obra protegida por derechos de autor que se alega infringida. Si
            una sola notificación cubre varias obras en un mismo sitio, una lista representativa de
            esas obras en ese sitio.
          </li>
          <li>
            La identificación del material que se alega infractor o que es objeto de actividad
            infractora, y la información razonablemente suficiente para permitirnos localizarlo. Una
            URL directa, una dirección IP y un puerto, una ruta de archivo o un identificador de
            servidor son la forma más útil.
          </li>
          <li>
            Información razonablemente suficiente para permitirnos ponernos en contacto contigo,
            incluidos tu nombre, tu dirección, tu número de teléfono y, si está disponible, una
            dirección de correo electrónico.
          </li>
          <li>
            Una declaración de que tienes la creencia de buena fe de que el uso del material en la
            forma denunciada no está autorizado por el titular de los derechos de autor, por su
            agente o por la ley.
          </li>
          <li>
            Una declaración de que la información de la notificación es exacta y, bajo pena de
            perjurio, de que estás autorizado para actuar en nombre del titular de un derecho
            exclusivo presuntamente infringido.
          </li>
        </ol>
        <p>
          Una notificación que no cumpla sustancialmente los seis elementos puede no tratarse como
          notificación válida. Si tu notificación está incompleta, te diremos qué falta siempre que
          razonablemente podamos.
        </p>

        <LegalSubSection title="3.1 Qué pasa después">
          <p>
            Al recibir una notificación conforme, responderemos con diligencia para retirar el
            material identificado o inhabilitar el acceso a él, y daremos los pasos razonables para
            avisar al cliente afectado de que el material se ha retirado o inhabilitado. Según el
            servicio, la retirada puede consistir en dar de baja un archivo concreto, inhabilitar
            una aplicación concreta o suspender el servicio afectado cuando el material no se pueda
            aislar.
          </p>
          <p>
            Enviamos al cliente afectado una copia de la notificación, incluida la información de
            contacto que contiene. No incluyas en una notificación información que no estés
            dispuesto a que se comparta con el cliente.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.2 Declaraciones falsas">
          <p>
            Conforme a 17 U.S.C. &sect;&nbsp;512(f), toda persona que a sabiendas tergiverse de
            forma sustancial que un material es infractor, o que un material se retiró o inhabilitó
            por error o por identificación errónea, puede responder por daños y perjuicios,
            incluidas las costas y los honorarios de abogados. Antes de presentarla, valora si el
            uso que denuncias puede estar autorizado por el titular de los derechos de autor, por
            una licencia o por la ley.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="4" title="Contranotificación">
        <p>
          Si eres cliente de WSLATL y se ha retirado o inhabilitado material tuyo, y crees que la
          retirada fue consecuencia de un error o de una identificación errónea, puedes presentar
          una contranotificación a nuestro agente designado en la dirección que figura en la
          Sección 2.
        </p>
        <p>
          Para ser eficaz conforme a 17 U.S.C. &sect;&nbsp;512(g)(3), una contranotificación debe
          ser una comunicación escrita que incluya sustancialmente todo lo siguiente:
        </p>
        <ol>
          <li>Tu firma física o electrónica.</li>
          <li>
            La identificación del material que se ha retirado o al que se ha inhabilitado el acceso,
            y el lugar en el que aparecía el material antes de que se retirara o se inhabilitara el
            acceso a él.
          </li>
          <li>
            Una declaración, bajo pena de perjurio, de que tienes la creencia de buena fe de que el
            material se retiró o inhabilitó como consecuencia de un error o de una identificación
            errónea del material.
          </li>
          <li>
            Tu nombre, tu dirección y tu número de teléfono, y una declaración de que aceptas la
            jurisdicción del Tribunal Federal de Distrito del distrito judicial en el que se
            encuentra tu dirección o, si tu dirección está fuera de Estados Unidos, de cualquier
            distrito judicial en el que se pueda localizar a WSLATL LLC, y de que aceptarás el
            emplazamiento de la persona que presentó la notificación original o de un agente de esa
            persona.
          </li>
        </ol>

        <LegalSubSection title="4.1 Plazos de restablecimiento">
          <p>
            Al recibir una contranotificación conforme, facilitaremos sin demora una copia a la
            persona que presentó la notificación de retirada original y le informaremos de que
            repondremos el material retirado o dejaremos de inhabilitar el acceso a él.
          </p>
          <p>
            Conforme a 17 U.S.C. &sect;&nbsp;512(g)(2)(C), repondremos el material retirado o
            restableceremos el acceso{' '}
            <strong>
              no menos de 10 ni más de 14 días hábiles
            </strong>{' '}
            después de recibir la contranotificación, salvo que nuestro agente designado reciba
            antes un aviso de la parte reclamante original de que ha presentado una acción judicial
            para obtener una orden que impida al cliente seguir realizando actividad infractora en
            relación con el material alojado en nuestra infraestructura.
          </p>
          <p>
            El restablecimiento está sujeto a que el servicio siga activo y en regla. No se puede
            restablecer material de un servicio que se ha cancelado o cuyos datos ya se han
            eliminado conforme a nuestras reglas de conservación, y una contranotificación no
            detiene la facturación, ni la suspensión por impago, ni ninguna medida de aplicación
            independiente adoptada conforme a nuestra{' '}
            <Link href={siteConfig.paths.acceptableUse}>Política de uso aceptable</Link>.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.2 Declaraciones falsas en la contranotificación">
          <p>
            Las sanciones de 17 U.S.C. &sect;&nbsp;512(f) se aplican tanto a las
            contranotificaciones como a las notificaciones de retirada. Presentar una
            contranotificación que a sabiendas tergiverse de forma sustancial que un material se
            retiró por error o por identificación errónea puede exponerte a responder por daños y
            perjuicios.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="5" title="Política sobre infractores reincidentes">
        <p>
          Según exige 17 U.S.C. &sect;&nbsp;512(i), WSLATL ha adoptado y aplica razonablemente una
          política que prevé la cancelación, en las circunstancias que corresponda, de las cuentas
          de los clientes que son infractores reincidentes.
        </p>
        <p>Cómo aplicamos esa política:</p>
        <ul>
          <li>
            <strong>Registramos todas las notificaciones.</strong> Cada
            notificación de retirada conforme sobre la que actuamos se anota en la cuenta del
            cliente responsable del servicio afectado.
          </li>
          <li>
            <strong>Avisamos al cliente.</strong> Se informa al
            cliente de la reclamación, de qué se retiró o inhabilitó y de que la reclamación se ha
            anotado en su cuenta.
          </li>
          <li>
            <strong>Las reclamaciones repetidas escalan.</strong>{' '}
            Las siguientes notificaciones conformes contra la misma cuenta dan lugar a medidas
            progresivas, que pueden incluir un aviso formal, la suspensión del servicio afectado y
            la cancelación de la cuenta.
          </li>
          <li>
            <strong>Las contranotificaciones que prosperan no cuentan.</strong>{' '}
            Una reclamación que se retira, o que se resuelve a favor del cliente mediante una
            contranotificación sin que después haya acción judicial, no se computa en la cuenta.
          </li>
          <li>
            <strong>Los casos graves son inmediatos.</strong>{' '}
            Cuando la infracción es flagrante, de escala comercial o va acompañada de otras
            vulneraciones de nuestra Política de uso aceptable, podemos cancelar una cuenta sin
            esperar a una notificación más.
          </li>
        </ul>

        {/*
          OWNER DECISION NEEDED: repeat-infringer threshold.

          Decide whether to publish a specific number of recorded, unresolved notices that
          triggers each escalation step (for example a defined warning step, a defined
          suspension step, and a defined termination step), or to keep the escalation
          discretionary as written above.

          A published number is easier to defend as "reasonably implemented" but binds you to
          apply it consistently. Do NOT publish a number here unless the billing panel actually
          tracks strikes per account and you intend to enforce it exactly as written.
        */}
        <p>
          La cancelación conforme a esta sección es una cancelación por causa justificada. Según se
          expone en nuestra{' '}
          <Link href={siteConfig.paths.refund}>Política de reembolsos</Link>,
          los servicios cancelados por vulnerar nuestras Condiciones o nuestra Política de uso
          aceptable no tienen derecho a reembolso.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Material que no controlamos">
        <p>
          WSLATL proporciona infraestructura. Cuando un cliente opera su propio servicio en esa
          infraestructura y controla lo que se almacena en ella, el responsable del material es el
          cliente. Cuando podemos identificar al cliente, le enviamos tu notificación y esperamos
          que actúe sobre ella.
        </p>
        <p>
          Para los servicios que no alojamos, incluidos los dominios registrados en otro sitio, el
          contenido servido por una red de terceros o las cuentas en plataformas que no operamos, no
          somos el destinatario correcto de tu notificación y no podemos retirar el material. Dirige
          tu notificación al operador de ese servicio.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Marcas y otras reclamaciones">
        <p>
          Esta política cubre únicamente los derechos de autor. Las reclamaciones por infracción de
          marca, difamación, vulneración de la privacidad u otro contenido ilícito deben enviarse
          a{' '}
          <Email name="support" />{' '}
          con una descripción clara del material, su ubicación y el fundamento jurídico de tu
          reclamación. Esas reclamaciones se tramitan conforme a nuestra{' '}
          <Link href={siteConfig.paths.acceptableUse}>Política de uso aceptable</Link>{' '}
          y no conforme a la DMCA.
        </p>
      </LegalSection>

      <LegalSection number="8" title="Cambios en esta política">
        <p>
          Podemos actualizar esta Política DMCA para reflejar cambios en nuestras prácticas o en la
          legislación aplicable. Cuando hagamos cambios sustanciales, actualizaremos la fecha de
          entrada en vigor en la parte superior de esta página y publicaremos la política
          actualizada en{' '}
          <Link href={siteConfig.paths.dmca}>
            {siteConfig.siteUrl}{siteConfig.paths.dmca}
          </Link>.
        </p>
      </LegalSection>

      <LegalSection number="9" title="Contacto">
        <p>
          Las notificaciones y contranotificaciones por derechos de autor deben ir al agente
          designado que figura en la Sección 2. Las preguntas generales sobre esta política pueden
          enviarse a:
        </p>
        <CompanyContact />
      </LegalSection>
    </>
  )
}
