import { Link } from '@/components/legal/doc-link'
import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'
import { CompanyContact, ScrollTable, Tier, Tiers } from '@/components/legal/blocks'
import { Email } from '@/components/ui/email'

export default function PrivacyContent() {
  return (
    <>
      <LegalSection number="1" title="Quem Somos">
        <p>
          A WSLATL LLC é uma sociedade de responsabilidade limitada do Missouri que presta serviços
          privados de hospedagem, incluindo servidores dedicados, hospedagem de servidores de jogos,
          hospedagem VPS e hospedagem de sites. As referências a
          &ldquo;WSLATL&rdquo;, &ldquo;nós&rdquo;, &ldquo;nosso&rdquo; ou &ldquo;nos&rdquo; nesta política
          se referem à WSLATL LLC.
        </p>
        <p>
          Esta Política de Privacidade se aplica às informações coletadas pelo nosso site (wslatl.com), pelo
          portal de faturamento (billing.wslatl.com), pelos painéis de hospedagem (panel.wslatl.com, vps.wslatl.com)
          e por todos os serviços e comunicações fornecidos pela WSLATL. Ao usar qualquer um dos nossos
          serviços, você concorda com as práticas descritas nesta política.
        </p>

        <LegalSubSection title="1.1 Controlador e Processador">
          <p>
            A hospedagem envolve dois tipos diferentes de dados, e o nosso papel legal é diferente
            para cada um. A distinção importa, então vale dizer isso com clareza.
          </p>
          <ul>
            <li>
              <strong>Os dados da sua conta.</strong> As
              informações que você nos dá para que possamos abrir e manter a sua conta: o seu nome,
              os seus dados de contato, os registros de faturamento, os tickets de suporte e a
              atividade de painel descrita na Seção 2. Para esses dados, a WSLATL é a{' '}
              <strong>controladora</strong>. Nós decidimos o que
              é coletado e por quê, e esta Política de Privacidade descreve essa decisão.
            </li>
            <li>
              <strong>Os dados que você coloca nos seus próprios serviços.</strong>{' '}
              Tudo o que você ou os seus usuários armazenam em um servidor que hospedamos para você:
              bancos de dados, dados de servidor de jogos, arquivos enviados, conteúdo de site, logs
              de aplicação. Para esses dados, a WSLATL é{' '}
              <strong>processadora</strong>, não a controladora.
              Nós os armazenamos e transmitimos para que o serviço funcione, e não decidimos o que
              você coleta nem por que coleta.
            </li>
          </ul>
          <p>
            Se você hospeda dados pessoais de outras pessoas em um serviço da WSLATL, você é o
            controlador desses dados. As obrigações que vêm com esse papel são suas: ter uma base
            legal para o processamento, dar aviso aos seus próprios usuários, atender aos pedidos
            de exercício de direitos deles e manter o seu próprio registro de atividades de
            processamento. Esta Política de Privacidade não faz nada disso por você, e não é uma
            política de privacidade na qual os seus usuários possam se apoiar.
          </p>
          <p>
            Agimos conforme as suas instruções em relação a esses dados e só os acessamos quando é
            necessário para prestar, manter ou proteger o serviço, ou quando somos legalmente
            obrigados. Se você precisa de um acordo de processamento de dados cobrindo o nosso papel
            como processadora, entre em contato conosco em{' '}
            <Email name="support" />.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="2" title="Informações Que Coletamos">
        <p>Coletamos as seguintes categorias de informação:</p>

        <LegalSubSection title="2.1 Informações de Conta e Cadastro">
          <p>Quando você se inscreve ou cria uma conta, coletamos:</p>
          <ul>
            <li>Nome completo</li>
            <li>Endereço de e-mail</li>
            <li>Endereço de cobrança</li>
            <li>Número de telefone (obrigatório no cadastro, usado para recuperação de conta e para verificar a titularidade da conta)</li>
            <li>Data de nascimento (usada para aplicar os requisitos de idade da Seção 9)</li>
            <li>
              Número de identificação fiscal, quando você fornece um para que possamos faturar para
              você como empresa ou aplicar uma isenção fiscal
            </li>
            <li>Nome de usuário e senha da conta (armazenada como um hash seguro; nunca vemos a sua senha em texto claro)</li>
            <li>
              A identidade da conta do Discord, quando você opta por vincular a sua conta do Discord
              à sua conta WSLATL. O vínculo nos dá o seu ID de usuário, o seu nome de usuário e o
              seu avatar do Discord para que possamos associar você às conversas de suporte e ao
              acesso por cargo no nosso servidor. O vínculo é opcional e pode ser desfeito.
            </li>
            <li>Qualquer informação que você forneça voluntariamente durante o processo de inscrição ou de entrada</li>
          </ul>
          <p>
            Também mantemos um{' '}
            <strong>extrato de crédito na conta</strong>{' '}
            para a sua conta, registrando toda alteração no seu saldo de crédito, incluindo compras
            de recarga, créditos que emitimos, valores aplicados em faturas, presentes enviados ou
            recebidos, e a data, o valor e o motivo de cada lançamento. Esse extrato é retido como
            parte dos seus registros de faturamento. Veja os nossos{' '}
            <Link href={siteConfig.paths.accountCredit}>Termos de Crédito na Conta</Link>{' '}
            para saber como o saldo em si funciona.
          </p>
        </LegalSubSection>

        <LegalSubSection title="2.2 Informações de Faturamento e Pagamento">
          <p>
            Os pagamentos são processados pelo nosso portal de faturamento usando processadores de
            pagamento terceirizados em conformidade com o PCI-DSS. Não armazenamos o número completo
            do seu cartão nem o CVV. Retemos:
          </p>
          <ul>
            <li>Histórico de faturas e registros de faturamento</li>
            <li>Tipo de meio de pagamento (bandeira do cartão, quatro últimos dígitos)</li>
            <li>IDs e datas das transações</li>
            <li>Registros exigidos para contabilidade e conformidade legal</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="2.3 Dados de Serviço e de Uso">
          <p>Quando você usa os nossos serviços de hospedagem, coletamos:</p>
          <ul>
            <li>Endereços IP atribuídos aos seus serviços ou usados por eles</li>
            <li>Utilização de recursos do servidor (CPU, RAM, banda, uso de disco)</li>
            <li>Logs de acesso e de atividade dos painéis de controle e dos dashboards</li>
            <li>Metadados de tráfego de rede (não o conteúdo) usados para detecção de abuso e monitoramento de desempenho</li>
            <li>Logs de atividade de servidor de jogos, incluindo horários de conexão e dados de sessão</li>
            <li>Registros de uptime e de disponibilidade</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="2.4 Dados de Comunicações">
          <p>Quando você fala com a gente, mantemos registros de:</p>
          <ul>
            <li>Tickets de suporte e todo o seu conteúdo</li>
            <li>Comunicações no Discord (mensagens no nosso servidor ou DMs com a nossa equipe)</li>
            <li>Correspondência por e-mail</li>
            <li>Arquivos, capturas de tela ou logs que você compartilha ao buscar suporte</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="2.5 Dados do Site">
          <p>Quando você visita wslatl.com, podemos coletar:</p>
          <ul>
            <li>Endereço IP e região geográfica geral</li>
            <li>Tipo de navegador e sistema operacional</li>
            <li>Páginas visitadas e tempo passado no site</li>
            <li>URL de origem</li>
            <li>Cookies de sessão (veja a Seção 7)</li>
          </ul>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="3" title="Como Usamos as Suas Informações">
        <p>Usamos as informações que coletamos exclusivamente para:</p>
        <ul>
          <li>Provisionar, operar e manter os seus serviços de hospedagem</li>
          <li>Processar pagamentos, gerar faturas e administrar a sua conta de faturamento</li>
          <li>Verificar a sua identidade e impedir a criação fraudulenta de contas</li>
          <li>Responder a pedidos de suporte, perguntas e consultas</li>
          <li>Monitorar o desempenho da rede, o uptime e a saúde da infraestrutura</li>
          <li>Detectar, investigar e prevenir abuso, acesso não autorizado e violações da nossa Política de Uso Aceitável</li>
          <li>Cumprir leis, regulamentos e obrigações legais aplicáveis</li>
          <li>Fazer cumprir os nossos Termos de Serviço</li>
          <li>Enviar comunicações relacionadas ao serviço, como avisos de manutenção, alertas de faturamento e atualizações da conta</li>
          <li>Melhorar os nossos serviços e a nossa infraestrutura com base em padrões de uso</li>
        </ul>
        <p className="font-medium text-foreground">
          Não usamos os seus dados para publicidade. Não vendemos, alugamos nem trocamos as suas
          informações pessoais com nenhum terceiro para nenhuma finalidade comercial.
        </p>
      </LegalSection>

      <LegalSection number="4" title="Como Compartilhamos as Suas Informações">
        <p>
          Compartilhamos as suas informações apenas nas circunstâncias limitadas a seguir, e apenas
          na medida necessária para cada finalidade:
        </p>

        <LegalSubSection title="4.1 Prestadores de Serviço">
          <p>
            Trabalhamos com fornecedores terceirizados que nos ajudam a entregar os nossos serviços.
            Esses fornecedores recebem apenas os dados necessários para desempenhar a sua função e
            são contratualmente obrigados a proteger esses dados. Isso inclui:
          </p>
          <ul>
            <li>Processadores de pagamento (para lidar com as transações de faturamento)</li>
            <li>Parceiros de data center e de infraestrutura (para a hospedagem física dos servidores)</li>
            <li>Provedores de proteção contra bots e abuso, de entrega de conteúdo e de DNS</li>
            <li>Entrega de e-mail para mensagens transacionais como faturas e avisos de conta</li>
            <li>Preenchimento automático de endereço e geocodificação para os formulários de endereço</li>
            <li>Serviços de monitoramento de status (por exemplo, status.wslatl.com)</li>
          </ul>
          <p>
            Publicamos os fornecedores individualmente, não apenas estas categorias. Cada
            subprocessador é nomeado na nossa página de{' '}
            <Link href={siteConfig.paths.subprocessors}>Subprocessadores</Link>,
            junto com para que ele é usado, quais categorias de dados recebe e onde está
            localizado. Essa página é mantida atualizada conforme a nossa infraestrutura muda.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.2 Exigências Legais">
          <p>
            Podemos divulgar as suas informações quando exigido por lei, por ordem judicial válida,
            por intimação ou por pedido lícito de autoridades governamentais. Quando legalmente
            permitido, tentaremos avisar você antes de atender a esses pedidos.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.3 Prevenção de Abuso e Autoridades Policiais">
          <p>
            Podemos compartilhar endereços IP, logs de rede ou outros dados técnicos com:
          </p>
          <ul>
            <li>Outros provedores de hospedagem que investigam abuso originado da nossa rede</li>
            <li>Registros de abuso (por exemplo, AbuseIPDB) ao tratar de abuso de rede confirmado</li>
            <li>Órgãos policiais que investigam atividade ilegal</li>
            <li>O NCMEC ou outras autoridades em casos que envolvam a segurança de crianças</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="4.4 Transferências Empresariais">
          <p>
            Se a WSLATL LLC for adquirida, incorporada a outra entidade ou passar por uma transição
            empresarial significativa, as suas informações podem ser transferidas como parte dessa
            transação. Avisaremos os clientes ativos por e-mail sobre qualquer mudança desse tipo
            antes que ela ocorra.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.5 Transferências Internacionais">
          <p>
            A WSLATL LLC está estabelecida no Estado do Missouri, Estados Unidos, e os nossos
            serviços são operados a partir dos Estados Unidos. Se você está localizado no Espaço
            Econômico Europeu, no Reino Unido ou na Suíça, usar os nossos serviços significa que os
            seus dados pessoais são transferidos para os Estados Unidos e, quando um subprocessador
            opera uma rede global, potencialmente para outros países.
          </p>
          <p>
            Os Estados Unidos não são cobertos por uma decisão geral de adequação aplicável a todos
            os destinatários. Quando transferimos dados pessoais para fora do EEE ou do Reino Unido,
            apoiamo-nos no fato de a transferência ser necessária para executar o contrato que você
            nos pediu para executar e nas Standard Contractual Clauses da Comissão Europeia, junto
            com o UK International Data Transfer Addendum, quando um subprocessador as oferece.
          </p>
          <p>
            Os mecanismos que se aplicam a cada destinatário, e mais detalhes sobre a nossa posição
            quanto a transferências, estão expostos na nossa página de{' '}
            <Link href={siteConfig.paths.subprocessors}>Subprocessadores</Link>.
            Se você precisa de um acordo de processamento de dados ou de uma cópia das cláusulas
            conforme as aplicamos, entre em contato conosco em{' '}
            <Email name="support" />.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="5" title="Retenção de Dados">
        <p>Retemos os seus dados pelos seguintes períodos:</p>
        <ScrollTable label="Períodos de retenção de dados">
          <table className="legal-table">
            <thead>
              <tr>
                <th scope="col">Tipo de dado</th>
                <th scope="col">Período de retenção</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Registros de conta</td>
                <td>Duração da conta + 3 anos</td>
              </tr>
              <tr>
                <td>Registros de faturamento</td>
                <td>7 anos (exigências fiscais e legais)</td>
              </tr>
              <tr>
                <td>Logs de servidor e de rede</td>
                <td>Até 90 dias (mais, se necessário para uma investigação ativa)</td>
              </tr>
              <tr>
                <td>Comunicações de suporte</td>
                <td>2 anos desde a última interação</td>
              </tr>
              <tr>
                <td>Dados após a rescisão</td>
                <td>Recuperáveis mediante pedido por até 14 dias após a rescisão; excluídos ou anonimizados em no máximo 90 dias após o encerramento da conta (os dados de serviço são removidos antes, conforme a Seção 9.3 dos Termos de Serviço)</td>
              </tr>
            </tbody>
          </table>
        </ScrollTable>
        <p>
          Os dados podem ser retidos além desses períodos se exigido pela lei aplicável, por um
          processo judicial em andamento ou por uma disputa comercial legítima.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Segurança dos Dados">
        <p>
          Proteger os seus dados é uma responsabilidade central que levamos a sério. As nossas
          medidas de segurança incluem:
        </p>
        <ul>
          <li>Criptografia de dados sensíveis em repouso e em trânsito (HTTPS/TLS em todos os painéis e portais)</li>
          <li>Armazenamento de senhas com hash e salt: senhas em texto claro nunca são armazenadas nem ficam visíveis para nós</li>
          <li>Controles internos de acesso rigorosos que limitam quem na nossa equipe pode ver os dados dos clientes</li>
          <li>Revisão e hardening regulares da nossa infraestrutura de hospedagem</li>
          <li>Monitoramento de padrões de acesso incomuns e de possíveis invasões</li>
        </ul>
        <p>
          Nenhuma transmissão pela internet é 100% segura. Embora usemos proteções padrão do setor,
          não podemos garantir segurança absoluta. Se você acredita que a sua conta foi
          comprometida, fale com a gente imediatamente em{' '}
          <Email name="support" />.
        </p>
        <p>
          Em caso de violação de dados que afete as suas informações, avisaremos você de acordo com
          a lei aplicável, incluindo o estatuto de notificação de violação de dados do Missouri
          (Mo. Rev. Stat. &sect;&nbsp;407.1500), com a maior rapidez que as circunstâncias
          permitirem.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Cookies">
        <p>
          Usamos cookies de forma mínima e apenas quando necessário. O nosso uso de cookies inclui:
        </p>
        <ul>
          <li>
            <strong>Cookies de sessão:</strong> Necessários para
            manter você conectado ao nosso portal de faturamento e aos painéis de hospedagem. Eles
            expiram quando você fecha o navegador ou sai da conta.
          </li>
          <li>
            <strong>Cookies de preferência:</strong> Podem
            armazenar preferências de exibição ou configurações que você escolheu dentro dos nossos
            painéis.
          </li>
        </ul>
        <p>
          Não usamos cookies de publicidade de terceiros, pixels de rastreamento nem ferramentas de
          análise comportamental em wslatl.com. Você pode gerenciar ou desativar cookies nas
          configurações do seu navegador, mas fazer isso pode afetar o funcionamento de áreas
          autenticadas, como o nosso portal de faturamento e os painéis de hospedagem.
        </p>
      </LegalSection>

      <LegalSection number="8" title="Os Seus Direitos e Escolhas">
        <p>
          Dependendo de onde você está, você pode ter os seguintes direitos em relação aos seus
          dados pessoais:
        </p>
        <ul>
          <li><strong>Acesso:</strong> Pedir uma cópia dos dados pessoais que mantemos sobre você.</li>
          <li><strong>Correção:</strong> Pedir que corrijamos dados imprecisos ou incompletos.</li>
          <li><strong>Exclusão:</strong> Pedir a exclusão dos seus dados pessoais, sujeita às exigências legais de retenção.</li>
          <li><strong>Portabilidade:</strong> Pedir os seus dados em um formato estruturado e legível por máquina.</li>
          <li><strong>Restrição:</strong> Pedir que limitemos a forma como processamos os seus dados.</li>
          <li><strong>Oposição:</strong> Opor-se a certos tipos de processamento de dados.</li>
        </ul>
        <p>
          Para exercer qualquer um desses direitos, entre em contato conosco em{' '}
          <Email name="support" />.
          Responderemos em até 30 dias. Podemos precisar verificar a sua identidade antes de processar o seu pedido.
        </p>
        <p>
          <strong>Residentes da Califórnia</strong> podem ter
          direitos adicionais sob a California Consumer Privacy Act (CCPA) e a California Privacy Rights Act (CPRA),
          incluindo o direito de saber quais informações pessoais são vendidas ou compartilhadas e o direito de optar por não participar.
          Não vendemos informações pessoais, portanto os direitos de opt-out sob a CCPA não se aplicam.
        </p>
        <p>
          <strong>Residentes do EEE e do Reino Unido</strong> têm direitos sob o
          GDPR e o UK GDPR, incluindo os direitos listados acima. A nossa base legal para processar os seus dados
          é principalmente a execução de um contrato (prestar os serviços que você pediu) e o cumprimento
          de obrigações legais. As transferências dos seus dados para fora do EEE ou do Reino Unido estão descritas na
          Seção 4.5.
        </p>

        <LegalSubSection title="8.1 Direito de Reclamar a uma Autoridade de Controle">
          <p>
            Se você está no Espaço Econômico Europeu, no Reino Unido ou na Suíça, você tem o
            direito, sob o Artigo 77 do GDPR e a disposição equivalente do UK GDPR, de apresentar
            uma reclamação a uma autoridade de controle de proteção de dados. Você pode reclamar à
            autoridade do país onde mora, onde trabalha ou onde acredita que o problema ocorreu.
          </p>
          <p>
            No Reino Unido, essa autoridade é o Information Commissioner&rsquo;s Office. No EEE,
            cada Estado-membro tem a sua própria autoridade, e o European Data Protection Board
            publica a lista atual.
          </p>
          <p>
            Você não precisa nos procurar primeiro, e exercer esse direito não afeta nenhuma outra
            medida disponível para você. Dito isso, preferimos sinceramente ouvir sobre um problema
            diretamente. Escreva para{' '}
            <Email name="support" />{' '}
            e levaremos a sério.
          </p>
        </LegalSubSection>

        <LegalSubSection title="8.2 Pedidos sobre Dados no Serviço de Outra Pessoa">
          <p>
            Se os seus dados pessoais estão em um serviço que um cliente da WSLATL opera na nossa
            infraestrutura, somos processadores desses dados e não controladores, como explicado na
            Seção 1.1. Em geral, não conseguimos acessá-los, corrigi-los nem excluí-los a seu
            pedido, porque não cabe a nós decidir sobre eles.
          </p>
          <p>
            Dirija o seu pedido ao operador do serviço que você usou. Se você não conseguir
            identificá-lo ou contatá-lo, fale com a gente e encaminharemos o seu pedido ao cliente
            sempre que pudermos razoavelmente fazê-lo.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="9" title="Requisitos de Idade e Privacidade de Crianças">
        <p>Temos uma política de idade rigorosa em três níveis que se aplica ao nosso site, ao portal de faturamento e a todos os serviços de hospedagem:</p>

        <Tiers>
          <Tier tone="critical" title="Menores de 13 anos: não permitido">
            Menores de 13 anos estão estritamente proibidos de usar qualquer serviço da WSLATL,
            incluindo o nosso site, o portal de faturamento e os painéis de hospedagem. Não
            coletamos conscientemente informações pessoais de ninguém com menos de 13 anos. Se
            descobrirmos ou formos avisados de que um usuário tem menos de 13 anos, a conta dele
            será banida imediata e permanentemente e todos os dados associados serão excluídos.
            Levamos isso a sério e temos tolerância zero com o acesso abaixo da idade mínima.
          </Tier>
          <Tier tone="caution" title="De 13 a 17 anos: permitido com consentimento de um adulto">
            Recebemos usuários de 13 a 17 anos, mas um pai, mãe ou responsável legal precisa dar
            consentimento explícito antes de a conta ser usada. Ao se cadastrar ou usar os nossos
            serviços, os usuários nessa faixa etária confirmam que um pai, mãe ou responsável
            analisou e concordou com os nossos Termos de Serviço, com a Política de Privacidade e
            com a Política de Uso Aceitável em nome deles. O adulto que consente assume
            responsabilidade total pela atividade da conta do menor e por quaisquer cobranças
            associadas. Se descobrirmos que uma conta nessa faixa etária foi criada sem o
            consentimento de um adulto, suspenderemos a conta até que um consentimento válido seja
            fornecido.
          </Tier>
          <Tier tone="good" title="18 anos ou mais: totalmente permitido">
            Adultos com 18 anos ou mais podem se cadastrar e usar os nossos serviços sem nenhum
            requisito adicional de consentimento, sujeito à aprovação da conta sob o nosso modelo
            somente por inscrição e ao cumprimento dos nossos Termos e da Política de Uso Aceitável.
          </Tier>
        </Tiers>

        <p>
          Se você é pai, mãe ou responsável e acredita que o seu filho com menos de 13 anos se
          cadastrou conosco ou nos forneceu informações pessoais sem o seu conhecimento, fale com a
          gente imediatamente em{' '}
          <Email name="support" />.
          Removeremos permanentemente a conta e todos os dados associados o mais rápido possível.
        </p>
      </LegalSection>

      <LegalSection number="10" title="Links e Serviços de Terceiros">
        <p>
          O nosso site e os nossos painéis podem conter links para serviços de terceiros ou
          integrações com eles, incluindo Discord, GitHub e outros. Esta Política de Privacidade não
          se aplica a esses serviços de terceiros. Recomendamos que você leia as políticas de
          privacidade de qualquer serviço de terceiros que use em conexão com a nossa plataforma.
          Não somos responsáveis pelas práticas de privacidade de terceiros.
        </p>
      </LegalSection>

      <LegalSection number="11" title="Alterações a Esta Política">
        <p>
          Podemos atualizar esta Política de Privacidade de tempos em tempos para refletir mudanças
          nas nossas práticas, nas exigências legais ou nos nossos serviços. Quando fizermos
          alterações substanciais, vamos:
        </p>
        <ul>
          <li>Atualizar a data de vigência mostrada no topo desta página</li>
          <li>Avisar os clientes ativos por e-mail com um resumo do que mudou</li>
          <li>Publicar a política atualizada em {siteConfig.paths.privacy}</li>
        </ul>
        <p>
          O seu uso continuado dos nossos serviços após a data de vigência de qualquer alteração
          constitui a sua aceitação da Política de Privacidade atualizada. Se você discordar de
          alterações substanciais, pode cancelar o seu serviço antes da data de vigência.
        </p>
      </LegalSection>

      <LegalSection number="12" title="Fale Conosco">
        <p>
          Dúvidas, preocupações ou pedidos relacionados a esta Política de Privacidade devem ser
          dirigidos a:
        </p>
        <CompanyContact />
      </LegalSection>
    </>
  )
}
