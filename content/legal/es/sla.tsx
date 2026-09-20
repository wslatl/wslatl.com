import { Link } from '@/components/legal/doc-link'
import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'
import { UptimeTable } from '@/components/legal/uptime-table'
import { Callout, CompanyContact } from '@/components/legal/blocks'
import { Email } from '@/components/ui/email'
import { ShortLink } from '@/components/ui/short-link'

export default function SlaContent() {
  return (
    <>
      <LegalSection number="1" title="Descripción general y alcance">
        <p>
          Este Acuerdo de Nivel de Servicio (&ldquo;SLA&rdquo;) establece los objetivos de
          disponibilidad que WSLATL LLC (&ldquo;WSLATL&rdquo;, &ldquo;nosotros&rdquo;,
          &ldquo;nuestro&rdquo; o &ldquo;nos&rdquo;) se propone cumplir para cada tipo de servicio,
          cómo gestionamos el mantenimiento y el crédito de servicio que puedes reclamar cuando no
          los cumplimos.
        </p>
        <Callout tone="note" title="Esto es una repetición, no un compromiso nuevo">
          Esta página reproduce la Sección 5 de nuestras{' '}
          <Link href={siteConfig.paths.terms}>Condiciones del servicio</Link>{' '}
          como documento independiente, para que sea más fácil de encontrar y de citar. Los
          compromisos que figuran aquí son los mismos compromisos que ya están en las Condiciones.
          No se ha añadido, eliminado ni cambiado nada. Si alguna vez los dos documentos entran en
          conflicto, prevalecen las Condiciones del servicio.
        </Callout>
        <p>
          Este SLA se aplica a los clientes con servicios activos, pagados y en regla. No se aplica
          a los servicios suspendidos, a los servicios en periodo de gracia por impago, a los
          acuerdos de prueba o gratuitos ni a los servicios cancelados por causa justificada.
        </p>
      </LegalSection>

      <LegalSection number="2" title="Objetivos de disponibilidad">
        <UptimeTable />
        <p>
          La disponibilidad se mide por mes natural y excluye las ventanas de mantenimiento
          programado y el tiempo de inactividad causado por hechos ajenos a nuestro control
          razonable (véase la Sección 15 de las Condiciones del servicio, Fuerza mayor).
        </p>
      </LegalSection>

      <LegalSection number="3" title="Mantenimiento programado">
        <p>
          Avisaremos de las ventanas de mantenimiento programado con al menos{' '}
          <strong>24 horas de antelación</strong> a
          través de nuestra página de estado (status.wslatl.com) y/o por correo electrónico a los
          clientes afectados. El mantenimiento de emergencia necesario para proteger la integridad o
          la seguridad del servicio puede realizarse sin aviso previo, aunque lo comunicaremos lo
          antes posible.
        </p>
        <p>
          Nuestra página de estado está en{' '}
          <ShortLink name="status" />.
        </p>
      </LegalSection>

      <LegalSection number="4" title="Créditos de servicio">
        <p>
          Si no cumplimos el objetivo de disponibilidad aplicable por causa imputable a nosotros,
          puedes solicitar un crédito de servicio equivalente al{' '}
          <strong>10% del coste mensual del servicio afectado</strong> por
          cada incidente admisible. Los créditos se aplican al saldo de tu cuenta y no superarán el
          coste de un mes completo del servicio afectado. Los créditos de servicio son tu único y
          exclusivo recurso ante los incumplimientos de disponibilidad y no te dan derecho a un
          reembolso en efectivo.
        </p>
        <p>
          Para solicitar un crédito, escríbenos en un plazo de 15 días desde el incidente a <Email name="support" /> con
          la fecha, la duración y la naturaleza de la interrupción.
        </p>

        <LegalSubSection title="4.1 Cómo se conservan los créditos">
          <p>
            Un crédito de servicio emitido conforme a este SLA se aplica al saldo de tu cuenta como
            crédito de cuenta. Una vez emitido, se comporta como cualquier otro crédito de cuenta:
            se puede gastar en facturas de WSLATL, no caduca y no se puede canjear por dinero.
            Consulta nuestras{' '}
            <Link href={siteConfig.paths.accountCredit}>Condiciones del crédito de cuenta</Link>{' '}
            para ver el tratamiento completo.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.2 Relación con la Política de reembolsos">
          <p>
            Un crédito de servicio conforme a este SLA y un reembolso conforme a nuestra{' '}
            <Link href={siteConfig.paths.refund}>Política de reembolsos</Link>{' '}
            son recursos distintos. Como se indica en la Sección 3.1 de la Política de reembolsos,
            una interrupción que supere el objetivo de disponibilidad aplicable también puede ser
            un motivo admitido para un reembolso dentro del plazo de 14 días, y ese derecho de
            reembolso se suma al crédito de servicio del 10% en lugar de sustituirlo. La
            admisibilidad del reembolso se decide conforme a la Política de reembolsos, no conforme
            a este SLA.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="5" title="Exclusiones">
        <p>
          En coherencia con la Sección 2 anterior, los objetivos de disponibilidad de este SLA no
          cubren el tiempo de inactividad atribuible a:
        </p>
        <ul>
          <li>Las ventanas de mantenimiento programado notificadas conforme a la Sección 3</li>
          <li>
            Los hechos ajenos a nuestro control razonable, según se describen en la Sección 15 de
            las Condiciones del servicio
          </li>
        </ul>
        <p>
          La línea de servidores dedicados de la tabla anterior es un objetivo en la medida de lo
          posible, no un porcentaje medido, porque la disponibilidad depende del hardware y del
          centro de datos que lo aloja.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Cambios en este SLA">
        <p>
          Como este documento repite la Sección 5 de las Condiciones del servicio, los cambios en
          los compromisos que figuran aquí se hacen a través de las Condiciones y siguen el proceso
          de aviso de la Sección 14 de las Condiciones del servicio. Cuando los compromisos cambien,
          actualizaremos la fecha de entrada en vigor en la parte superior de esta página y
          publicaremos el SLA actualizado en{' '}
          <Link href={siteConfig.paths.sla}>
            {siteConfig.siteUrl}{siteConfig.paths.sla}
          </Link>.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Contacto">
        <p>
          Las reclamaciones de crédito de servicio y las preguntas sobre este SLA deben dirigirse a:
        </p>
        <CompanyContact />
      </LegalSection>
    </>
  )
}
