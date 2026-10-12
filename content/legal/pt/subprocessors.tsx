import { Link } from '@/components/legal/doc-link'
import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'
import { Callout, CompanyContact, ScrollTable } from '@/components/legal/blocks'
import { Email } from '@/components/ui/email'

export default function SubprocessorsContent() {
  return (
    <>
      <LegalSection number="1" title="Visão Geral e Escopo">
        <p>
          Esta página lista os terceiros que processam dados pessoais em nome da WSLATL LLC
          (&ldquo;WSLATL&rdquo;, &ldquo;nós&rdquo;, &ldquo;nosso&rdquo; ou &ldquo;nos&rdquo;) para
          que possamos operar o nosso site, o portal de faturamento, os painéis de hospedagem e os
          canais de suporte. Ela complementa a Seção 4.1 da nossa{' '}
          <Link href={siteConfig.paths.privacy}>Política de Privacidade</Link>,
          que descreve esses destinatários apenas por categoria.
        </p>
        <p>
          Um subprocessador é uma empresa que contratamos e que pode lidar com dados pessoais ao nos
          prestar um serviço. Cada uma recebe apenas os dados necessários para a sua função. Não
          vendemos dados pessoais e não os compartilhamos para publicidade.
        </p>
        <p>
          Esta lista cobre o processamento realizado pela WSLATL. Ela não cobre serviços que você
          escolhe instalar e executar por conta própria em um servidor que hospedamos para você.
          Para esses dados, veja a Seção 5 abaixo.
        </p>
      </LegalSection>

      <LegalSection number="2" title="Subprocessadores">
        <p>
          Os terceiros a seguir podem processar dados pessoais em nosso nome. A coluna
          &ldquo;Localização&rdquo; descreve onde o fornecedor está estabelecido e, quando
          relevante, a abrangência geral da infraestrutura que ele utiliza.
        </p>

        <ScrollTable label="Subprocessadores">
          <table className="legal-table">
            <thead>
              <tr>
                <th scope="col">Subprocessador</th>
                <th scope="col">Finalidade</th>
                <th scope="col">Categorias de dados</th>
                <th scope="col">Localização</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium text-foreground">Stripe</td>
                <td>Processamento de pagamentos com cartão e faturamento no portal do cliente</td>
                <td>Nome, endereço de e-mail, endereço de cobrança, dados do cartão de pagamento, registros de transações, endereço IP</td>
                <td>Estados Unidos, com processamento global</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">PayPal</td>
                <td>Processamento de pagamentos alternativo no portal do cliente</td>
                <td>Nome, endereço de e-mail, identificadores da conta PayPal, registros de transações</td>
                <td>Estados Unidos, com processamento global</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Cloudflare (Turnstile)</td>
                <td>Proteção contra bots e abuso no cadastro, no login e em outros formulários públicos</td>
                <td>Endereço IP, sinais de navegador e de dispositivo, tokens de desafio</td>
                <td>Estados Unidos, com uma rede de edge global</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Cloudflare (CDN e DNS)</td>
                <td>Entrega de conteúdo, resolução de DNS e proteção contra negação de serviço para os nossos sites públicos</td>
                <td>Endereço IP, metadados de requisição, cabeçalhos HTTP, dados de conexão TLS</td>
                <td>Estados Unidos, com uma rede de edge global</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Gateway de e-mail da WSLATL (smtp.wslatl.com)</td>
                <td>Entrega de e-mails transacionais como faturas, avisos de conta e redefinições de senha</td>
                <td>Nome, endereço de e-mail e o conteúdo das mensagens que enviamos a você</td>
                <td>Operado pela WSLATL na sua própria infraestrutura</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Pterodactyl</td>
                <td>Painel de controle de servidores de jogos usado para provisionar e gerenciar a hospedagem de jogos</td>
                <td>Identificadores de conta, endereço de e-mail, configuração do servidor, logs de atividade do painel</td>
                <td>Software de código aberto operado pela WSLATL na sua própria infraestrutura</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">VirtFusion</td>
                <td>Painel de controle de VPS usado para provisionar e gerenciar servidores virtuais</td>
                <td>Identificadores de conta, endereço de e-mail, configuração do VPS, alocações de IP, logs de atividade do painel</td>
                <td>Software licenciado operado pela WSLATL na sua própria infraestrutura; o acesso do suporte do fornecedor é possível durante a resolução de problemas</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Parceiro(s) de data center</td>
                <td>Hospedagem física, espaço em rack, energia e trânsito de rede para os nossos servidores</td>
                <td>Custódia física dos servidores e, portanto, de quaisquer dados armazenados neles</td>
                <td>Veja a nota abaixo</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">jsDelivr e cdnjs</td>
                <td>Entrega de bibliotecas de front-end comuns usadas pelos nossos painéis</td>
                <td>Endereço IP, user agent e metadados de requisição, enviados pelo seu navegador quando ele carrega um recurso</td>
                <td>Redes de CDN públicas com nós de edge distribuídos globalmente</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Photon (dados do OpenStreetMap)</td>
                <td>Sugestões de preenchimento automático de endereço nos formulários de cadastro e de perfil</td>
                <td>O texto parcial de endereço que você digita em um campo de endereço</td>
                <td>Europa</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Provedor de IA (atualmente MiniMax)</td>
                <td>Ajuda com IA: Ask Ava, o chat de ajuda da área do cliente, e o assistente e a redação de respostas a tickets usados pela nossa equipe</td>
                <td>O seu primeiro nome, as suas perguntas ao Ask Ava e os dados da sua conta que ele consulta para você; registros de clientes e mensagens de tickets com que a nossa equipe trabalha (veja a Seção 3.5)</td>
                <td>Veja a Seção 3.5</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Telnyx</td>
                <td>Mensagens de texto com um código de uso único que confirma quem é o titular de uma conta, por exemplo na recuperação da conta</td>
                <td>O número de telefone da sua conta e o texto da mensagem, que contém o código</td>
                <td>Estados Unidos</td>
              </tr>
            </tbody>
          </table>
        </ScrollTable>

        {/*
          OWNER DECISION NEEDED: datacenter partner identity and location.

          The datacenter partner or partners could not be determined from the codebase, and this
          is the single most important entry on the page: the datacenter has physical custody of
          every server and therefore of all client data at rest.

          Fill in, for each facility actually in use:
            - the legal entity name of the operator
            - the city and country of the facility
            - whether any facility is outside the United States (this changes the transfer
              analysis in Section 4)

          A GDPR subprocessor list that omits the entity holding the hardware is not complete,
          and a client asking for a data processing agreement will ask for exactly this.
        */}
        <Callout tone="caution" title="Parceiro de data center: a ser publicado">
          O operador e a localização das instalações que abrigam os nossos servidores estão sendo
          confirmados e serão nomeados aqui. Se você precisar dessa informação antes de ela ser
          publicada, por exemplo para concluir a sua própria avaliação de fornecedores, entre em
          contato conosco em <Email name="support" />{' '}
          e nós a forneceremos.
        </Callout>

        <p>
          Podemos acrescentar ou substituir um subprocessador conforme a nossa infraestrutura muda.
          Quando fizermos isso, atualizaremos esta página. Os clientes ativos que pediram para ser
          avisados de mudanças de subprocessadores serão informados por e-mail; você pode optar por
          esse aviso escrevendo para{' '}
          <Email name="support" />.
        </p>
      </LegalSection>

      <LegalSection number="3" title="Notas sobre Entradas Específicas">

        <LegalSubSection title="3.1 Processadores de Pagamento">
          <p>
            Os dados do cartão são inseridos diretamente no processador de pagamento e são tratados
            por esse processador. Conforme indicado na Seção 2.2 da nossa Política de Privacidade,
            não armazenamos o número completo do seu cartão nem o CVV. O que retemos é o tipo de
            meio de pagamento, os quatro últimos dígitos e os identificadores de transação.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.2 Preenchimento Automático de Endereço">
          <p>
            As sugestões de endereço são solicitadas pelo nosso próprio servidor, e não pelo seu
            navegador. Por isso, o seu endereço IP não é exposto ao serviço de geocodificação;
            apenas o texto parcial de endereço que você digitou é enviado. Não enviamos o restante
            do seu formulário, a identidade da sua conta nem o seu endereço de e-mail junto com a
            consulta.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.3 CDNs Públicas">
          <p>
            Quando uma página carrega uma biblioteca de front-end de uma CDN pública, o seu
            navegador faz uma requisição direta a essa CDN, o que necessariamente revela a ela o seu
            endereço IP e o seu user agent. Isso é o padrão para recursos entregues por CDN e não é
            algo que nós mesmos transmitimos a elas.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.4 Sistemas Operados por Nós">
          <p>
            O nosso gateway de e-mail, o painel Pterodactyl e o painel VirtFusion rodam em
            infraestrutura que controlamos, e não como serviços hospedados de terceiros. Eles estão
            listados aqui por completude porque processam dados pessoais e porque um fornecedor de
            software pode, em algumas circunstâncias, receber acesso durante uma investigação de
            suporte. Quando isso acontece, o acesso é limitado ao necessário para resolver o
            problema.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.5 Provedor de IA">
          <p>
            Os nossos recursos de IA usam um único provedor de IA, atualmente MiniMax. Podemos
            trocar de provedor e, se o fizermos, atualizaremos esta página. Conforme o recurso, o
            provedor recebe:
          </p>
          <ul>
            <li>
              <strong>Ask Ava, o chat de ajuda da área do cliente.</strong> O seu primeiro nome,
              as perguntas que você faz e os dados da sua conta que ele consulta para
              respondê-las, como os seus serviços, faturas, tickets e crédito. Ele só pode ler o
              que você mesmo poderia ver na área do cliente e não pode alterar nada.
            </li>
            <li>
              <strong>O assistente da equipe no nosso painel de administração.</strong> O que a
              nossa equipe pergunta a ele, incluindo as capturas de tela que anexar, e os
              registros que ele consulta para ela, como nomes de clientes, endereços de e-mail,
              serviços, faturas e tickets.
            </li>
            <li>
              <strong>A redação de respostas a tickets para a equipe.</strong> O assunto, o
              departamento, o status e as mensagens do ticket, o primeiro nome do cliente e os
              dados de faturamento dele: os serviços com preços, ciclos de faturamento, datas de
              renovação, eventuais mudanças agendadas e eventual aviso de mudança de preço que
              enviamos a ele, as faturas recentes e o saldo de crédito da conta. Quando a equipe
              pede para melhorar o próprio texto, esse texto é enviado como foi escrito, e quando
              melhora uma nota interna, as notas internas do ticket também são incluídas.
              Endereços de e-mail, números de telefone e endereços IP que conseguimos reconhecer
              nas mensagens do ticket são mascarados antes.
            </li>
          </ul>
          <p>
            As nossas consultas nunca enviam ao provedor a sua senha nem os dados do seu cartão de
            pagamento, mas tudo o que você digitar no Ask Ava ou em um ticket pode chegar a ele,
            por isso nunca os digite ali. Antes que uma mensagem de ticket chegue ao provedor,
            ocultamos qualquer senha ou chave nela que consigamos reconhecer. A IA nunca responde
            a um ticket por conta própria: um membro da nossa equipe aprova cada resposta que ela
            escreve antes de ser enviada.
          </p>
          <p>
            O provedor trata esses dados para produzir cada resposta, conforme os termos do
            próprio provedor. Ainda não confirmamos onde ele processa as solicitações, por isso nenhuma
            localização aparece acima. Se você precisar dessa informação para a sua própria
            avaliação de fornecedores, entre em contato conosco em <Email name="support" />{' '}
            e resolveremos isso com você.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="4" title="Transferências Internacionais">
        <p>
          A WSLATL LLC está estabelecida no Estado do Missouri, Estados Unidos, e os nossos serviços
          são operados a partir dos Estados Unidos. Se você está localizado no Espaço Econômico
          Europeu, no Reino Unido ou na Suíça, usar os nossos serviços envolve transferir os seus
          dados pessoais para os Estados Unidos e, quando um subprocessador opera uma rede global,
          para outros países.
        </p>
        <p>
          Os Estados Unidos não foram objeto de uma decisão geral de adequação que abranja todos os
          destinatários. Quando transferimos dados pessoais para fora do EEE ou do Reino Unido,
          recorremos ao seguinte:
        </p>
        <ul>
          <li>
            <strong>Necessidade para o contrato.</strong> Na
            maioria das transferências, a transferência é necessária para executar o contrato que
            você nos pediu para executar. Não é possível entregar a você um servidor na nossa
            instalação sem que os seus dados cheguem à nossa instalação.
          </li>
          <li>
            <strong>Standard Contractual Clauses.</strong>{' '}
            Quando um subprocessador as oferece, recorremos às Standard Contractual Clauses da
            Comissão Europeia e ao UK International Data Transfer Addendum para transferências do
            Reino Unido. Vários dos fornecedores listados acima incorporam essas cláusulas aos seus
            termos padrão de processamento de dados.
          </li>
          <li>
            <strong>Estruturas no nível do fornecedor.</strong> Alguns
            dos fornecedores listados acima mantêm as suas próprias certificações ou mecanismos de
            transferência que cobrem os dados que recebem. Esses mecanismos são do fornecedor, não
            nossos, e você deve consultar a documentação de privacidade do próprio fornecedor para
            mais detalhes.
          </li>
        </ul>
        <p>
          Isso ainda não abrange o nosso provedor de IA. Não confirmamos onde ele processa as
          solicitações nem qual mecanismo de transferência se aplica a ele, por isso os dados que
          ele recebe podem ser processados em um país diferente dos Estados Unidos. Veja a Seção
          3.5.
        </p>

        {/*
          OWNER DECISION NEEDED: EEA/UK compliance posture.

          Two items on this page state a position about WSLATL itself rather than about a vendor,
          and both need to be confirmed before publication:

            1. EU-US Data Privacy Framework. The paragraph below states that WSLATL does not
               maintain its own DPF certification. Confirm this is correct. If a certification
               has been obtained, replace the paragraph with the certification detail. Do not
               leave a claim of certification on the page that is not backed by an active
               listing.

            2. Article 27 representative. A controller or processor established outside the EEA
               that offers services to data subjects in the EEA is generally required by GDPR
               Article 27 to designate a representative in the Union, and by UK GDPR Article 27
               to designate one in the UK, unless an exemption applies. WSLATL has no such
               representative listed anywhere in these documents. Counsel should determine
               whether an exemption applies given the volume and nature of EEA/UK clients, and
               if not, a representative must be appointed and named on this page and in the
               Privacy Policy.
        */}
        <p>
          Atualmente a WSLATL não mantém a sua própria certificação sob o EU-US Data Privacy
          Framework. Não alegamos adequação com base nele.
        </p>
        <p>
          Se você precisa de um acordo de processamento de dados, de uma cópia das Standard
          Contractual Clauses conforme as aplicamos ou de uma avaliação de impacto de transferência
          para o seu próprio arquivo de conformidade, entre em contato conosco em{' '}
          <Email name="support" />{' '}
          e trabalharemos nisso junto com você.
        </p>
      </LegalSection>

      <LegalSection number="5" title="Dados Que Você Coloca nos Seus Próprios Servidores">
        <p>
          Há uma distinção importante entre os dois tipos de dados envolvidos na hospedagem.
        </p>
        <ul>
          <li>
            <strong>Os dados da sua conta.</strong> As
            informações que você nos dá para abrir e manter a sua conta, como o seu nome, endereço
            de e-mail, endereço de cobrança e histórico de faturas. A WSLATL é a controladora desses
            dados, e os subprocessadores listados acima são contratados por nós.
          </li>
          <li>
            <strong>Os dados nos seus serviços.</strong> Tudo o
            que você ou os seus usuários armazenam em um servidor que hospedamos para você,
            incluindo bancos de dados, dados de servidor de jogos, arquivos enviados e logs de
            aplicação. Você decide o que é coletado e por quê. A WSLATL é processadora desses dados,
            não a controladora, e esta lista de subprocessadores não é uma lista dos seus
            subprocessadores.
          </li>
        </ul>
        <p>
          Se você hospeda dados pessoais de outras pessoas em um serviço da WSLATL, as obrigações de
          controlador sob o GDPR ou outra lei aplicável recaem sobre você. Isso inclui ter uma base
          legal, fornecer aviso aos seus próprios usuários e manter o seu próprio registro de
          processamento. Veja a Seção 12 dos nossos{' '}
          <Link href={siteConfig.paths.terms}>Termos de Serviço</Link>{' '}
          para a indenização relacionada.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Alterações a Esta Lista">
        <p>
          Manteremos esta página atualizada conforme a nossa infraestrutura muda. Quando um
          subprocessador for acrescentado ou substituído, atualizaremos a data de vigência no topo
          desta página e publicaremos a lista atualizada em{' '}
          <Link href={siteConfig.paths.subprocessors}>
            {siteConfig.siteUrl}{siteConfig.paths.subprocessors}
          </Link>.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Contato">
        <p>
          Dúvidas sobre esta lista, pedidos de acordo de processamento de dados e solicitações de
          privacidade em geral devem ser dirigidos a:
        </p>
        <CompanyContact />
      </LegalSection>
    </>
  )
}
