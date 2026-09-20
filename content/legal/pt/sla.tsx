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
      <LegalSection number="1" title="Visão Geral e Escopo">
        <p>
          Este Acordo de Nível de Serviço (&ldquo;SLA&rdquo;) define as metas de uptime que a
          WSLATL LLC (&ldquo;WSLATL&rdquo;, &ldquo;nós&rdquo;, &ldquo;nosso&rdquo; ou
          &ldquo;nos&rdquo;) busca cumprir para cada tipo de serviço, como lidamos com manutenção
          e o crédito de serviço que você pode solicitar quando não as cumprimos.
        </p>
        <Callout tone="note" title="Isto é uma reafirmação, não um novo compromisso">
          Esta página reproduz a Seção 5 dos nossos{' '}
          <Link href={siteConfig.paths.terms}>Termos de Serviço</Link>{' '}
          como um documento autônomo, para que fique mais fácil de encontrar e de citar. Os
          compromissos aqui são os mesmos compromissos que já estão nos Termos. Nada foi
          acrescentado, removido ou alterado. Se algum dia os dois documentos entrarem em
          conflito, prevalecem os Termos de Serviço.
        </Callout>
        <p>
          Este SLA se aplica a clientes com serviços ativos, pagos e em situação regular. Ele não
          se aplica a serviços suspensos, a serviços em período de tolerância por falta de
          pagamento, a arranjos de teste ou de cortesia, nem a serviços rescindidos por justa
          causa.
        </p>
      </LegalSection>

      <LegalSection number="2" title="Metas de Uptime">
        <UptimeTable />
        <p>
          O uptime é medido por mês civil e exclui as janelas de manutenção programada e a
          indisponibilidade causada por eventos fora do nosso controle razoável (veja a Seção 15
          dos Termos de Serviço, Força Maior).
        </p>
      </LegalSection>

      <LegalSection number="3" title="Manutenção Programada">
        <p>
          Daremos, no mínimo,{' '}
          <strong>24 horas de aviso prévio</strong> para
          janelas de manutenção programada, pela nossa página de status (status.wslatl.com) e/ou
          por e-mail aos clientes afetados. A manutenção emergencial necessária para proteger a
          integridade ou a segurança do serviço pode ser realizada sem aviso prévio, embora
          comuniquemos o mais rápido possível.
        </p>
        <p>
          A nossa página de status fica em{' '}
          <ShortLink name="status" />.
        </p>
      </LegalSection>

      <LegalSection number="4" title="Créditos de Serviço">
        <p>
          Se deixarmos de cumprir a meta de uptime aplicável por culpa nossa, você pode solicitar um
          crédito de serviço equivalente a <strong>10% do custo mensal do serviço afetado</strong> por
          incidente que se qualifique. Os créditos são aplicados ao saldo da sua conta e não
          excederão o custo de um mês completo do serviço afetado. Os créditos de serviço são a sua
          única e exclusiva reparação por falhas de uptime e não lhe dão direito a reembolso em
          dinheiro.
        </p>
        <p>
          Para solicitar um crédito, entre em contato conosco em até 15 dias após o incidente pelo
          e-mail <Email name="support" /> com a data, a duração e a natureza da interrupção.
        </p>

        <LegalSubSection title="4.1 Como os Créditos São Mantidos">
          <p>
            Um crédito de serviço emitido sob este SLA é aplicado ao saldo da sua conta como
            crédito na conta. Depois de emitido, ele se comporta como qualquer outro crédito na
            conta: pode ser gasto em faturas da WSLATL, não expira e não é resgatável em dinheiro.
            Veja os nossos{' '}
            <Link href={siteConfig.paths.accountCredit}>Termos de Crédito na Conta</Link>{' '}
            para o tratamento completo.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.2 Relação com a Política de Reembolso">
          <p>
            Um crédito de serviço sob este SLA e um reembolso sob a nossa{' '}
            <Link href={siteConfig.paths.refund}>Política de Reembolso</Link>{' '}
            são reparações distintas. Conforme indicado na Seção 3.1 da Política de Reembolso, uma
            interrupção que ultrapasse a meta de uptime aplicável também pode ser um motivo
            elegível para reembolso dentro do prazo de 14 dias, e esse direito a reembolso soma-se
            ao crédito de serviço de 10%, em vez de substituí-lo. A elegibilidade para reembolso é
            decidida sob a Política de Reembolso, não sob este SLA.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="5" title="Exclusões">
        <p>
          Em consonância com a Seção 2 acima, as metas de uptime deste SLA não cobrem a
          indisponibilidade atribuível a:
        </p>
        <ul>
          <li>Janelas de manutenção programada comunicadas de acordo com a Seção 3</li>
          <li>Eventos fora do nosso controle razoável, conforme descrito na Seção 15 dos Termos de Serviço</li>
        </ul>
        <p>
          A linha de servidores dedicados na tabela acima é uma meta de melhor esforço, e não uma
          porcentagem medida, porque a disponibilidade depende do hardware e do data center que o
          hospeda.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Alterações a Este SLA">
        <p>
          Como este documento reafirma a Seção 5 dos Termos de Serviço, as alterações aos
          compromissos aqui presentes são feitas pelos Termos e seguem o processo de aviso da
          Seção 14 dos Termos de Serviço. Quando os compromissos mudarem, atualizaremos a data de
          vigência no topo desta página e publicaremos o SLA atualizado em{' '}
          <Link href={siteConfig.paths.sla}>
            {siteConfig.siteUrl}{siteConfig.paths.sla}
          </Link>.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Contato">
        <p>
          Pedidos de crédito de serviço e dúvidas sobre este SLA devem ser dirigidos a:
        </p>
        <CompanyContact />
      </LegalSection>
    </>
  )
}
