import { Link } from '@/components/legal/doc-link'
import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'
import { UptimeTable } from '@/components/legal/uptime-table'
import { CompanyContact, InfoCard, InfoRow } from '@/components/legal/blocks'
import { Email } from '@/components/ui/email'

export default function TermsContent() {
  return (
    <>
      <LegalSection number="1" title="Aceptación de las condiciones">
        <p>
          Al solicitar, registrarte, acceder o usar cualquier servicio prestado por WSLATL LLC
          (&ldquo;WSLATL&rdquo;, &ldquo;nosotros&rdquo;, &ldquo;nuestro&rdquo; o
          &ldquo;nos&rdquo;), tú (&ldquo;Cliente&rdquo;, &ldquo;tú&rdquo; o &ldquo;tu&rdquo;)
          confirmas que:
        </p>
        <ul>
          <li>
            Cumples nuestros requisitos de edad: o bien (a) tienes 18 años o más, o bien (b) tienes
            entre 13 y 17 años y has obtenido el consentimiento expreso de un padre, una madre o un
            tutor legal que ha revisado y acepta estas Condiciones en tu nombre. Las personas
            menores de 13 años tienen terminantemente prohibido usar cualquier servicio de WSLATL y
            serán bloqueadas de forma permanente en cuanto se detecten.
          </li>
          <li>Tienes plena capacidad legal para celebrar un contrato vinculante</li>
          <li>Has leído y entendido estas Condiciones del servicio, nuestra Política de privacidad y nuestra Política de uso aceptable, y aceptas quedar obligado por ellas</li>
          <li>Si aceptas en nombre de una empresa u otra entidad jurídica, tienes autoridad para obligar a esa entidad a estas condiciones</li>
        </ul>
        <p>
          Si no aceptas estas condiciones, no uses nuestros servicios. Estas Condiciones, junto con
          nuestra Política de privacidad y nuestra Política de uso aceptable, forman el acuerdo completo entre tú y WSLATL LLC.
        </p>
      </LegalSection>

      <LegalSection number="2" title="Descripción de los servicios">
        <p>
          WSLATL LLC presta servicios de hosting privados, por solicitud, a clientes aprobados.
          Nuestros servicios incluyen, entre otros:
        </p>
        <ul>
          <li><strong>Servidores dedicados:</strong> Hardware de servidor físico aprovisionado en exclusiva para un solo cliente, disponible gestionado o sin gestionar</li>
          <li><strong>Hosting de servidores de juego:</strong> Servidores de juego gestionados a través del panel Pterodactyl, compatibles con títulos como Minecraft, Rust, CS2, ARK, Valheim, FiveM y otros</li>
          <li><strong>Hosting VPS:</strong> Servidores privados virtuales aislados con acceso root completo y el sistema operativo que elijas</li>
          <li><strong>Hosting web:</strong> Hosting gestionado para sitios web y aplicaciones web, con SSL, copias de seguridad y soporte</li>
        </ul>
        <p>
          Los servicios están sujetos a disponibilidad y pueden modificarse, ampliarse o
          descontinuarse a nuestra discreción, avisando razonablemente a los clientes afectados.
        </p>

        <LegalSubSection title="2.1 Copias de seguridad y responsabilidad sobre tus datos">
          <p>
            Cuando un servicio incluye copias de seguridad, esas copias se proporcionan{' '}
            <strong>en la medida de lo posible</strong> y son una
            comodidad, no una garantía. No garantizamos que exista una copia de seguridad de un
            servicio concreto en un momento concreto, que una copia esté completa o se pueda
            restaurar, ni que una restauración vaya a funcionar.
          </p>
          <p>
            <strong>
              Eres responsable de mantener tus propias copias de seguridad independientes
            </strong>{' '}
            de cualquier dato que no puedas permitirte perder, guardadas en un sitio distinto del
            servicio de WSLATL que lo generó. Ninguna copia de seguridad que proporcionemos sustituye
            a tus propias copias. Este reparto de responsabilidades es una parte sustancial del
            precio de nuestros servicios y debe leerse junto con la Sección 10 (Exención de
            garantías) y la Sección 11 (Limitación de responsabilidad).
          </p>
          <p>
            Lo que va incluido con cada plan, cómo se solicitan las restauraciones y qué implica una
            restauración se exponen en nuestra{' '}
            <Link href={siteConfig.paths.backups}>Política de copias de seguridad</Link>{' '}
            en{' '}
            <Link href={siteConfig.paths.backups}>
              {siteConfig.siteUrl}{siteConfig.paths.backups}
            </Link>, que se incorpora a estas Condiciones por referencia.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="3" title="Solicitud y registro de la cuenta">
        <p>
          WSLATL funciona como una empresa de hosting privada, solo por solicitud. El acceso a
          nuestros servicios no es automático y requiere la revisión y la aprobación de nuestro
          equipo. Se aplican las siguientes condiciones:
        </p>
        <ul>
          <li>Debes enviar una solicitud a través de nuestro portal de facturación en billing.wslatl.com y recibir una aprobación expresa antes de que se aprovisione ningún servicio</li>
          <li>Nos reservamos el derecho a rechazar cualquier solicitud a nuestra entera discreción, sin obligación de dar un motivo</li>
          <li>Debes facilitar información exacta, actual y completa durante el registro, y mantenerla al día</li>
          <li>Eres el único responsable de mantener la seguridad de las credenciales de tu cuenta, incluidas tu contraseña y cualquier clave de API</li>
          <li>Se permite una cuenta por persona o entidad empresarial, salvo que hayamos autorizado expresamente por escrito cuentas adicionales</li>
          <li>Debes avisarnos de inmediato a <Email name="support" /> si sospechas que ha habido un acceso no autorizado a tu cuenta</li>
          <li>Está prohibido compartir las credenciales de tu cuenta con terceros, salvo permiso expreso por escrito</li>
        </ul>
      </LegalSection>

      <LegalSection number="4" title="Condiciones de pago">

        <LegalSubSection title="4.1 Ciclos de facturación">
          <p>
            Los servicios se facturan por adelantado con el ciclo que elijas al darte de alta. Los
            intervalos de facturación disponibles (mensual, trimestral, semestral o anual) dependen
            del tipo de servicio. Las facturas se generan automáticamente y se envían a tu dirección
            de correo electrónico registrada antes de la fecha de vencimiento.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.2 Métodos de pago y tramitación">
          <p>
            El pago debe hacerse a través de nuestro portal de facturación en billing.wslatl.com.
            Los métodos de pago aceptados figuran en el portal. Los pagos los tramitan procesadores
            de pago de terceros. Al facilitar información de pago, nos autorizas a cobrar todas las
            cuotas debidas al método de pago que hayas elegido.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.3 Pagos atrasados y suspensión del servicio">
          <p>
            Los servicios se consideran vencidos si el pago no se recibe en la fecha de vencimiento
            de la factura. A las cuentas en mora se les aplica lo siguiente:
          </p>
          <ul>
            <li>Los servicios pueden suspenderse si el pago no se recibe en un plazo de <strong>7 días</strong> desde la fecha de vencimiento</li>
            <li>Los servicios suspendidos pueden cancelarse y sus datos eliminarse de forma permanente si el pago no se recibe en un plazo de <strong>14 días</strong> desde la suspensión</li>
            <li>WSLATL no es responsable de la pérdida de datos, de la interrupción del negocio ni de ningún otro daño derivado de la suspensión o la cancelación del servicio por impago</li>
            <li>Puede aplicarse una cuota de reactivación a los servicios que hayan estado suspendidos por impago</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="4.4 Política de reembolsos">
          <p>
            Nuestra política de reembolsos se mantiene como documento independiente en{' '}
            <Link href={siteConfig.paths.refund}>{siteConfig.siteUrl}{siteConfig.paths.refund}</Link>{' '}
            y se incorpora a estas Condiciones por referencia. La Política de reembolsos es la
            fuente de referencia para todas las cuestiones sobre la admisibilidad de los reembolsos,
            los plazos, los motivos admitidos, la tramitación y los conceptos no reembolsables. Las
            reglas de la Política de reembolsos prevalecen sobre cualquier texto contradictorio en
            otra parte de estas Condiciones.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.5 Cambios de precio">
          <p>
            WSLATL se reserva el derecho a cambiar los precios de los servicios. Avisaremos de
            cualquier subida de precio con al menos{' '}
            <strong>30 días de antelación y por escrito</strong>, por
            correo electrónico a tu dirección registrada. Los servicios existentes se mantendrán al
            precio actual hasta la primera fecha de renovación posterior a ese plazo de preaviso.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.6 Impuestos">
          <p>
            Las cuotas de los servicios no incluyen los impuestos aplicables. Eres responsable de
            pagar todos los impuestos, aranceles o cargas impuestas por las administraciones
            públicas que se apliquen a tu uso de nuestros servicios, salvo que se incluyan
            específicamente en tu factura.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="5" title="Acuerdo de Nivel de Servicio (SLA)">
        <p>
          Nuestro Acuerdo de Nivel de Servicio también se publica como documento independiente en{' '}
          <Link href={siteConfig.paths.sla}>
            {siteConfig.siteUrl}{siteConfig.paths.sla}
          </Link>, que es más fácil de encontrar y de citar. Esa página repite esta sección; no le
          añade nada ni la cambia. Los compromisos que figuran abajo se reproducen allí en su
          totalidad y, si alguna vez difieren, prevalece esta sección.
        </p>

        <LegalSubSection title="5.1 Objetivos de disponibilidad">
          <UptimeTable />
          <p>
            La disponibilidad se mide por mes natural y excluye las ventanas de mantenimiento
            programado y el tiempo de inactividad causado por hechos ajenos a nuestro control
            razonable (véase la Sección 15, Fuerza mayor).
          </p>
        </LegalSubSection>

        <LegalSubSection title="5.2 Mantenimiento programado">
          <p>
            Avisaremos de las ventanas de mantenimiento programado con al menos <strong>24 horas de antelación</strong> a
            través de nuestra página de estado (status.wslatl.com) y/o por correo electrónico a los
            clientes afectados. El mantenimiento de emergencia necesario para proteger la integridad
            o la seguridad del servicio puede realizarse sin aviso previo, aunque lo comunicaremos
            lo antes posible.
          </p>
        </LegalSubSection>

        <LegalSubSection title="5.3 Créditos del SLA">
          <p>
            Si no cumplimos el objetivo de disponibilidad aplicable por causa imputable a nosotros,
            puedes solicitar un crédito de servicio equivalente al <strong>10% del coste mensual del servicio afectado</strong> por
            cada incidente admisible. Los créditos se aplican al saldo de tu cuenta y no superarán
            el coste de un mes completo del servicio afectado. Los créditos de servicio son tu único
            y exclusivo recurso ante los incumplimientos de disponibilidad y no te dan derecho a un
            reembolso en efectivo.
          </p>
          <p>
            Para solicitar un crédito, escríbenos en un plazo de 15 días desde el incidente a <Email name="support" /> con
            la fecha, la duración y la naturaleza de la interrupción.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="6" title="Uso aceptable">
        <p>
          Todo uso de los servicios de WSLATL se rige por nuestra Política de uso aceptable (AUP),
          que se incorpora a estas Condiciones por referencia y está disponible en{' '}
          <Link href={siteConfig.paths.acceptableUse}>{siteConfig.siteUrl}{siteConfig.paths.acceptableUse}</Link>.
          Aceptas cumplir la AUP en todo momento.
        </p>
        <p>
          Las infracciones de la AUP pueden dar lugar a la suspensión o cancelación inmediata de tus
          servicios sin aviso y sin derecho alguno a reembolso. Las infracciones graves pueden
          remitirse a las fuerzas del orden.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Propiedad intelectual">
        <p>
          Todo el software, las herramientas, la documentación y los materiales desarrollados y
          proporcionados por WSLATL (excluido el software de terceros, como Pterodactyl, que está
          sujeto a su propia licencia) son y siguen siendo propiedad intelectual de WSLATL LLC. No
          puedes reproducir, distribuir, aplicar ingeniería inversa ni crear obras derivadas de
          nuestros materiales propios sin nuestro consentimiento previo por escrito.
        </p>
        <p>
          Conservas la plena propiedad de todos los datos, el contenido y el software que subas a la
          infraestructura de WSLATL o ejecutes en ella. Concedes a WSLATL una licencia limitada, no
          exclusiva e intransferible para almacenar, tratar y transmitir tu contenido únicamente en
          la medida necesaria para prestar los servicios que has contratado.
        </p>
      </LegalSection>

      <LegalSection number="8" title="DMCA y derechos de autor">
        <p>
          WSLATL LLC cumple la Digital Millennium Copyright Act (DMCA), 17 U.S.C. &sect;&nbsp;512.
          Nuestra Política DMCA completa se publica en{' '}
          <Link href={siteConfig.paths.dmca}>
            {siteConfig.siteUrl}{siteConfig.paths.dmca}
          </Link>{' '}
          y se incorpora a estas Condiciones por referencia. Expone nuestro agente designado, el
          proceso de contranotificación, el plazo legal de restablecimiento y nuestra política sobre
          infractores reincidentes. Léela antes de cursarnos una notificación o de impugnar una
          retirada.
        </p>
        <p>
          En resumen: si crees que un contenido alojado en la infraestructura de WSLATL infringe tus
          derechos de autor, envía una notificación de retirada DMCA por escrito a:
        </p>
        <InfoCard>
          <InfoRow label="Correo">
            <Email name="dmca" />
          </InfoRow>
          <InfoRow label="Asunto">
            DMCA Takedown Notice
          </InfoRow>
        </InfoCard>
        <p>Tu notificación debe incluir, bajo pena de perjurio:</p>
        <ul>
          <li>Tus datos de contacto (nombre, dirección, número de teléfono, correo electrónico)</li>
          <li>Una descripción de la obra protegida por derechos de autor que alegas que se ha infringido</li>
          <li>La identificación del material presuntamente infractor y su ubicación en nuestra infraestructura</li>
          <li>Una declaración de que tienes la creencia de buena fe de que el uso en cuestión no está autorizado por el titular de los derechos de autor, por su agente o por la ley</li>
          <li>Una declaración de que la información de la notificación es exacta y, bajo pena de perjurio, de que eres el titular de los derechos de autor o estás autorizado para actuar en su nombre</li>
          <li>Tu firma física o electrónica</li>
        </ul>
        <p>
          Las contranotificaciones pueden enviarse a la misma dirección de correo electrónico y
          deben cumplir los requisitos expuestos en la Sección 4 de nuestra{' '}
          <Link href={siteConfig.paths.dmca}>Política DMCA</Link>.
          Nos reservamos el derecho a cancelar las cuentas de los clientes que sean infractores
          reincidentes de derechos de autor, conforme a la política sobre infractores reincidentes
          de la Sección 5 de ese documento.
        </p>
      </LegalSection>

      <LegalSection number="9" title="Cancelación">

        <LegalSubSection title="9.1 Cancelación por tu parte">
          <p>
            Puedes cancelar tu servicio en cualquier momento enviando una solicitud de cancelación a
            través de nuestro portal de facturación o escribiéndonos por Discord o por correo
            electrónico. Las cancelaciones surten efecto al final del ciclo de facturación en curso,
            salvo que se pida expresamente una cancelación inmediata. No se emite ningún reembolso
            por los días restantes de un periodo de facturación cancelado, salvo que se aplique
            nuestra política de reembolsos (véase la Sección 4.4).
          </p>
        </LegalSubSection>

        <LegalSubSection title="9.2 Cancelación por parte de WSLATL">
          <p>
            Podemos suspender o cancelar tus servicios de inmediato y sin aviso previo si:
          </p>
          <ul>
            <li>Infringes estas Condiciones, la Política de uso aceptable o nuestra Política de privacidad</li>
            <li>Tienes facturas impagadas pendientes una vez pasado el periodo de gracia (véase la Sección 4.3)</li>
            <li>Tus actividades suponen un riesgo activo para nuestra infraestructura de red, para otros clientes o para terceros en internet</li>
            <li>Recibimos una orden legal válida que exige la cancelación o la suspensión</li>
            <li>Seguir prestando los servicios expondría a WSLATL LLC a responsabilidad legal</li>
            <li>Facilitas información falsa o fraudulenta en cualquier momento del ciclo de vida de tu cuenta</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="9.3 Efectos de la cancelación">
          <p>
            Al cancelarse tu cuenta:
          </p>
          <ul>
            <li>El acceso a todos los servicios y paneles se revocará de inmediato</li>
            <li>Tus datos pueden recuperarse a petición durante un plazo limitado de hasta 14 días después de la cancelación; pasado ese plazo, los datos que queden se eliminan de forma permanente e irreversible y, en todo caso, no más tarde de 90 días después del cierre de la cuenta, en coherencia con la tabla de conservación de nuestra Política de privacidad</li>
            <li>Las solicitudes de recuperación de datos deben hacerse dentro del plazo de recuperación de 14 días y quedan sujetas a nuestra discreción</li>
            <li>WSLATL no es responsable de ninguna pérdida de datos derivada de la cancelación de la cuenta</li>
            <li>Todas las facturas pendientes siguen siendo exigibles y pagaderas tras la cancelación</li>
          </ul>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="10" title="Exención de garantías">
        <p>
          LOS SERVICIOS SE PRESTAN &ldquo;TAL CUAL&rdquo; Y &ldquo;SEGÚN DISPONIBILIDAD&rdquo;, SIN
          GARANTÍA DE NINGÚN TIPO, NI EXPRESA NI IMPLÍCITA. EN LA MÁXIMA MEDIDA PERMITIDA POR LA
          LEGISLACIÓN APLICABLE, WSLATL LLC RECHAZA EXPRESAMENTE TODAS LAS GARANTÍAS, INCLUIDAS,
          ENTRE OTRAS:
        </p>
        <ul className="uppercase">
          <li>Garantías implícitas de comerciabilidad e idoneidad para un fin determinado</li>
          <li>Garantías de no infracción</li>
          <li>Garantías de que los servicios serán ininterrumpidos, estarán libres de errores o carecerán de componentes dañinos</li>
          <li>Garantías de que los defectos se corregirán en un plazo concreto</li>
          <li>Garantías sobre la exactitud o la integridad de cualquier contenido</li>
        </ul>
        <p>
          Algunas jurisdicciones no permiten la exclusión de determinadas garantías. En esas
          jurisdicciones, nuestras exenciones se aplican en la máxima medida permitida por la ley.
        </p>
      </LegalSection>

      <LegalSection number="11" title="Limitación de responsabilidad">
        <p>
          EN LA MÁXIMA MEDIDA PERMITIDA POR LA LEGISLACIÓN APLICABLE, WSLATL LLC Y SUS SOCIOS,
          ADMINISTRADORES, DIRECTIVOS, EMPLEADOS, CONTRATISTAS Y AGENTES NO SERÁN RESPONSABLES DE:
        </p>
        <ul className="uppercase">
          <li>Daños indirectos, incidentales, especiales, consecuentes o punitivos</li>
          <li>Pérdida de beneficios, de ingresos, de datos, de fondo de comercio o de oportunidades de negocio</li>
          <li>Daños derivados del acceso no autorizado a tus datos o de su alteración</li>
          <li>Daños derivados de que te apoyes en información obtenida a través de nuestros servicios</li>
          <li>Daños causados por hechos ajenos a nuestro control razonable</li>
        </ul>
        <p>
          NUESTRA RESPONSABILIDAD TOTAL ACUMULADA FRENTE A TI POR TODAS LAS RECLAMACIONES DERIVADAS
          DE ESTAS CONDICIONES O DE TU USO DE NUESTROS SERVICIOS, O RELACIONADAS CON ELLOS, NO
          SUPERARÁ EL IMPORTE TOTAL QUE HAYAS PAGADO A WSLATL LLC EN LOS <strong>TRES (3) MESES</strong> INMEDIATAMENTE
          ANTERIORES AL HECHO QUE DIO ORIGEN A LA RECLAMACIÓN.
        </p>
        <p>
          Algunas jurisdicciones no permiten determinadas limitaciones de responsabilidad. En esas
          jurisdicciones, nuestra responsabilidad se limita en la máxima medida permitida por la ley.
        </p>
      </LegalSection>

      <LegalSection number="12" title="Indemnización">
        <p>
          Aceptas indemnizar, defender y mantener indemnes a WSLATL LLC, a sus socios,
          administradores, directivos, empleados, contratistas y agentes frente a cualesquiera
          reclamaciones, responsabilidades, daños, pérdidas, costes y gastos (incluidos los
          honorarios razonables de abogados) derivados de lo siguiente o relacionados con ello:
        </p>
        <ul>
          <li>Tu uso de nuestros servicios infringiendo estas Condiciones, la AUP o la legislación aplicable</li>
          <li>El contenido que alojes, transmitas o almacenes en la infraestructura de WSLATL</li>
          <li>Tu vulneración de derechos de terceros, incluidos los derechos de propiedad intelectual</li>
          <li>Cualquier información falsa o fraudulenta que facilites a WSLATL</li>
          <li>Cualquier disputa entre tú y un tercero derivada de tu uso de nuestros servicios</li>
        </ul>
        <p>
          WSLATL se reserva el derecho a asumir la defensa y el control exclusivos de cualquier
          asunto sujeto a indemnización por tu parte, a tu costa, y aceptas cooperar con nuestra
          defensa.
        </p>
      </LegalSection>

      <LegalSection number="13" title="Legislación aplicable y resolución de disputas">
        <p>
          Estas Condiciones del servicio se rigen e interpretan conforme a las leyes del Estado de
          Missouri, Estados Unidos, sin atender a los principios sobre conflicto de leyes.
        </p>
        <p>
          Cualquier disputa legal, reclamación o controversia derivada de estas Condiciones o de tu
          uso de los servicios de WSLATL, o relacionada con ellos, se resolverá exclusivamente ante
          los tribunales estatales o federales situados en el Estado de Missouri. Aceptas la
          jurisdicción personal de esos tribunales y renuncias a cualquier objeción sobre el fuero
          en Missouri.
        </p>
        <p>
          Antes de iniciar un procedimiento legal formal, ambas partes se comprometen a intentar
          resolver las disputas de forma amistosa. Para iniciar la resolución amistosa, escríbenos a <Email name="support" />{' '}
          con una descripción escrita de la disputa. Si la disputa no se resuelve en un plazo de{' '}
          <strong>30 días</strong> desde ese aviso, cualquiera de
          las partes puede ejercer acciones legales formales.
        </p>
      </LegalSection>

      <LegalSection number="14" title="Modificación de las condiciones">
        <p>
          WSLATL se reserva el derecho a modificar estas Condiciones en cualquier momento. En el
          caso de cambios sustanciales:
        </p>
        <ul>
          <li>Avisaremos con al menos <strong>14 días de antelación</strong> por correo electrónico a tu dirección registrada</li>
          <li>Publicaremos las Condiciones actualizadas en {siteConfig.paths.terms} con una nueva fecha de entrada en vigor</li>
          <li>Resumiremos los cambios en el correo de aviso</li>
        </ul>
        <p>
          Que sigas usando nuestros servicios después de la fecha de entrada en vigor de unas
          Condiciones revisadas constituye tu aceptación de esos cambios. Si te opones a cambios
          sustanciales, puedes cancelar tu servicio antes de la fecha de entrada en vigor y recibir
          un reembolso prorrateado de cualquier periodo prepagado, a nuestra discreción.
        </p>
      </LegalSection>

      <LegalSection number="15" title="Disposiciones varias">

        <LegalSubSection title="Fuerza mayor">
          <p>
            WSLATL no es responsable de los retrasos o los incumplimientos en la prestación
            derivados de causas ajenas a nuestro control razonable, incluidos los desastres
            naturales, los casos fortuitos, las actuaciones de las administraciones públicas, los
            fallos de la infraestructura de internet, las caídas de centros de datos causadas por
            terceros, los conflictos laborales u otros acontecimientos extraordinarios. Haremos
            esfuerzos razonables por avisar a los clientes afectados y restablecer el servicio lo
            antes posible.
          </p>
        </LegalSubSection>

        <LegalSubSection title="Acuerdo íntegro">
          <p>
            Estas Condiciones del servicio, junto con nuestra Política de privacidad y nuestra
            Política de uso aceptable, constituyen el acuerdo íntegro entre tú y WSLATL LLC respecto
            de tu uso de nuestros servicios y sustituyen a todos los acuerdos, las manifestaciones o
            los entendimientos anteriores.
          </p>
        </LegalSubSection>

        <LegalSubSection title="Divisibilidad">
          <p>
            Si un tribunal competente declara que alguna disposición de estas Condiciones es
            inválida, ilegal o inexigible, esa disposición se modificará en la medida mínima
            necesaria para hacerla exigible, y el resto de las disposiciones seguirán en pleno vigor
            y efecto.
          </p>
        </LegalSubSection>

        <LegalSubSection title="Renuncia">
          <p>
            Que no hagamos valer un derecho o una disposición de estas Condiciones en alguna ocasión
            no constituye una renuncia a ese derecho o a esa disposición. Toda renuncia debe constar
            por escrito y estar firmada por un representante autorizado de WSLATL LLC.
          </p>
        </LegalSubSection>

        <LegalSubSection title="Cesión">
          <p>
            No puedes ceder ni transferir estas Condiciones, ni ningún derecho u obligación
            derivados de ellas, sin nuestro consentimiento previo por escrito. WSLATL puede ceder o
            transferir estas Condiciones, en todo o en parte, en relación con una fusión, una
            adquisición o la venta de la práctica totalidad de sus activos, avisándote de ello.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="16" title="Contacto">
        <p>
          Las preguntas sobre estas Condiciones del servicio deben dirigirse a:
        </p>
        <CompanyContact />
      </LegalSection>
    </>
  )
}
