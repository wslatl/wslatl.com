import { Link } from '@/components/legal/doc-link'
import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'
import { Callout, CompanyContact } from '@/components/legal/blocks'
import { Email } from '@/components/ui/email'
import { ShortLink } from '@/components/ui/short-link'

export default function AccountCreditContent() {
  return (
    <>
      <LegalSection number="1" title="Descripción general y alcance">
        <p>
          Estas Condiciones del crédito de cuenta rigen el saldo de crédito de cuenta que tienes en
          tu cuenta de facturación de WSLATL LLC (&ldquo;WSLATL&rdquo;, &ldquo;nosotros&rdquo;,
          &ldquo;nuestro&rdquo; o &ldquo;nos&rdquo;). El crédito de cuenta es un saldo prepagado que
          puedes aplicar a las facturas de WSLATL.
        </p>
        <p>
          Estas condiciones se incorporan y pasan a formar parte de nuestras{' '}
          <Link href={siteConfig.paths.terms}>Condiciones del servicio</Link>{' '}
          por referencia. Cuando el crédito de cuenta se emite como resultado de una solicitud de
          reembolso, nuestra{' '}
          <Link href={siteConfig.paths.refund}>Política de reembolsos</Link>{' '}
          rige si el reembolso se aprueba, y estas condiciones rigen qué es el saldo de crédito
          resultante y cómo se comporta.
        </p>
        <p>El crédito puede llegar a tu cuenta de tres formas:</p>
        <ul>
          <li>Lo compras directamente como recarga a través del portal de facturación</li>
          <li>Te lo emitimos nosotros, por ejemplo como resultado de una solicitud de reembolso aprobada o como crédito de servicio conforme a nuestro{' '}
            <Link href={siteConfig.paths.sla}>Acuerdo de Nivel de Servicio</Link>
          </li>
          <li>Otro cliente de WSLATL te lo regala y tú aceptas el regalo (véase la Sección 5)</li>
        </ul>
      </LegalSection>

      <LegalSection number="2" title="Qué no es el crédito de cuenta">
        <p>
          El crédito de cuenta es valor almacenado para usar en los servicios de WSLATL. Es
          importante que entiendas lo que no es:
        </p>
        <Callout tone="caution" title="No es una cuenta de depósito">
          El crédito de cuenta no es un depósito bancario, no se mantiene en una cuenta de
          depósito, no está asegurado por la FDIC ni por ningún otro asegurador y no es un
          instrumento de valor almacenado emitido por un banco. WSLATL no es un banco ni una
          entidad de transmisión de dinero, y tu saldo de crédito no está protegido como lo están
          los fondos depositados en una entidad financiera.
        </Callout>
        <ul>
          <li>
            <strong>No genera intereses.</strong> Un saldo de
            crédito no devenga intereses, rendimiento ni ningún otro retorno, por mucho tiempo que
            se mantenga.
          </li>
          <li>
            <strong>No se puede canjear por dinero.</strong>{' '}
            El crédito no se puede retirar, convertir en efectivo, abonar a una cuenta bancaria ni
            devolver al método de pago con el que se financió.
          </li>
          <li>
            <strong>No es transferible fuera de WSLATL.</strong>{' '}
            El crédito solo puede aplicarse a facturas de WSLATL o regalarse a otra cuenta de WSLATL
            según se describe en la Sección 5. No se puede vender, ceder ni transferir a un tercero.
          </li>
          <li>
            <strong>No es una línea de crédito.</strong> El
            crédito es dinero que ya has pagado tú u otra persona, o que ya te hemos emitido. No te
            permite mantener un saldo negativo.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="3" title="Comprar y usar crédito">

        <LegalSubSection title="3.1 Recargas">
          <p>
            Puedes añadir crédito a tu cuenta desde el portal de facturación en{' '}
            <ShortLink name="billing" />. Las recargas se cobran al método de pago que elijas en el momento de la compra y
            se añaden a tu saldo cuando el pago se confirma.
          </p>
          <p>
            Los importes de recarga están limitados actualmente a un mínimo de{' '}
            <strong>$5.00</strong> y un máximo de{' '}
            <strong>$1,000.00</strong> por transacción. Estos
            límites son operativos, no contractuales, y pueden cambiarse en el portal en cualquier
            momento. El portal muestra los límites vigentes cuando haces la compra.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.2 Cómo se aplica el crédito">
          <p>
            El crédito se aplica a las facturas de WSLATL en la moneda de tu cuenta. Cuando hay
            saldo disponible, puede aplicarse automáticamente a las facturas a medida que vencen, o
            puedes aplicarlo tú manualmente en el momento del pago, según la configuración de tu
            cuenta. Si una factura supera tu crédito disponible, el resto se cobra a tu método de
            pago.
          </p>
          <p>
            Aplicar crédito no cambia ninguna otra condición de tu servicio. Las facturas liquidadas
            con crédito están sujetas a las mismas Condiciones del servicio, Política de uso
            aceptable y Política de reembolsos que las facturas liquidadas con tarjeta.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.3 Registro de movimientos">
          <p>
            Todos los cambios en tu saldo se anotan en un registro de movimientos visible en tu
            portal de facturación, que muestra la fecha, el importe, el sentido del movimiento y el
            motivo. El registro es el documento de referencia de tu saldo. Si crees que un apunte es
            incorrecto, escríbenos a{' '}
            <Email name="support" />{' '}
            y lo investigaremos.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="4" title="Caducidad y reembolsabilidad">
        <Callout tone="good" title="El crédito de cuenta no caduca">
          Tu saldo de crédito no tiene fecha de caducidad. No aplicamos comisiones por cuenta
          inactiva, comisiones de mantenimiento, comisiones por falta de uso ni ninguna otra
          deducción que reduzca con el tiempo un saldo sin usar. El crédito sigue disponible
          mientras tu cuenta esté abierta.
        </Callout>

        <LegalSubSection title="4.1 El crédito no es reembolsable">
          <p>
            El crédito comprado{' '}
            <strong>no es reembolsable</strong>. Una vez que una
            recarga se ha añadido a tu saldo, no revertimos la compra ni devolvemos el dinero a tu
            método de pago. Como el crédito no caduca, un saldo sin usar sigue siendo tuyo para
            gastarlo en servicios de WSLATL en lugar de perderse.
          </p>
          <p>
            El crédito que te hemos emitido nosotros, y no el que has comprado, tampoco se puede
            canjear por dinero. Esto incluye el crédito emitido como resultado de una solicitud de
            reembolso aprobada y los créditos de servicio emitidos conforme a nuestro Acuerdo de
            Nivel de Servicio.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.2 Reembolsos pagados como crédito">
          <p>
            Cuando solicitas un reembolso, un resultado posible es que lo aprobemos como crédito de
            cuenta en lugar de como devolución a tu método de pago original. Los reembolsos pagados
            como crédito se rigen por estas condiciones una vez emitidos: se pueden gastar en
            facturas de WSLATL, no caducan y no se pueden retirar en efectivo. Nuestra{' '}
            <Link href={siteConfig.paths.refund}>Política de reembolsos</Link>{' '}
            establece cuándo se aplica cada resultado.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="5" title="Regalar crédito a otra cuenta">
        <p>
          Puedes regalar crédito de tu saldo a otra cuenta de WSLATL. Regalar mueve valor entre
          cuentas dentro de nuestra plataforma; no envía dinero a una persona y no es un servicio de
          pago.
        </p>
        <ul>
          <li>
            <strong>Debes tener el saldo.</strong> El importe
            del regalo se deduce de tu crédito disponible en el momento en que lo envías. No puedes
            regalar más de lo que tienes.
          </li>
          <li>
            <strong>El destinatario debe aceptarlo.</strong> Un
            regalo queda pendiente hasta que el destinatario lo acepta. Hasta la aceptación, ninguna
            de las dos partes puede gastar el importe. Queda reservado sobre tu saldo y todavía no
            forma parte del saldo del destinatario.
          </li>
          <li>
            <strong>Los regalos son definitivos una vez aceptados.</strong>{' '}
            Una vez que el destinatario acepta un regalo, el crédito pertenece a su cuenta. No
            revertiremos un regalo aceptado si se nos pide, tampoco si lo enviaste a la cuenta
            equivocada o cambiaste de opinión. Comprueba el destinatario antes de enviar.
          </li>
          <li>
            <strong>Regalar no crea derechos de reembolso.</strong>{' '}
            Un regalo no es una compra por parte del destinatario. Ni quien envía ni quien recibe
            obtiene un derecho de reembolso sobre el importe regalado más allá del que tuviera la
            compra original.
          </li>
          <li>
            <strong>Las dos cuentas deben estar en regla.</strong>{' '}
            Podemos rechazar o retener un regalo cuando cualquiera de las dos cuentas esté
            suspendida, bajo investigación o asociada a una disputa de pago.
          </li>
        </ul>
        <p>
          La función de regalo existe para que puedas echar una mano a alguien que conoces. Usarla
          para vender crédito a cambio de valor fuera de nuestra plataforma, para mover fondos entre
          partes sin relación o para ocultar el origen de un pago está prohibido y se tratará
          conforme a la Sección 6.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Fraude, contracargos y reversión">
        <p>
          Nos reservamos el derecho a revertir, congelar o anular el crédito de cuenta, total o
          parcialmente, cuando el crédito no se haya obtenido legítimamente o cuando el pago
          subyacente haya fallado. Esto se aplica en particular a:
        </p>
        <ul>
          <li>
            <strong>Compras con contracargo o revertidas.</strong>{' '}
            Si el pago que financió una recarga es objeto de contracargo, se disputa, se revierte o
            falla de otro modo después de haberse añadido el crédito, retiraremos del saldo el
            crédito correspondiente. Si el crédito ya se ha gastado, el descubierto resultante pasa
            a ser un importe adeudado en tu cuenta.
          </li>
          <li>
            <strong>Crédito obtenido de forma fraudulenta.</strong>{' '}
            El crédito comprado con un método de pago robado o no autorizado, obtenido mediante
            información falsa u obtenido aprovechando un fallo de nuestro sistema de facturación
            puede revertirse por mucho tiempo que haya pasado.
          </li>
          <li>
            <strong>Crédito movido para eludir la reversión.</strong>{' '}
            Cuando un crédito sujeto a reversión se ha regalado a su vez, podemos revertirlo desde
            la cuenta receptora. Aceptar un regalo no protege al crédito de la reversión si el
            crédito se obtuvo de forma fraudulenta.
          </li>
          <li>
            <strong>Crédito emitido por error.</strong> El
            crédito aplicado a tu cuenta por un error administrativo o del sistema puede corregirse.
            Te avisaremos cuando lo hagamos y te explicaremos la corrección.
          </li>
        </ul>
        <p>
          Cuando revertimos crédito, anotamos la reversión en tu registro de movimientos con el
          motivo. Las cuentas implicadas en un fraude de crédito también pueden suspenderse o
          cancelarse conforme a la Sección 9.2 de nuestras{' '}
          <Link href={siteConfig.paths.terms}>Condiciones del servicio</Link>.
        </p>
        <p>
          Si crees que un cargo en tu cuenta es incorrecto, escríbenos antes de presentar un
          contracargo. Investigaremos un error de facturación conforme a la Sección 3.2 de nuestra{' '}
          <Link href={siteConfig.paths.refund}>Política de reembolsos</Link>{' '}
          y es más rápido que una disputa a través del emisor de tu tarjeta.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Cierre de la cuenta">
        <p>
          El crédito está vinculado a tu cuenta de WSLATL. Sigue disponible mientras tu cuenta esté
          abierta, incluso cuando no tengas servicios activos.
        </p>

        {/*
          OWNER DECISION NEEDED: what happens to a remaining credit balance on account closure.

          This has to be decided before publication because the answer has real consequences and
          there is no defensible default to fall back on. The realistic options are:

            (a) Balance is forfeited on closure. Simplest operationally, but forfeiture of
                prepaid stored value is restricted or prohibited in a number of US states and is
                the option most likely to attract unclaimed-property exposure.
            (b) Balance is paid out to the client on closure. Most client-friendly, but it turns
                credit into something cash-redeemable, which conflicts with the non-redeemable
                position taken in Section 2 and changes the analysis of what the product is.
            (c) Balance is held for a defined period after closure and restored if the client
                returns, then handled under the applicable state unclaimed-property law.

          Whichever is chosen, the text must also say who initiates closure (client request
          versus termination for cause) because the answer may differ between the two. Counsel
          should confirm the Missouri unclaimed-property treatment, and the treatment for any
          state where a meaningful number of clients are located, before this is filled in.

          Do not publish a number, a holding period, or a forfeiture rule here until that
          decision is made.
        */}
        <Callout tone="caution" title="Saldo al cierre: pendiente">
          El tratamiento del saldo de crédito restante cuando se cierra una cuenta se está
          terminando de definir y todavía no se indica en este documento. Hasta que se publique
          aquí, si cierras tu cuenta con saldo, escríbenos a <Email name="support" /> y lo
          resolveremos contigo directamente y de buena fe.
        </Callout>

        <p>
          Nada de lo que dice esta sección limita nuestro derecho a revertir crédito conforme a la
          Sección 6, ni a aplicar un saldo de crédito a las facturas pendientes en el momento del
          cierre. Los importes que nos debas al cierre siguen siendo exigibles y pagaderos conforme
          a la Sección 9.3 de nuestras Condiciones del servicio.
        </p>
      </LegalSection>

      <LegalSection number="8" title="Impuestos">
        <p>
          Comprar crédito no es en sí la compra de un servicio sujeto a impuestos. Los impuestos
          aplicables se liquidan en la factura del servicio al que se aplica el crédito, en línea
          con la Sección 4.6 de nuestras{' '}
          <Link href={siteConfig.paths.terms}>Condiciones del servicio</Link>.
          Sigues siendo responsable de cualquier impuesto aplicable a tu uso de nuestros servicios.
        </p>
      </LegalSection>

      <LegalSection number="9" title="Cambios en estas condiciones">
        <p>
          Podemos actualizar estas Condiciones del crédito de cuenta para reflejar cambios en
          nuestras prácticas, en nuestro sistema de facturación o en la legislación aplicable.
          Cuando hagamos cambios sustanciales, actualizaremos la fecha de entrada en vigor en la
          parte superior de esta página, avisaremos por correo electrónico a los clientes activos
          con un resumen de lo que ha cambiado y publicaremos las condiciones actualizadas en{' '}
          <Link href={siteConfig.paths.accountCredit}>
            {siteConfig.siteUrl}{siteConfig.paths.accountCredit}
          </Link>.
        </p>
        <p>
          No introduciremos una fecha de caducidad, una comisión por cuenta inactiva ni ninguna otra
          deducción que reduzca un saldo existente sin usar. El crédito que ya esté en tu cuenta
          cuando un cambio entre en vigor conserva el tratamiento que tenía cuando se emitió, si ese
          tratamiento te era más favorable.
        </p>
      </LegalSection>

      <LegalSection number="10" title="Contacto">
        <p>
          Las preguntas sobre tu saldo de crédito, un apunte del registro o un regalo deben
          dirigirse a:
        </p>
        <CompanyContact />
      </LegalSection>
    </>
  )
}
