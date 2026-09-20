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
      <LegalSection number="1" title="Visão Geral e Escopo">
        <p>
          Esta Política de Reembolso rege todos os pedidos de reembolso de serviços prestados pela
          WSLATL LLC (&ldquo;WSLATL&rdquo;, &ldquo;nós&rdquo;, &ldquo;nosso&rdquo; ou &ldquo;nos&rdquo;).
          Ela se aplica a servidores dedicados, hospedagem de servidores de jogos, hospedagem VPS e
          serviços de hospedagem de sites.
        </p>
        <p>
          Esta política é incorporada aos nossos{' '}
          <Link href={siteConfig.paths.terms}>Termos de Serviço</Link> e deles passa a fazer parte por referência.
          As regras abaixo são a fonte oficial sobre elegibilidade, prazos e processamento de
          reembolsos. Em caso de qualquer conflito entre esta Política de Reembolso e qualquer outro
          documento da WSLATL, prevalece esta Política de Reembolso.
        </p>
        <p>
          Somos uma empresa de hospedagem pequena e privada. Esta política existe para ser justa,
          não para criar disputa. Sempre trataremos os pedidos de reembolso com honestidade e
          boa-fé. Se algo não estiver coberto abaixo, fale com a gente e resolveremos com você
          diretamente.
        </p>
      </LegalSection>

      <LegalSection number="2" title="Prazos de Reembolso">
        <p>
          Operamos um prazo de reembolso em dois níveis, contado a partir da data da sua compra
          inicial do serviço. Os dois níveis estão resumidos abaixo:
        </p>

        <ScrollTable label="Prazos de reembolso">
          <table className="legal-table">
            <thead>
              <tr>
                <th scope="col">Prazo</th>
                <th scope="col">Elegibilidade</th>
                <th scope="col">Valor do reembolso</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium text-foreground">0 a 48 horas</td>
                <td>Qualquer motivo, inclusive arrependimento. Sem perguntas.</td>
                <td>Reembolso integral</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">49 horas a 14 dias</td>
                <td>Caso a caso. Só se aplicam os motivos elegíveis listados na Seção 3.</td>
                <td>Reembolso integral para serviços elegíveis</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Depois de 14 dias</td>
                <td>Sem reembolsos.</td>
                <td>Nenhum</td>
              </tr>
            </tbody>
          </table>
        </ScrollTable>

        <p>
          A <strong>data da compra inicial</strong> é a data em
          que o serviço foi ativado e provisionado para você pela primeira vez, não a data de
          qualquer renovação posterior. As renovações reiniciam o seu próprio prazo de 14 dias (veja
          a Seção 9).
        </p>

        <LegalSubSection title="2.1 Prazo de 48 Horas, Qualquer Motivo">
          <p>
            Se você pedir um reembolso dentro de{' '}
            <strong>48 horas</strong> da data da compra inicial
            de um serviço, emitiremos um reembolso integral. Este é o prazo de arrependimento. Não
            exigiremos um motivo e não pediremos que você justifique a sua decisão.
          </p>
          <p>
            Os itens listados na Seção 5 (Itens Não Reembolsáveis) ficam excluídos mesmo dentro do
            prazo de 48 horas. Em particular, os servidores dedicados não são reembolsáveis em
            nenhuma circunstância (veja a Seção 5.1).
          </p>
        </LegalSubSection>

        <LegalSubSection title="2.2 Prazo de 14 Dias, Caso a Caso">
          <p>
            Entre <strong>49 horas e 14 dias corridos</strong>{' '}
            da data da compra inicial, os reembolsos integrais são emitidos apenas pelos motivos
            elegíveis específicos listados na Seção 3. Pedidos de reembolso fora desses motivos não
            são elegíveis durante este prazo.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="3" title="Motivos Elegíveis (Prazo de 14 Dias)">
        <p>
          Os motivos a seguir dão direito a um reembolso integral durante o prazo de 14 dias
          analisado caso a caso. Podemos pedir que você forneça informações de apoio (horários,
          mensagens de erro, histórico de tickets etc.) para verificar o motivo.
        </p>

        <LegalSubSection title="3.1 Interrupção de Serviço Que Ultrapassa o SLA">
          <p>
            Se o seu serviço sofrer uma interrupção que ultrapasse a meta de uptime aplicável no
            nosso{' '}
            <Link href={siteConfig.paths.sla}>Acordo de Nível de Serviço</Link>{' '}
            ({uptimeTarget('vps')} para hospedagem VPS e de sites, {uptimeTarget('game')} para hospedagem de servidores de jogos), você pode pedir um
            reembolso integral do serviço afetado. Interrupções causadas por eventos fora do nosso
            controle razoável (força maior) não se qualificam.
          </p>
          <p>
            Para se qualificar, a interrupção precisa ser verificável pela nossa página de status,
            pelos nossos sistemas de monitoramento ou por provas documentadas por você. O crédito de
            SLA de 10% descrito no Acordo de Nível de Serviço continua disponível como uma reparação
            separada; este direito a reembolso soma-se a ele, não o substitui.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.2 Erro de Faturamento">
          <p>
            Se você foi cobrado em um valor incorreto, cobrado em duplicidade ou cobrado por um
            serviço que não autorizou, você tem direito ao reembolso integral da cobrança indevida.
            Isso se aplica independentemente do prazo em que o erro for descoberto. Por favor,
            relate suspeitas de erro de faturamento assim que você as notar.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.3 O Serviço Não Funcionou">
          <p>
            Se o serviço que você comprou nunca funcionou ou teve um defeito crítico que não
            conseguimos resolver, você pode ter direito a um reembolso integral.
          </p>
          <p>
            <strong>Você precisa ter falado com a gente antes.</strong>{' '}
            Para se qualificar sob esta seção, você precisa ter feito um esforço razoável para nos
            procurar sobre o problema antes de pedir o reembolso. Os canais de contato aceitáveis
            são:
          </p>
          <ul>
            <li>Um ticket de suporte aberto no nosso portal de faturamento</li>
            <li>Um e-mail para <Email name="support" /></li>
            <li>Uma mensagem no nosso servidor do Discord ou uma DM para a nossa equipe</li>
          </ul>
          <p>
            Precisamos ver provas do contato (um número de ticket, uma conversa de e-mail ou um
            registro de mensagens) para confirmar que tivemos a chance de diagnosticar e corrigir o
            problema. Pedidos de reembolso com esse fundamento sem nenhuma tentativa de contato
            anterior serão recusados.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="4" title="Arrependimento">
        <p>
          O arrependimento é um motivo elegível apenas dentro do prazo de 48 horas descrito na
          Seção 2.1. Depois de decorridas 48 horas da data da compra inicial, o arrependimento não
          é um motivo elegível para reembolso sob esta política.
        </p>
        <p>
          Se você não tem certeza se um serviço é certo para você, recomendamos fortemente que fale
          com a gente no Discord antes de comprar. Teremos prazer em responder dúvidas técnicas e
          ajudar você a escolher o plano certo. O processo de entrada somente por inscrição também
          é uma boa oportunidade para tirar dúvidas e confirmar se faz sentido.
        </p>
      </LegalSection>

      <LegalSection number="5" title="Itens Não Reembolsáveis">
        <p>
          Os itens a seguir <strong>não são reembolsáveis</strong>{' '}
          em nenhuma circunstância. Esta lista se aplica tanto ao prazo de 48 horas quanto ao de 14
          dias.
        </p>

        <Callout tone="critical" title="5.1 Servidores Dedicados">
          Os servidores dedicados não são elegíveis para reembolsos de nenhum tipo, a qualquer
          momento, por qualquer motivo. A aquisição de hardware, as alocações de IP, o espaço em
          rack no data center e os compromissos de banda são feitos na premissa de uma ocupação de
          longo prazo. Esta exclusão se aplica mesmo dentro do prazo de arrependimento de 48 horas.
        </Callout>

        <ul>
          <li>
            <strong>Taxas de instalação e provisionamento personalizado:</strong>{' '}
            Taxas de instalação pagas uma única vez, instalação do sistema operacional, trabalho de
            configuração personalizada, migrações manuais e cobranças não recorrentes semelhantes.
            Elas cobrem mão de obra e recursos que não podem ser recuperados depois de executados.
          </li>
          <li>
            <strong>Taxas de licença de terceiros:</strong>{' '}
            Custos repassados que não conseguimos recuperar do fornecedor, incluindo licenças do
            cPanel, o licenciamento do Pterodactyl e outros softwares que revendemos como parte de
            um plano.
          </li>
          <li>
            <strong>Taxas de registro e renovação de domínio:</strong>{' '}
            Quaisquer cobranças relacionadas a domínio feitas por nosso intermédio. Os registros de
            domínio passam por um registrador e são regidos pelos termos de reembolso do próprio
            registrador.
          </li>
          <li>
            <strong>Adicionais já consumidos:</strong>{' '}
            Endereços IP adicionais, excedentes de banda, restaurações de backup e quaisquer outras
            cobranças de adicionais por consumo ou de cobrança única que já tenham sido entregues ou
            incorridas no momento do pedido de reembolso.
          </li>
          <li>
            <strong>Serviços rescindidos por violação da Política de Uso Aceitável ou dos Termos:</strong>{' '}
            Se o seu serviço foi suspenso ou rescindido por violação da nossa{' '}
            <Link href={siteConfig.paths.acceptableUse}>Política de Uso Aceitável</Link>{' '}
            ou dos Termos de Serviço, nenhum reembolso será emitido. Isso se aplica mesmo que a
            rescisão tenha ocorrido dentro de 48 horas ou dentro do prazo de 14 dias.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="6" title="Como Pedir um Reembolso">
        <p>
          Para pedir um reembolso, fale com a gente por qualquer um dos canais abaixo. O ticket no
          portal de faturamento é o preferido porque nos dá o acesso mais direto à sua conta e ao
          seu histórico de faturas.
        </p>
        <ul>
          <li>
            <strong>Ticket no portal de faturamento:</strong> Entre em{' '}
            <ShortLink name="billing" />{' '}
            e abra um ticket de suporte
          </li>
          <li>
            <strong>E-mail:</strong>{' '}
            <Email name="support" />
          </li>
          <li>
            <strong>Discord:</strong>{' '}
            <ShortLink name="discord" />
          </li>
        </ul>
        <p>
          Para nos ajudar a processar o seu pedido rapidamente, inclua:
        </p>
        <ul>
          <li>O endereço de e-mail da sua conta WSLATL</li>
          <li>O serviço para o qual você está pedindo reembolso</li>
          <li>O número (ou os números) da fatura envolvida</li>
          <li>O motivo do reembolso</li>
          <li>Quaisquer provas de apoio (números de ticket, logs de erro, capturas de tela) para pedidos da Seção 3</li>
        </ul>
        <p>
          Os pedidos de reembolso costumam ser analisados em até{' '}
          <strong>5 dias úteis</strong> do recebimento.
          Responderemos a você com uma decisão e, se aprovada, com uma estimativa de prazo de
          processamento.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Processamento e Forma">
        <p>
          Um reembolso aprovado é emitido de uma de duas formas: de volta ao meio de pagamento
          original ou como crédito na conta. Diremos a você qual forma se aplica quando aprovarmos o
          seu pedido.
        </p>

        <LegalSubSection title="7.1 Reembolso ao Meio de Pagamento Original">
          <p>
            Quando um reembolso é devolvido ao seu meio de pagamento, ele vai para o{' '}
            <strong>meio de pagamento original</strong> usado na
            compra. Não reembolsamos em um cartão ou conta diferente daquele originalmente cobrado.
          </p>
          <p>
            Depois que emitimos o reembolso, o tempo de processamento depende do seu provedor de
            pagamento:
          </p>
          <ul>
            <li>Reembolsos em cartão de crédito e de débito costumam aparecer em <strong>5 a 10 dias úteis</strong>, dependendo do emissor</li>
            <li>Reembolsos por transferência bancária e ACH podem levar até 10 dias úteis</li>
            <li>Reembolsos por qualquer outra plataforma de pagamento que aceitamos estão sujeitos ao tempo de processamento daquela plataforma</li>
          </ul>
          <p>
            Se um reembolso não tiver aparecido no seu extrato depois de 15 dias úteis, fale com a
            gente e investigaremos junto ao processador de pagamento.
          </p>
        </LegalSubSection>

        <LegalSubSection title="7.2 Reembolso como Crédito na Conta">
          <p>
            Em vez disso, podemos aprovar um reembolso como{' '}
            <strong>crédito na conta</strong>, adicionado ao
            saldo da sua conta WSLATL. O crédito na conta pode ser gasto em qualquer fatura da
            WSLATL e não expira, mas{' '}
            <strong>não é resgatável em dinheiro</strong> e não
            pode ser sacado para uma conta bancária ou cartão. Os termos completos estão na nossa
            página de{' '}
            <Link href={siteConfig.paths.accountCredit}>Crédito na Conta</Link>.
          </p>
          <p>
            O crédito na conta é o resultado apropriado em situações como estas:
          </p>
          <ul>
            <li>Você pediu crédito em vez de dinheiro de volta, porque pretende continuar hospedando com a gente</li>
            <li>O meio de pagamento original está encerrado, expirado ou não consegue mais aceitar uma devolução</li>
            <li>A cobrança original já havia sido quitada com crédito na conta</li>
            <li>A cobrança é antiga o bastante para que o processador de pagamento não a estorne mais</li>
          </ul>
          <p>
            Quando você tem direito a um reembolso e pediu que ele voltasse para o seu meio de
            pagamento, não vamos empurrar crédito como substituto só porque é mais conveniente para
            nós. Se propusermos crédito e você preferir receber o dinheiro de volta, diga, e
            conversaremos sobre isso.
          </p>
        </LegalSubSection>

        <LegalSubSection title="7.3 Os Reembolsos Não São Proporcionais">
          <p>
            Os reembolsos sob esta política são emitidos{' '}
            <strong>apenas por períodos de cobrança inteiros</strong>. Não
            calculamos um reembolso parcial com base no número de dias em que você usou o serviço
            antes de pedir o reembolso. Um pedido elegível dentro de um prazo elegível é reembolsado
            integralmente pelo período em questão, e um pedido fora desses prazos não é reembolsado
            de forma alguma.
          </p>
          <p>
            Isso vale para os dois lados e é proposital. Você não é penalizado pelos dias que usou
            dentro do prazo de reembolso e, da mesma forma, não pode recuperar parte de um mês
            cancelando no meio de um período. Conforme indicado na Seção 9.1 dos nossos{' '}
            <Link href={siteConfig.paths.terms}>Termos de Serviço</Link>,
            nenhum reembolso é emitido pelos dias restantes de um período de cobrança cancelado, a
            menos que esta política se aplique.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="8" title="Cancelamento do Serviço no Reembolso">
        <p>
          Quando um reembolso é aprovado, o serviço associado é rescindido como parte do processo de
          reembolso. O acesso ao serviço e a quaisquer painéis associados é revogado assim que o
          reembolso é processado.
        </p>
        <p>
          Após a rescisão, aplicam-se as regras de retenção de dados da Seção 9.3 dos nossos Termos
          de Serviço. Os seus dados podem ser recuperados mediante pedido por um prazo limitado de
          até{' '}
          <strong>14 dias</strong> após a rescisão; depois desse
          prazo, quaisquer dados remanescentes são excluídos de forma permanente e irreversível e,
          em todos os casos, em no máximo 90 dias após o encerramento da conta. Se você quiser
          tentar recuperar dados de um serviço reembolsado, precisa pedir isso dentro desse prazo de
          recuperação de 14 dias.
        </p>
        <p>
          A WSLATL não se responsabiliza por qualquer perda de dados decorrente de uma rescisão
          iniciada por reembolso.
        </p>
      </LegalSection>

      <LegalSection number="9" title="Renovações e Cobrança Automática">
        <p>
          Os prazos de 14 dias desta política são contados a partir da data da compra inicial. Para
          serviços em ciclos de cobrança recorrente, cada pagamento de renovação abre um novo prazo
          de 14 dias contado a partir da data daquela renovação.
        </p>
        <p>
          Se você não quer que um serviço seja renovado, precisa cancelá-lo antes da data de
          renovação. Não reembolsaremos uma cobrança renovada automaticamente só porque você esqueceu
          de cancelar. No entanto, se você falar com a gente dentro de 14 dias de uma renovação
          inesperada, avaliaremos o pedido sob a Seção 3 (Motivos Elegíveis) da mesma forma que
          qualquer outra compra.
        </p>
        <p>
          Enviamos lembretes de fatura antes das renovações automáticas. Se você está recebendo
          renovações que não pretendia, fale com a gente imediatamente em{' '}
          <Email name="support" />{' '}
          e resolveremos isso.
        </p>
      </LegalSection>

      <LegalSection number="10" title="Proteção contra Abuso e Fraude">
        <p>
          Esta Política de Reembolso existe para proteger clientes legítimos. Para evitar abuso,
          reservamo-nos o direito de recusar pedidos de reembolso quando houver indícios de
          comportamento coordenado ou repetido de busca por reembolsos, incluindo, entre outros:
        </p>
        <ul>
          <li>Ciclos repetidos de cadastro, reembolso e novo cadastro nas mesmas contas ou em contas relacionadas</li>
          <li>Pedidos de reembolso coordenados em várias contas sob a mesma titularidade</li>
          <li>Uso de informações falsas durante a inscrição ou os pedidos de reembolso</li>
          <li>Pedidos de reembolso ligados a meios de pagamento fraudulentos ou a chargebacks</li>
        </ul>
        <p>
          Se um reembolso for negado sob esta seção, explicaremos o motivo por escrito. Em casos de
          abuso confirmado, também pode haver encerramento da conta.
        </p>
      </LegalSection>

      <LegalSection number="11" title="Alterações a Esta Política">
        <p>
          Podemos atualizar esta Política de Reembolso de tempos em tempos para refletir mudanças
          nas nossas práticas, nas exigências legais ou nos nossos serviços. Quando fizermos
          alterações substanciais, vamos:
        </p>
        <ul>
          <li>Atualizar a data de vigência mostrada no topo desta página</li>
          <li>Avisar os clientes ativos por e-mail com um resumo do que mudou</li>
          <li>Publicar a política atualizada em {siteConfig.paths.refund}</li>
        </ul>
        <p>
          Os pedidos de reembolso enviados antes da data de vigência de qualquer alteração serão
          avaliados sob a versão da política em vigor no momento do pedido. O seu uso continuado dos
          nossos serviços após a data de vigência de qualquer alteração constitui a sua aceitação da
          Política de Reembolso atualizada.
        </p>
      </LegalSection>

      <LegalSection number="12" title="Contato">
        <p>
          Dúvidas sobre esta Política de Reembolso, sobre o andamento de um pedido de reembolso ou
          sobre qualquer outra coisa relacionada a faturamento devem ser dirigidas a:
        </p>
        <CompanyContact />
      </LegalSection>
    </>
  )
}
