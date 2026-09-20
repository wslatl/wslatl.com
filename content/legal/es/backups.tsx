import { Link } from '@/components/legal/doc-link'
import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'
import { Callout, CompanyContact, ScrollTable } from '@/components/legal/blocks'
import { Email } from '@/components/ui/email'
import { ShortLink } from '@/components/ui/short-link'

export default function BackupsContent() {
  return (
    <>
      <LegalSection number="1" title="Descripción general y alcance">
        <p>
          Esta Política de copias de seguridad explica qué copias de seguridad hace WSLATL LLC
          (&ldquo;WSLATL&rdquo;, &ldquo;nosotros&rdquo;, &ldquo;nuestro&rdquo; o &ldquo;nos&rdquo;),
          qué son y qué no son esas copias, quién es responsable de tus datos y cómo pedir una
          restauración.
        </p>
        <p>
          Se incorpora por referencia a nuestras{' '}
          <Link href={siteConfig.paths.terms}>Condiciones del servicio</Link>{' '}
          y debe leerse junto con la Sección 2 (Descripción de los servicios), la Sección 9.3
          (Efectos de la cancelación) y la Sección 11 (Limitación de responsabilidad).
        </p>
        <p>
          Esta política existe como documento propio, y no como una cláusula de las Condiciones, por
          una razón práctica: lo que va incluido con cada plan cambia a medida que cambian nuestros
          planes, y un cambio de plan no debería obligar a revisar las Condiciones del servicio ni
          al plazo de preaviso que ello conlleva. El reparto de responsabilidades que figura abajo
          no cambia; lo único que cambia es el detalle de cada plan.
        </p>
      </LegalSection>

      <LegalSection number="2" title="La versión corta">
        <Callout tone="critical" title="Guarda tus propias copias de seguridad">
          Cualquier copia de seguridad que proporcionemos es una comodidad, no una garantía. Se
          hace en la medida de lo posible y no sustituye a tus propias copias independientes de tus
          datos. Si tus datos te importan, debes mantener tus propias copias de seguridad,
          guardadas en un sitio distinto del servicio del que proceden. No cuentes con nosotros
          como tu única copia.
        </Callout>
        <p>
          Hacemos copias de seguridad porque son útiles y porque nos ayudan a ayudarte. Nos las
          tomamos en serio. Pero las copias de seguridad pueden fallar, pueden estar incompletas,
          pueden estar corruptas y pueden no estar disponibles justo en el momento en que más las
          necesitas. Cualquier proveedor de hosting que te diga lo contrario está prometiendo de
          más. El resto de esta página expone con honestidad qué es lo que recibes.
        </p>
      </LegalSection>

      <LegalSection number="3" title="Qué está incluido">
        <p>
          De qué se hace copia de seguridad, con qué frecuencia se toma y cuánto tiempo se conserva
          depende del servicio y del plan. La tabla siguiente resume qué está incluido en cada
          servicio. Los plazos exactos de conservación de tu servicio concreto aparecen en tu portal
          de facturación, y siempre puedes confirmarlos con nuestro equipo.
        </p>

        <ScrollTable label="Copias de seguridad por servicio">
          <table className="legal-table">
            <thead>
              <tr>
                <th scope="col">Servicio</th>
                <th scope="col">Copias de seguridad incluidas</th>
                <th scope="col">Qué se captura</th>
                <th scope="col">Frecuencia</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium text-foreground">Servidores dedicados</td>
                <td>No incluidas (autogestionado)</td>
                <td>No aplicable</td>
                <td>No aplicable</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Hosting de servidores de juego</td>
                <td>Incluidas</td>
                <td>El contenedor completo del servidor</td>
                <td>Mensual</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Hosting VPS</td>
                <td>Incluidas <span className="text-muted-foreground">(próximamente)</span></td>
                <td>La imagen completa del disco</td>
                <td>Mensual</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Hosting web</td>
                <td>Incluidas</td>
                <td>El sitio web y su estado</td>
                <td>Mensual</td>
              </tr>
            </tbody>
          </table>
        </ScrollTable>

        <p>Algunas precisiones detrás de la tabla:</p>
        <ul>
          <li>
            <strong>Servidores dedicados.</strong> Un servidor
            dedicado es tu máquina. Tienes control total del sistema operativo y de todo lo que hay
            en él, y no hacemos copias de seguridad de él por ti. Ejecutar y guardar las copias de
            seguridad de un servidor dedicado es responsabilidad tuya. Con mucho gusto hablamos de
            un acuerdo de copias de seguridad gestionadas si lo pides.
          </li>
          <li>
            <strong>Hosting de servidores de juego.</strong> Hacemos
            una copia de seguridad del contenedor completo del servidor de juego con un ciclo
            mensual.
          </li>
          <li>
            <strong>Hosting VPS.</strong> El hosting VPS se
            lanzará próximamente. Cuando esté en marcha, haremos una copia de seguridad mensual de
            la imagen completa del disco de cada VPS. Hasta entonces, esta fila describe lo que está
            previsto, no algo que ya esté funcionando.
          </li>
          <li>
            <strong>Hosting web.</strong> Hacemos una copia de
            seguridad mensual del sitio web en sí y de su estado actual (sus archivos y sus datos),
            no de toda la cuenta de hosting que lo rodea.
          </li>
        </ul>
        <p>
          Cuando una copia de seguridad se describe como mensual, se toma con un ciclo
          aproximadamente mensual, no en una fecha garantizada del calendario. Como se expone en la
          Sección 4, todas las copias de seguridad que hacemos se hacen en la medida de lo posible y
          no sustituyen a las copias independientes que guardas tú.
        </p>
      </LegalSection>

      <LegalSection number="4" title="Las copias de seguridad se hacen en la medida de lo posible">
        <p>
          Cuando las copias de seguridad están incluidas con tu servicio, las proporcionamos en la
          medida de lo posible. No garantizamos que:
        </p>
        <ul>
          <li>Exista una copia de seguridad de un servicio concreto en un momento concreto</li>
          <li>Una copia de seguridad tomada esté completa, no esté corrupta o se pueda restaurar</li>
          <li>Una restauración vaya a funcionar, o vaya a funcionar en un plazo concreto</li>
          <li>Los datos recuperados de una copia de seguridad estén actualizados a un momento concreto</li>
          <li>Una copia de seguridad sobreviva a la pérdida de la infraestructura subyacente</li>
        </ul>
        <p>
          Esto es coherente con las exenciones de garantías de la Sección 10 y con la
          limitación de responsabilidad de la Sección 11 de nuestras Condiciones del servicio. Nada
          de lo que dice esta política crea una garantía que esas secciones excluyan.
        </p>

        <LegalSubSection title="4.1 Cosas de las que una copia de seguridad no te protege">
          <p>
            Una copia de seguridad es una copia de tus datos tomada en un momento dado. No te
            protege de todo y, en particular, no protege frente a:
          </p>
          <ul>
            <li>
              Un daño del que se hace copia de seguridad a su vez, como una base de datos corrupta
              o un despliegue defectuoso que quedó capturado antes de que notaras el problema
            </li>
            <li>
              Un borrado que cae entre dos copias de seguridad, es decir, todo el trabajo hecho
              desde que se ejecutó la última copia
            </li>
            <li>
              La pérdida de un servicio que se ha cancelado, cuando los datos ya se han eliminado
              conforme a la Sección 9.3 de las Condiciones del servicio
            </li>
          </ul>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="5" title="Tus responsabilidades">
        <p>
          Eres responsable de los datos que almacenas en nuestra infraestructura. En concreto,
          aceptas que:
        </p>
        <ul>
          <li>
            <strong>Mantienes tus propias copias de seguridad.</strong>{' '}
            Eres responsable de guardar copias actualizadas e independientes de cualquier dato que
            no puedas permitirte perder, almacenadas fuera del servicio de WSLATL que lo generó.
          </li>
          <li>
            <strong>Compruebas que tus copias de seguridad funcionan.</strong>{' '}
            Una copia de seguridad desde la que nunca has restaurado es una hipótesis, no una copia
            de seguridad. Prueba las tuyas.
          </li>
          <li>
            <strong>Haces una copia antes de los cambios arriesgados.</strong>{' '}
            Antes de reinstalar el sistema operativo, cambiar de plan, hacer una migración, cancelar
            un servicio o cualquier otra operación que pueda destruir datos, haz tu propia copia
            primero. No podremos deshacer una acción destructiva que nos hayas pedido.
          </li>
          <li>
            <strong>Exportas antes de irte.</strong> Si
            cancelas un servicio o dejas que caduque, exporta tus datos antes de que la cancelación
            surta efecto. La conservación posterior a la cancelación es limitada y se describe en la
            Sección 9.3 de las Condiciones del servicio.
          </li>
          <li>
            <strong>Mantienes a salvo los datos de tus propios usuarios.</strong>{' '}
            Si otras personas dependen del servicio que tú ejecutas en nuestra infraestructura, sus
            expectativas de copias de seguridad son responsabilidad tuya, no nuestra.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="6" title="Pedir una restauración">
        <p>
          Para pedir una restauración, abre un ticket en el portal de facturación en{' '}
          <ShortLink name="billing" />{' '}
          o escribe a{' '}
          <Email name="support" />. Dinos:
        </p>
        <ul>
          <li>De qué servicio es la restauración</li>
          <li>Qué se perdió y, con toda la precisión que puedas, cuándo se perdió</li>
          <li>El momento al que te gustaría restaurar</li>
          <li>Si quieres una restauración completa sobre el servicio en marcha o una copia entregada junto a él</li>
        </ul>

        <LegalSubSection title="6.1 Cómo gestionamos las solicitudes de restauración">
          <p>
            Antes de hacer nada, te diremos qué copias de seguridad tenemos realmente de ese
            servicio y qué implicaría restaurar desde ellas. Cuando existe una copia de seguridad y
            la restauración es posible, la llevaremos a cabo o pondremos los datos a tu disposición.
          </p>
          <p>
            Una restauración es destructiva por naturaleza. Restaurar sobre un servicio en marcha
            sustituye su estado actual, incluido todo lo creado desde que se tomó la copia de
            seguridad. No iniciaremos una restauración que sobrescriba datos en producción sin tu
            confirmación explícita del punto de restauración.
          </p>
          <p>
            No nos comprometemos a un plazo de entrega para las restauraciones. Cuánto tarda una
            restauración depende por completo del tamaño de los datos, del tipo de servicio y de
            dónde esté guardada la copia de seguridad. Te daremos una estimación cuando confirmemos
            qué hay disponible, y damos prioridad a las restauraciones frente al trabajo rutinario.
          </p>
        </LegalSubSection>

        <LegalSubSection title="6.2 Cuándo se cobra una restauración">
          <p>
            Algunas restauraciones son un servicio de pago y no un servicio incluido. Que una
            restauración se cobre, y a qué precio, depende de tu plan y de la naturaleza de la
            solicitud. Te diremos el coste antes de llevar a cabo cualquier trabajo con cargo, y
            puedes rechazarlo.
          </p>
          <p>
            Cuando una restauración se ha llevado a cabo como extra de pago, es un servicio
            consumido y no es reembolsable, según se expone en la Sección 5 de nuestra{' '}
            <Link href={siteConfig.paths.refund}>Política de reembolsos</Link>.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="7" title="Copias de seguridad y cancelación">
        <p>
          Las copias de seguridad forman parte de tu servicio, no son algo que se guarde aparte de
          él. Cuando se cancela un servicio, sus copias de seguridad están sujetas a las mismas
          reglas de conservación y eliminación que el propio servicio, descritas en la Sección 9.3
          de nuestras Condiciones del servicio. Una vez transcurrido ese plazo, los datos ya no
          están y no podemos recuperarlos para ti, sea cual sea el motivo de la solicitud.
        </p>
        <p>
          Si necesitas datos de un servicio cancelado, pídelos de inmediato. No des por hecho que
          seguirán ahí la semana que viene.
        </p>
      </LegalSection>

      <LegalSection number="8" title="Seguridad de las copias de seguridad">
        <p>
          Las copias de seguridad contienen tus datos y están protegidas con los mismos controles
          descritos en la Sección 6 de nuestra{' '}
          <Link href={siteConfig.paths.privacy}>Política de privacidad</Link>,
          incluidos los controles de acceso que limitan qué miembros de nuestro equipo pueden llegar
          a ellas. Cuando una copia de seguridad está guardada en infraestructura operada por un
          socio, los destinatarios enumerados en nuestra página de{' '}
          <Link href={siteConfig.paths.subprocessors}>Subencargados</Link>{' '}
          se aplican también a esa copia.
        </p>
      </LegalSection>

      <LegalSection number="9" title="Cambios en esta política">
        <p>
          Podemos actualizar esta Política de copias de seguridad para reflejar cambios en nuestra
          infraestructura o en nuestros planes. Cuando hagamos cambios sustanciales, actualizaremos
          la fecha de entrada en vigor en la parte superior de esta página y publicaremos la
          política actualizada en{' '}
          <Link href={siteConfig.paths.backups}>
            {siteConfig.siteUrl}{siteConfig.paths.backups}
          </Link>. Los cambios que reduzcan lo que va incluido con un servicio que ya tienes se
          comunicarán por correo electrónico antes de que surtan efecto.
        </p>
      </LegalSection>

      <LegalSection number="10" title="Contacto">
        <p>
          Las solicitudes de restauración y las preguntas sobre las copias de seguridad deben
          dirigirse a:
        </p>
        <CompanyContact />
      </LegalSection>
    </>
  )
}
