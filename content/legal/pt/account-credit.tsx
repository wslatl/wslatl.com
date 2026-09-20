import { Link } from '@/components/legal/doc-link'
import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'
import { Callout, CompanyContact } from '@/components/legal/blocks'
import { Email } from '@/components/ui/email'
import { ShortLink } from '@/components/ui/short-link'

export default function AccountCreditContent() {
  return (
    <>
      <LegalSection number="1" title="Visão Geral e Escopo">
        <p>
          Estes Termos de Crédito na Conta regem o saldo de crédito na conta mantido na sua conta de
          faturamento da WSLATL LLC (&ldquo;WSLATL&rdquo;, &ldquo;nós&rdquo;, &ldquo;nosso&rdquo; ou
          &ldquo;nos&rdquo;). O crédito na conta é um saldo pré-pago que você pode aplicar em
          faturas da WSLATL.
        </p>
        <p>
          Estes termos são incorporados aos nossos{' '}
          <Link href={siteConfig.paths.terms}>Termos de Serviço</Link>{' '}
          e deles passam a fazer parte por referência. Quando o crédito na conta é emitido como
          resultado de um pedido de reembolso, a nossa{' '}
          <Link href={siteConfig.paths.refund}>Política de Reembolso</Link>{' '}
          rege se o reembolso é aprovado, e estes termos regem o que é o saldo de crédito resultante
          e como ele se comporta.
        </p>
        <p>O crédito pode chegar à sua conta de três maneiras:</p>
        <ul>
          <li>Você o compra diretamente como uma recarga pelo portal de faturamento</li>
          <li>Nós o emitimos para você, por exemplo como resultado de um pedido de reembolso aprovado ou de um crédito de serviço sob o nosso{' '}
            <Link href={siteConfig.paths.sla}>Acordo de Nível de Serviço</Link>
          </li>
          <li>Outro cliente da WSLATL o presenteia a você e você aceita o presente (veja a Seção 5)</li>
        </ul>
      </LegalSection>

      <LegalSection number="2" title="O Que o Crédito na Conta Não É">
        <p>
          O crédito na conta é valor armazenado para uso em serviços da WSLATL. É importante que
          você entenda o que ele não é:
        </p>
        <Callout tone="caution" title="Não é uma conta de depósito">
          O crédito na conta não é um depósito bancário, não é mantido em conta de depósito, não é
          segurado pelo FDIC nem por qualquer outro segurador e não é um instrumento de valor
          armazenado emitido por um banco. A WSLATL não é um banco nem uma transmissora de
          dinheiro, e o seu saldo de crédito não é protegido da forma como são os recursos mantidos
          em uma instituição financeira.
        </Callout>
        <ul>
          <li>
            <strong>Ele não rende juros.</strong> Um saldo de
            crédito não acumula juros, rendimento nem qualquer outro retorno, por mais tempo que
            seja mantido.
          </li>
          <li>
            <strong>Ele não é resgatável em dinheiro.</strong>{' '}
            O crédito não pode ser sacado, convertido em dinheiro, pago a uma conta bancária nem
            convertido de volta para o meio de pagamento que o financiou.
          </li>
          <li>
            <strong>Ele não é transferível para fora da WSLATL.</strong>{' '}
            O crédito só pode ser aplicado em faturas da WSLATL ou presenteado a outra conta da
            WSLATL conforme descrito na Seção 5. Ele não pode ser vendido, cedido nem transferido a
            terceiros.
          </li>
          <li>
            <strong>Ele não é uma linha de crédito.</strong> O
            crédito é dinheiro que você ou outra pessoa já pagou, ou que já emitimos para você. Ele
            não permite que você fique com saldo negativo.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="3" title="Como Comprar e Usar o Crédito">

        <LegalSubSection title="3.1 Recargas">
          <p>
            Você pode adicionar crédito à sua conta pelo portal de faturamento em{' '}
            <ShortLink name="billing" />. As recargas são cobradas do meio de pagamento que você selecionar no momento da
            compra e são adicionadas ao seu saldo assim que o pagamento é compensado.
          </p>
          <p>
            Os valores de recarga estão atualmente limitados a um mínimo de{' '}
            <strong>$5.00</strong> e a um máximo de{' '}
            <strong>$1,000.00</strong> por transação. Esses
            limites são operacionais, e não contratuais, e podem ser alterados no portal a qualquer
            momento. O portal mostra os limites em vigor quando você faz a compra.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.2 Como o Crédito É Aplicado">
          <p>
            O crédito é aplicado em faturas da WSLATL na moeda da sua conta. Quando há saldo
            disponível, ele pode ser aplicado automaticamente às faturas conforme elas vencem, ou
            aplicado manualmente por você no momento do pagamento, dependendo das configurações da
            sua conta. Se uma fatura exceder o crédito disponível, o restante é cobrado do seu meio
            de pagamento.
          </p>
          <p>
            Aplicar crédito não altera nenhum outro termo do seu serviço. As faturas quitadas com
            crédito estão sujeitas aos mesmos Termos de Serviço, à mesma Política de Uso Aceitável e
            à mesma Política de Reembolso que as faturas quitadas com cartão.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.3 Extrato de Transações">
          <p>
            Toda alteração no seu saldo é registrada em um extrato de transações visível no seu
            portal de faturamento, mostrando a data, o valor, o sentido da movimentação e o motivo.
            O extrato é o registro oficial do seu saldo. Se você acredita que um lançamento está
            errado, entre em contato conosco em{' '}
            <Email name="support" />{' '}
            e vamos investigar.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="4" title="Expiração e Reembolsabilidade">
        <Callout tone="good" title="O crédito na conta não expira">
          O seu saldo de crédito não tem data de expiração. Não aplicamos tarifas de dormência,
          tarifas de manutenção, tarifas de inatividade nem qualquer outra dedução que reduza um
          saldo não utilizado ao longo do tempo. O crédito continua disponível enquanto a sua conta
          estiver aberta.
        </Callout>

        <LegalSubSection title="4.1 O Crédito Não É Reembolsável">
          <p>
            O crédito comprado é{' '}
            <strong>não reembolsável</strong>. Depois que uma
            recarga é adicionada ao seu saldo, não revertemos a compra nem devolvemos o dinheiro ao
            seu meio de pagamento. Como o crédito não expira, um saldo não utilizado continua sendo
            seu para gastar em serviços da WSLATL, em vez de ser perdido.
          </p>
          <p>
            O crédito que emitimos para você, em vez do crédito que você comprou, também não é
            resgatável em dinheiro. Isso inclui o crédito emitido como resultado de um pedido de
            reembolso aprovado e os créditos de serviço emitidos sob o nosso Acordo de Nível de
            Serviço.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.2 Reembolsos Pagos como Crédito">
          <p>
            Quando você pede um reembolso, um resultado possível é que o aprovemos como crédito na
            conta, e não como devolução ao seu meio de pagamento original. Os reembolsos pagos como
            crédito passam a ser regidos por estes termos depois de emitidos: podem ser gastos em
            faturas da WSLATL, não expiram e não são sacáveis em dinheiro. A nossa{' '}
            <Link href={siteConfig.paths.refund}>Política de Reembolso</Link>{' '}
            define quando cada resultado se aplica.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="5" title="Presentear Crédito a Outra Conta">
        <p>
          Você pode presentear crédito do seu saldo a outra conta da WSLATL. Presentear move valor
          entre contas dentro da nossa plataforma; isso não envia dinheiro a uma pessoa e não é um
          serviço de pagamento.
        </p>
        <ul>
          <li>
            <strong>Você precisa ter o saldo.</strong> O valor
            do presente é deduzido do seu crédito disponível no momento em que você o envia. Você
            não pode presentear mais do que possui.
          </li>
          <li>
            <strong>O destinatário precisa aceitar.</strong> Um
            presente fica pendente até que o destinatário o aceite. Até a aceitação, o valor não
            pode ser gasto por nenhuma das partes. Ele fica reservado no seu saldo e ainda não faz
            parte do saldo do destinatário.
          </li>
          <li>
            <strong>Os presentes são definitivos depois de aceitos.</strong>{' '}
            Depois que o destinatário aceita um presente, o crédito pertence à conta dele. Não
            revertemos um presente aceito mediante pedido, inclusive se você o enviou para a conta
            errada ou mudou de ideia. Confira o destinatário antes de enviar.
          </li>
          <li>
            <strong>Presentear não cria direitos de reembolso.</strong>{' '}
            Um presente não é uma compra feita pelo destinatário. Nem quem envia nem quem recebe
            ganha um direito de reembolso sobre o valor presenteado além do que a compra original já
            trazia.
          </li>
          <li>
            <strong>As duas contas precisam estar em situação regular.</strong>{' '}
            Podemos recusar ou reter um presente quando qualquer uma das contas estiver suspensa,
            sob investigação ou associada a uma disputa de pagamento.
          </li>
        </ul>
        <p>
          Presentear existe para que você possa ajudar alguém que conhece. Usar esse recurso para
          vender crédito por valor fora da nossa plataforma, para mover recursos entre partes não
          relacionadas ou para ocultar a origem de um pagamento é proibido e será tratado sob a
          Seção 6.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Fraude, Chargebacks e Estorno">
        <p>
          Reservamo-nos o direito de estornar, congelar ou anular crédito na conta, no todo ou em
          parte, quando o crédito não tiver sido obtido legitimamente ou quando o pagamento
          subjacente tiver falhado. Isso se aplica em particular a:
        </p>
        <ul>
          <li>
            <strong>Compras com chargeback ou estornadas.</strong>{' '}
            Se o pagamento que financiou uma recarga sofrer chargeback, for contestado, estornado
            ou falhar de outra forma depois de o crédito ter sido adicionado, removeremos o crédito
            correspondente do saldo. Se o crédito já tiver sido gasto, a diferença resultante se
            torna um valor devido na sua conta.
          </li>
          <li>
            <strong>Crédito obtido de forma fraudulenta.</strong>{' '}
            O crédito comprado com um meio de pagamento roubado ou não autorizado, obtido por meio
            de informações falsas ou obtido explorando uma falha no nosso sistema de faturamento
            pode ser estornado, independentemente de quanto tempo tenha passado.
          </li>
          <li>
            <strong>Crédito movido para escapar do estorno.</strong>{' '}
            Quando um crédito sujeito a estorno tiver sido presenteado adiante, podemos estorná-lo
            da conta que o recebeu. Aceitar um presente não protege o crédito do estorno se o
            crédito foi obtido de forma fraudulenta.
          </li>
          <li>
            <strong>Crédito emitido por engano.</strong> O
            crédito aplicado à sua conta por erro administrativo ou do sistema pode ser corrigido.
            Avisaremos você quando fizermos isso e explicaremos a correção.
          </li>
        </ul>
        <p>
          Quando estornamos crédito, registramos o estorno no seu extrato de transações com o
          motivo. As contas envolvidas em fraude de crédito também podem ser suspensas ou
          encerradas sob a Seção 9.2 dos nossos{' '}
          <Link href={siteConfig.paths.terms}>Termos de Serviço</Link>.
        </p>
        <p>
          Se você acredita que uma cobrança na sua conta está errada, fale com a gente antes de
          abrir um chargeback. Investigamos um erro de faturamento sob a Seção 3.2 da nossa{' '}
          <Link href={siteConfig.paths.refund}>Política de Reembolso</Link>{' '}
          e isso é mais rápido do que uma disputa pelo emissor do seu cartão.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Encerramento da Conta">
        <p>
          O crédito está vinculado à sua conta da WSLATL. Ele continua disponível enquanto a sua
          conta estiver aberta, inclusive quando você não tiver serviços ativos.
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
        <Callout tone="caution" title="Saldo no encerramento: pendente">
          O tratamento de um saldo de crédito remanescente quando uma conta é encerrada está sendo
          finalizado e ainda não está declarado neste documento. Até que seja publicado aqui, se
          você encerrar a sua conta com saldo, entre em contato conosco em <Email name="support" /> e
          cuidaremos disso com você diretamente e de boa-fé.
        </Callout>

        <p>
          Nada nesta seção limita o nosso direito de estornar crédito sob a Seção 6, nem de aplicar
          um saldo de crédito em faturas em aberto no momento do encerramento. Os valores que você
          nos deve no encerramento continuam devidos e exigíveis sob a Seção 9.3 dos nossos Termos
          de Serviço.
        </p>
      </LegalSection>

      <LegalSection number="8" title="Impostos">
        <p>
          Comprar crédito não é, em si, a compra de um serviço tributável. Os impostos aplicáveis
          são apurados na fatura do serviço ao qual o crédito é aplicado, em linha com a Seção
          4.6 dos nossos{' '}
          <Link href={siteConfig.paths.terms}>Termos de Serviço</Link>.
          Você continua responsável por quaisquer impostos aplicáveis ao seu uso dos nossos
          serviços.
        </p>
      </LegalSection>

      <LegalSection number="9" title="Alterações a Estes Termos">
        <p>
          Podemos atualizar estes Termos de Crédito na Conta para refletir mudanças nas nossas
          práticas, no nosso sistema de faturamento ou na lei aplicável. Quando fizermos alterações
          substanciais, atualizaremos a data de vigência no topo desta página, avisaremos os
          clientes ativos por e-mail com um resumo do que mudou e publicaremos os termos atualizados
          em{' '}
          <Link href={siteConfig.paths.accountCredit}>
            {siteConfig.siteUrl}{siteConfig.paths.accountCredit}
          </Link>.
        </p>
        <p>
          Não vamos introduzir data de expiração, tarifa de dormência nem qualquer outra dedução que
          reduza um saldo não utilizado já existente. O crédito que já estiver na sua conta quando
          uma alteração entrar em vigor mantém o tratamento que tinha quando foi emitido, se esse
          tratamento for mais favorável a você.
        </p>
      </LegalSection>

      <LegalSection number="10" title="Contato">
        <p>
          Dúvidas sobre o seu saldo de crédito, um lançamento do extrato ou um presente devem ser
          dirigidas a:
        </p>
        <CompanyContact />
      </LegalSection>
    </>
  )
}
