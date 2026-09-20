import { Link } from '@/components/legal/doc-link'
import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'
import { Callout, CompanyContact, InfoCard, InfoRow } from '@/components/legal/blocks'
import { Email } from '@/components/ui/email'

export default function DmcaContent() {
  return (
    <>
      <LegalSection number="1" title="Visão Geral e Escopo">
        <p>
          A WSLATL LLC (&ldquo;WSLATL&rdquo;, &ldquo;nós&rdquo;, &ldquo;nosso&rdquo; ou &ldquo;nos&rdquo;)
          respeita os direitos de propriedade intelectual de terceiros e espera que os nossos
          clientes façam o mesmo. Esta Política de DMCA explica como denunciar material hospedado na
          infraestrutura da WSLATL que você acredita infringir os seus direitos autorais, como um
          cliente pode contestar uma remoção e como lidamos com clientes que infringem repetidamente.
        </p>
        <p>
          Esta política foi escrita para estar alinhada com o Digital Millennium Copyright Act,
          17 U.S.C. &sect;&nbsp;512. Ela substitui e amplia o resumo que antes constava da
          Seção 8 dos nossos{' '}
          <Link href={siteConfig.paths.terms}>Termos de Serviço</Link>,
          e é incorporada a esses Termos por referência.
        </p>
        <p>
          A WSLATL é uma provedora de hospedagem. Na maioria dos casos, não criamos, selecionamos
          nem revisamos o material armazenado na nossa infraestrutura pelos clientes. Agimos sobre
          reclamações de direitos autorais que cumpram os requisitos abaixo.
        </p>
      </LegalSection>

      <LegalSection number="2" title="Agente de Direitos Autorais Designado">
        <p>
          As notificações de alegada violação devem ser enviadas ao nosso agente designado.
          Notificações enviadas a outros endereços, a membros da equipe ou ao nosso servidor no
          Discord podem ser atrasadas e podem não ser tratadas como notificação válida.
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
        <InfoCard title="Agente de Direitos Autorais Designado">
          <InfoRow label="Agente">
            WSLATL Copyright Agent
          </InfoRow>
          <InfoRow label="Empresa">
            WSLATL LLC
          </InfoRow>
          <InfoRow label="Endereço postal">
            2414 County Road 1310, Moberly, MO 65270, United States
          </InfoRow>
          <InfoRow label="Telefone">
            1-660-998-8016
          </InfoRow>
          <InfoRow label="E-mail">
            <Email name="dmca" />
          </InfoRow>
          <InfoRow label="Linha de assunto">
            DMCA Takedown Notice
          </InfoRow>
        </InfoCard>

        <Callout tone="caution" title="Situação do registro do agente">
          Os dados de contato acima são o canal que monitoramos para reclamações de direitos
          autorais. Não afirmamos nesta página que um registro de agente designado tenha sido
          concluído junto ao United States Copyright Office. Se você precisa confirmar a situação
          atual do registro antes de notificar, entre em contato conosco em <Email name="support" /> e
          nós diremos a você.
        </Callout>
      </LegalSection>

      <LegalSection number="3" title="Como Enviar uma Notificação de Remoção">
        <p>
          Para ser eficaz sob o 17 U.S.C. &sect;&nbsp;512(c)(3), uma notificação de alegada
          violação deve ser uma comunicação escrita que inclua substancialmente todos os seis
          elementos a seguir:
        </p>
        <ol>
          <li>
            Uma assinatura física ou eletrônica de uma pessoa autorizada a agir em nome do titular
            de um direito exclusivo que é alegadamente violado.
          </li>
          <li>
            A identificação da obra protegida por direitos autorais que se alega ter sido violada.
            Se várias obras em um único site forem cobertas por uma notificação, uma lista
            representativa dessas obras naquele site.
          </li>
          <li>
            A identificação do material que se alega ser infrator ou ser objeto de atividade
            infratora, e informações razoavelmente suficientes para nos permitir localizá-lo. Uma
            URL direta, um endereço IP e porta, um caminho de arquivo ou um identificador de
            servidor são a forma mais útil.
          </li>
          <li>
            Informações razoavelmente suficientes para nos permitir entrar em contato com você,
            incluindo o seu nome, endereço, número de telefone e, se disponível, um endereço de
            e-mail.
          </li>
          <li>
            Uma declaração de que você tem a crença de boa-fé de que o uso do material da maneira
            reclamada não é autorizado pelo titular dos direitos autorais, pelo seu agente ou pela
            lei.
          </li>
          <li>
            Uma declaração de que as informações da notificação são exatas e, sob pena de perjúrio,
            de que você está autorizado a agir em nome do titular de um direito exclusivo que é
            alegadamente violado.
          </li>
        </ol>
        <p>
          Uma notificação que não cumpra substancialmente todos os seis elementos pode não ser
          tratada como notificação válida. Se a sua notificação estiver incompleta, diremos o que
          está faltando sempre que pudermos razoavelmente fazê-lo.
        </p>

        <LegalSubSection title="3.1 O Que Acontece Depois">
          <p>
            Ao receber uma notificação em conformidade, responderemos com rapidez para remover ou
            desabilitar o acesso ao material identificado, e tomaremos medidas razoáveis para
            avisar o cliente afetado de que o material foi removido ou desabilitado. Dependendo do
            serviço, a remoção pode assumir a forma de retirar um arquivo específico, desabilitar
            uma aplicação específica ou suspender o serviço afetado quando o material não puder ser
            isolado.
          </p>
          <p>
            Encaminhamos uma cópia da notificação, incluindo as informações de contato que ela
            contém, ao cliente afetado. Não inclua em uma notificação informações que você não
            esteja disposto a ver compartilhadas com o cliente.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.2 Declaração Falsa">
          <p>
            Sob o 17 U.S.C. &sect;&nbsp;512(f), qualquer pessoa que, conscientemente, declare de
            forma materialmente falsa que um material é infrator, ou que um material foi removido
            ou desabilitado por engano ou identificação equivocada, pode responder por danos,
            incluindo custas e honorários advocatícios. Por favor, considere se o uso que você está
            denunciando pode ser autorizado pelo titular dos direitos autorais, por licença ou por
            lei antes de enviar a notificação.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="4" title="Contranotificação">
        <p>
          Se você é cliente da WSLATL e um material seu foi removido ou desabilitado, e você
          acredita que a remoção resultou de engano ou identificação equivocada, pode enviar uma
          contranotificação ao nosso agente designado no endereço da Seção 2.
        </p>
        <p>
          Para ser eficaz sob o 17 U.S.C. &sect;&nbsp;512(g)(3), uma contranotificação deve ser
          uma comunicação escrita que inclua substancialmente todo o seguinte:
        </p>
        <ol>
          <li>A sua assinatura física ou eletrônica.</li>
          <li>
            A identificação do material que foi removido ou ao qual o acesso foi desabilitado, e o
            local em que o material aparecia antes de ser removido ou de o acesso a ele ser
            desabilitado.
          </li>
          <li>
            Uma declaração, sob pena de perjúrio, de que você tem a crença de boa-fé de que o
            material foi removido ou desabilitado em razão de engano ou identificação equivocada do
            material.
          </li>
          <li>
            O seu nome, endereço e número de telefone, e uma declaração de que você consente com a
            jurisdição do Federal District Court do distrito judicial em que o seu endereço está
            localizado ou, se o seu endereço estiver fora dos Estados Unidos, de qualquer distrito
            judicial em que a WSLATL LLC possa ser encontrada, e de que você aceitará a citação da
            pessoa que forneceu a notificação original ou de um agente dessa pessoa.
          </li>
        </ol>

        <LegalSubSection title="4.1 Prazo de Restabelecimento">
          <p>
            Ao receber uma contranotificação em conformidade, forneceremos prontamente uma cópia à
            pessoa que enviou a notificação de remoção original e informaremos a ela que vamos
            repor o material removido ou deixar de desabilitar o acesso a ele.
          </p>
          <p>
            Sob o 17 U.S.C. &sect;&nbsp;512(g)(2)(C), vamos repor o material removido ou
            restabelecer o acesso{' '}
            <strong>
              não antes de 10 e não depois de 14 dias úteis
            </strong>{' '}
            após o recebimento da contranotificação, a menos que o nosso agente designado receba
            antes um aviso da parte reclamante original de que ela ajuizou uma ação buscando uma
            ordem judicial para impedir o cliente de praticar atividade infratora relacionada ao
            material na nossa infraestrutura.
          </p>
          <p>
            O restabelecimento está sujeito a que o serviço ainda esteja ativo e em situação
            regular. O material não pode ser restabelecido a partir de um serviço que tenha sido
            rescindido ou cujos dados já tenham sido excluídos sob as nossas regras de retenção, e
            uma contranotificação não suspende a cobrança, a suspensão por falta de pagamento nem
            qualquer medida de aplicação separada tomada sob a nossa{' '}
            <Link href={siteConfig.paths.acceptableUse}>Política de Uso Aceitável</Link>.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.2 Declaração Falsa em Contranotificação">
          <p>
            As penalidades do 17 U.S.C. &sect;&nbsp;512(f) aplicam-se tanto a contranotificações
            quanto a notificações de remoção. Enviar uma contranotificação que, conscientemente,
            declare de forma materialmente falsa que um material foi removido por engano ou
            identificação equivocada pode expor você à responsabilidade por danos.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="5" title="Política para Infratores Reincidentes">
        <p>
          Conforme exigido pelo 17 U.S.C. &sect;&nbsp;512(i), a WSLATL adotou e implementa
          razoavelmente uma política que prevê o encerramento, em circunstâncias apropriadas, das
          contas de clientes que são infratores reincidentes.
        </p>
        <p>Como implementamos essa política:</p>
        <ul>
          <li>
            <strong>Registramos cada notificação.</strong> Cada
            notificação de remoção em conformidade sobre a qual agimos é registrada na conta do
            cliente responsável pelo serviço afetado.
          </li>
          <li>
            <strong>Avisamos o cliente.</strong> O cliente é
            informado da reclamação, do que foi removido ou desabilitado e de que a reclamação foi
            registrada na conta dele.
          </li>
          <li>
            <strong>Reclamações repetidas escalam.</strong>{' '}
            Novas notificações em conformidade contra a mesma conta levam a medidas crescentes, que
            podem incluir uma advertência formal, a suspensão do serviço afetado e o encerramento
            da conta.
          </li>
          <li>
            <strong>Contranotificações bem-sucedidas não contam.</strong>{' '}
            Uma reclamação que seja retirada, ou que seja resolvida a favor do cliente por meio de
            uma contranotificação sem ação judicial em seguida, não é contada contra a conta.
          </li>
          <li>
            <strong>Casos graves são imediatos.</strong>{' '}
            Quando a violação é flagrante, de escala comercial ou acompanhada de outras violações
            da nossa Política de Uso Aceitável, podemos encerrar uma conta sem esperar por uma nova
            notificação.
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
          O encerramento sob esta seção é um encerramento por justa causa. Conforme exposto na
          nossa{' '}
          <Link href={siteConfig.paths.refund}>Política de Reembolso</Link>,
          serviços rescindidos por violações dos nossos Termos ou da Política de Uso Aceitável não
          são elegíveis para reembolso.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Material Que Não Controlamos">
        <p>
          A WSLATL fornece infraestrutura. Quando um cliente opera o próprio serviço nessa
          infraestrutura e controla o que nela é armazenado, o cliente é a parte responsável pelo
          material. Quando conseguimos identificar o cliente, encaminhamos a sua notificação a ele
          e esperamos que ele aja sobre ela.
        </p>
        <p>
          Para serviços que não hospedamos, incluindo domínios registrados em outro lugar, conteúdo
          entregue por uma rede de terceiros ou contas em plataformas que não operamos, não somos o
          destinatário correto da sua notificação e não podemos remover o material. Por favor,
          dirija a sua notificação ao operador daquele serviço.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Marcas e Outras Reclamações">
        <p>
          Esta política cobre apenas direitos autorais. Reclamações sobre violação de marca,
          difamação, violações de privacidade ou outro conteúdo ilícito devem ser enviadas para{' '}
          <Email name="support" />{' '}
          com uma descrição clara do material, da sua localização e da base legal da sua
          reclamação. Essas reclamações são tratadas sob a nossa{' '}
          <Link href={siteConfig.paths.acceptableUse}>Política de Uso Aceitável</Link>{' '}
          e não sob o DMCA.
        </p>
      </LegalSection>

      <LegalSection number="8" title="Alterações a Esta Política">
        <p>
          Podemos atualizar esta Política de DMCA para refletir mudanças nas nossas práticas ou na
          lei aplicável. Quando fizermos alterações substanciais, atualizaremos a data de vigência
          no topo desta página e publicaremos a política atualizada em{' '}
          <Link href={siteConfig.paths.dmca}>
            {siteConfig.siteUrl}{siteConfig.paths.dmca}
          </Link>.
        </p>
      </LegalSection>

      <LegalSection number="9" title="Contato">
        <p>
          Notificações de direitos autorais e contranotificações devem ir para o agente designado
          listado na Seção 2. Dúvidas gerais sobre esta política podem ser enviadas para:
        </p>
        <CompanyContact />
      </LegalSection>
    </>
  )
}
