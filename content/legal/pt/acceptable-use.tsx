import { Link } from '@/components/legal/doc-link'
import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'
import { Callout, CompanyContact, InfoCard, InfoRow, ScrollTable, Tier, Tiers } from '@/components/legal/blocks'
import { Email } from '@/components/ui/email'
import { ShortLink } from '@/components/ui/short-link'

export default function AcceptableUseContent() {
  return (
    <>
      <LegalSection number="1" title="Introdução e Escopo">
        <p>
          Esta Política de Uso Aceitável (&ldquo;AUP&rdquo;) se aplica a todos os clientes,
          usuários e pessoas que acessam serviços prestados pela WSLATL LLC, incluindo, entre
          outros, servidores dedicados, hospedagem de servidores de jogos, hospedagem VPS e
          serviços de hospedagem de sites.
        </p>
        <p>
          Esta AUP é incorporada aos nossos{' '}
          <Link href={siteConfig.paths.terms}>Termos de Serviço</Link> e deles passa
          a fazer parte. Ao usar qualquer serviço da WSLATL, você concorda em cumprir esta
          política. As violações podem resultar em suspensão ou rescisão imediata dos seus serviços
          sem reembolso e, possivelmente, em encaminhamento às autoridades policiais.
        </p>
        <p>
          Somos uma empresa de hospedagem pequena e privada. A nossa infraestrutura atende clientes
          reais cujos negócios e projetos dependem de uptime confiável. Protegemos essa
          infraestrutura de forma agressiva e temos tolerância zero com atividades que a coloquem
          em risco, ou que coloquem em risco esses clientes.
        </p>

        <Tiers title="Requisitos de Idade">
          <Tier tone="critical" title="Menores de 13 anos: banidos">
            Menores de 13 anos não têm permissão para usar nenhum serviço da WSLATL. Contas que se
            verifique pertencerem a usuários com menos de 13 anos são banidas permanentemente de
            imediato e todos os dados são excluídos. Sem exceções.
          </Tier>
          <Tier tone="caution" title="De 13 a 17 anos: consentimento de um adulto obrigatório">
            Usuários de 13 a 17 anos são bem-vindos, mas um pai, mãe ou responsável legal precisa
            ter analisado estes termos e consentido com eles em nome do usuário antes de a conta
            ser usada. O adulto que consente é responsável por toda a atividade e por todas as
            cobranças da conta.
          </Tier>
          <Tier tone="good" title="18 anos ou mais: totalmente permitido">
            Nenhum requisito adicional relacionado à idade além da aprovação padrão da conta.
          </Tier>
        </Tiers>
      </LegalSection>

      <LegalSection number="2" title="Usos Permitidos">
        <p>Os serviços da WSLATL são fornecidos para fins lícitos. Os usos permitidos incluem:</p>
        <ul>
          <li>Hospedar sites, aplicações web, APIs REST e conteúdo estático</li>
          <li>Rodar servidores de jogos para uso pessoal ou da comunidade (de acordo com os termos da publicadora do jogo)</li>
          <li>Ambientes de desenvolvimento e de homologação, repositórios de código e pipelines de CI/CD</li>
          <li>Projetos pessoais, portfólios e aplicações de hobby</li>
          <li>Aplicações comerciais legítimas e infraestrutura de negócios</li>
          <li>Bancos de dados, armazenamento de arquivos e infraestrutura de backend</li>
          <li>Serviços de VPN ou proxy usados para proteção da privacidade pessoal (precisa ser informado no cadastro; operar um serviço de VPN público exige aprovação prévia)</li>
          <li>Servidores de e-mail para e-mails transacionais ou pessoais legítimos (precisa ser informado no cadastro; e-mail em massa exige aprovação prévia por escrito)</li>
          <li>Testes de software e pesquisa de segurança em sistemas que você possui ou que tem autorização explícita e por escrito para testar</li>
        </ul>
      </LegalSection>

      <LegalSection number="3" title="Conteúdo Proibido">
        <p>
          O conteúdo a seguir é estritamente proibido na infraestrutura da WSLATL em qualquer
          circunstância. A violação desta seção resultará em rescisão imediata, sem aviso e sem
          reembolso:
        </p>
        <ul>
          <li>
            <strong>Material de Abuso Sexual Infantil (CSAM):</strong>{' '}
            Qualquer conteúdo que explore sexualmente, retrate ou coloque em perigo menores de
            idade. Tolerância zero. As violações serão comunicadas imediatamente ao National Center
            for Missing &amp; Exploited Children (NCMEC) e às autoridades policiais.
          </li>
          <li>
            <strong>Terrorismo e Extremismo Violento:</strong>{' '}
            Conteúdo que promova, recrute para, financie ou facilite o terrorismo, a violência em
            massa ou movimentos extremistas violentos.
          </li>
          <li>
            <strong>Malware e Software Malicioso:</strong>{' '}
            Hospedar, distribuir ou desenvolver vírus, ransomware, spyware, trojans, keyloggers,
            rootkits ou qualquer outro software projetado para danificar, interromper ou obter
            acesso não autorizado a sistemas de computador.
          </li>
          <li>
            <strong>Phishing e Fraude:</strong>{' '}
            Páginas, domínios ou aplicações projetados para enganar usuários e levá-los a fornecer
            credenciais, informações financeiras ou dados pessoais sob falsos pretextos.
          </li>
          <li>
            <strong>Conteúdo Que Viola Direitos Autorais:</strong>{' '}
            Hospedar ou distribuir conteúdo que viole direitos autorais, marcas ou outros direitos
            de propriedade intelectual de qualquer pessoa ou entidade.
          </li>
          <li>
            <strong>Conteúdo Falsificado ou Fraudulento:</strong>{' '}
            Lojas falsas, produtos falsificados, fábricas de diplomas ou qualquer atividade
            comercial fraudulenta.
          </li>
          <li>
            <strong>Armas Ilegais e Substâncias Controladas:</strong>{' '}
            Conteúdo que facilite a venda, a fabricação ou a distribuição ilegal de armas,
            substâncias controladas ou outro contrabando.
          </li>
          <li>
            <strong>Jogos de Azar sem Licença:</strong>{' '}
            Operar serviços de jogos de azar on-line sem todas as licenças e autorizações legais aplicáveis.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="4" title="Atividades Proibidas">

        <LegalSubSection title="4.1 Ataques de Rede e Abuso de Infraestrutura">
          <p>As atividades a seguir são estritamente proibidas e resultarão em rescisão imediata:</p>
          <ul>
            <li>
              <strong>Ataques de DDoS:</strong> Conduzir,
              facilitar, lançar ou participar de ataques de negação de serviço distribuída contra
              qualquer alvo, incluindo outros clientes da WSLATL, serviços externos ou qualquer
              infraestrutura da internet. Esta é a nossa regra fiscalizada com mais rigor.
            </li>
            <li>
              <strong>Varredura de Portas e de Vulnerabilidades:</strong>{' '}
              Varrer, sondar ou mapear a rede ou os serviços de sistemas que você não possui ou
              para os quais não tem autorização explícita e por escrito para testar
            </li>
            <li>
              <strong>Interceptação de Rede:</strong>{' '}
              Ataques man-in-the-middle, envenenamento de ARP, sequestro de DNS, SSL stripping ou
              qualquer técnica destinada a interceptar ou alterar o tráfego de rede
            </li>
            <li>Spoofing de IP ou envio de tráfego com endereços de origem falsificados</li>
            <li>Tentar explorar vulnerabilidades na infraestrutura da WSLATL ou nos serviços de outros clientes</li>
            <li>Usar a infraestrutura da WSLATL como ponto de preparação ou de retransmissão para ataques contra sistemas externos</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="4.2 Spam e Comunicações Não Solicitadas">
          <ul>
            <li>Enviar e-mail em massa não solicitado (spam) de qualquer tipo</li>
            <li>Operar um open relay de e-mail que possa ser usado para enviar spam</li>
            <li>Falsificação de e-mail, campanhas de phishing ou personificação</li>
            <li>Spam por SMS ou qualquer forma de mensagens em massa não solicitadas</li>
            <li>Raspar, coletar ou compilar endereços de e-mail ou dados pessoais sem consentimento</li>
            <li>Enviar e-mail comercial em massa sem mecanismos de opt-out em conformidade com a CAN-SPAM</li>
          </ul>
          <p>
            Os clientes que precisam enviar e-mail transacional ou de marketing legítimo em volume
            precisam informar esse caso de uso no cadastro e manter a conformidade com o CAN-SPAM
            Act e com qualquer outra legislação antispam aplicável.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.3 Acesso Não Autorizado">
          <ul>
            <li>Tentar acessar qualquer sistema de computador, conta, banco de dados ou rede que você não está autorizado a acessar</li>
            <li>Ataques de força bruta contra qualquer interface de login, incluindo SSH, RDP, aplicações web e APIs</li>
            <li>Credential stuffing com conjuntos de credenciais vazadas ou roubadas</li>
            <li>Engenharia social dirigida à equipe da WSLATL, a outros clientes ou a qualquer terceiro</li>
            <li>Usar os nossos serviços para facilitar o acesso não autorizado a sistemas de terceiros</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="4.4 Mineração de Criptomoedas">
          <ul>
            <li>A mineração de criptomoedas ou de blockchain de qualquer tipo é <strong>proibida por padrão</strong> nos planos de hospedagem de jogos e de hospedagem de sites</li>
            <li>A mineração em planos de VPS ou de servidor dedicado exige <strong>aprovação prévia por escrito</strong> da WSLATL antes de iniciar as operações</li>
            <li>As operações de mineração aprovadas não podem impactar negativamente o consumo de energia do data center, os sistemas de refrigeração ou a infraestrutura compartilhada</li>
            <li>Reservamo-nos o direito de revogar a aprovação de mineração a qualquer momento se ela impactar a nossa infraestrutura ou outros clientes</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="4.5 Atividades Ilegais">
          <ul>
            <li>Usar a infraestrutura da WSLATL para qualquer atividade que viole a lei local, estadual, federal ou internacional aplicável</li>
            <li>Facilitar fraude, lavagem de dinheiro, fraude eletrônica ou crimes financeiros</li>
            <li>Operar mercados ilegais ou serviços na darknet</li>
            <li>Burlar ordens judiciais lícitas ou obstruir a ação das autoridades policiais</li>
            <li>Evadir sanções ou praticar atividades proibidas pelas leis de controle de exportação aplicáveis</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="4.6 Violações de Privacidade">
          <ul>
            <li>Coletar, processar ou armazenar dados pessoais sem base legal adequada ou sem consentimento</li>
            <li>Operar serviços em violação do GDPR, da CCPA, da COPPA ou de outras leis de proteção de dados aplicáveis</li>
            <li>Doxxing ou publicação de informações pessoais privadas sobre indivíduos sem o consentimento deles</li>
            <li>Stalkerware ou software de vigilância que opera sem o conhecimento da pessoa monitorada</li>
          </ul>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="5" title="Diretrizes de Uso de Recursos">
        <p>
          O uso responsável dos recursos é necessário para manter um ambiente justo e estável para
          todos os clientes. Aplicam-se as seguintes diretrizes:
        </p>
        <ul>
          <li>
            <strong>Banda:</strong> Você pode usar banda até a
            cota incluída no seu plano. Os excedentes são cobrados pelas tarifas listadas no seu
            portal de faturamento. Os planos de banda sem medição estão sujeitos ao uso justo; o
            abuso de planos sem medição pode resultar em limitação de velocidade ou na exigência de
            upgrade.
          </li>
          <li>
            <strong>CPU e RAM:</strong> É proibido o consumo
            intencional de recursos além da cota do seu plano em prejuízo de outros clientes (em
            infraestrutura compartilhada) ou para burlar os limites do plano.
          </li>
          <li>
            <strong>I/O de disco:</strong> Cargas de trabalho
            que gerem I/O de disco alto e sustentado, impactando a infraestrutura de armazenamento
            compartilhada, precisam ser conversadas com a gente com antecedência.
          </li>
          <li>
            <strong>Conexões de saída:</strong> É proibido
            gerar volumes anormalmente altos de conexões de rede de saída (por exemplo, floods de
            conexão) sem notificação prévia.
          </li>
        </ul>
        <p>
          Se você tem um caso de uso legítimo que exige alto consumo de recursos, fale com a gente
          antes que isso vire um problema. Somos flexíveis com clientes que se comunicam
          abertamente.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Regras Específicas de Servidores de Jogos">
        <p>Para clientes que usam os nossos serviços de hospedagem de servidores de jogos:</p>
        <ul>
          <li>Os servidores de jogos precisam rodar softwares e configurações que cumpram os termos de serviço e o contrato de licença de usuário final da publicadora do jogo aplicável</li>
          <li>É proibido hospedar software pirata de servidor de jogos, clientes crackeados ou qualquer conteúdo de jogo que viole direitos autorais</li>
          <li>Não rode processos não relacionados ao seu servidor de jogos em planos de hospedagem de jogos sem aprovação prévia (por exemplo, mineração, bots, raspagem)</li>
          <li>Mods, plugins e configurações de servidor não podem ser usados para praticar nenhuma das atividades proibidas listadas nesta AUP</li>
          <li>A nossa proteção contra DDoS é fornecida para a defesa do seu servidor; não tente burlá-la, desativá-la nem abusar dela</li>
          <li>Exceder o limite de slots de jogadores do seu plano ou os recursos alocados exige um upgrade antes do uso, não depois</li>
          <li>Servidores de jogos usados para assediar, ameaçar ou prejudicar outros jogadores podem ser suspensos enquanto a investigação ocorre</li>
        </ul>
      </LegalSection>

      <LegalSection number="7" title="Testes e Pesquisa de Segurança">
        <p>
          A pesquisa de segurança e os testes de invasão são permitidos apenas nas seguintes condições:
        </p>
        <ul>
          <li>
            <strong>Os seus próprios sistemas:</strong> Você
            pode realizar testes de segurança em servidores e serviços que você possui e controla,
            sem restrições além das proibições da Seção 4.
          </li>
          <li>
            <strong>Sistemas de terceiros autorizados:</strong>{' '}
            Você pode realizar testes de segurança em sistemas de terceiros somente se tiver
            autorização documentada, explícita e por escrito do dono do sistema. Podemos pedir
            comprovação da autorização.
          </li>
          <li>
            <strong>A infraestrutura da WSLATL:</strong> Testar
            a própria infraestrutura da WSLATL (os nossos painéis, as nossas redes ou os servidores
            de outros clientes) é proibido sem a nossa autorização prévia por escrito,
            independentemente da intenção.
          </li>
        </ul>
        <p>
          Infraestrutura de competições CTF (Capture the Flag) e honeypots deliberados são
          permitidos com aviso prévio à nossa equipe.
        </p>
      </LegalSection>

      <LegalSection number="8" title="Denúncia de Abuso">
        <p>
          Se você acredita que a infraestrutura da WSLATL está sendo usada para atividade abusiva,
          ilegal ou danosa, denuncie para a gente imediatamente. Levamos todas as denúncias de abuso
          a sério e as investigamos prontamente.
        </p>
        <InfoCard title="Denuncie abuso para">
          <InfoRow label="E-mail">
            <Email name="abuse" /> (Assunto: Abuse Report)
          </InfoRow>
          <InfoRow label="Discord">
            <ShortLink name="discord" />
          </InfoRow>
        </InfoCard>
        <p>
          Por favor, inclua o máximo de detalhes possível na sua denúncia: endereços IP envolvidos,
          horários (com o fuso horário), trechos de log, URLs e uma descrição da atividade abusiva.
          Quanto mais detalhes você fornecer, mais rápido conseguimos investigar e responder.
        </p>
      </LegalSection>

      <LegalSection number="9" title="Aplicação">
        <p>
          A WSLATL se reserva o direito de tomar qualquer medida que considere apropriada em
          resposta a violações da AUP. A aplicação é proporcional à gravidade, mas sempre
          priorizamos proteger a nossa rede e os outros clientes.
        </p>

        <ScrollTable label="Aplicação por gravidade">
          <table className="legal-table">
            <thead>
              <tr>
                <th scope="col">Gravidade</th>
                <th scope="col">Exemplos</th>
                <th scope="col">Resposta</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium text-foreground">Leve</td>
                <td>Primeiro excedente de recursos, desvio leve dos Termos</td>
                <td>Advertência + remediação obrigatória dentro do prazo especificado</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Moderada</td>
                <td>Spam, varredura não autorizada, violações leves repetidas</td>
                <td>Suspensão imediata enquanto a investigação ocorre; reativação possível mediante remediação</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Grave</td>
                <td>Ataques de DDoS, hospedagem de malware, CSAM, atividade ilegal</td>
                <td>Rescisão imediata, sem reembolso, dados preservados para as autoridades policiais, encaminhamento às autoridades</td>
              </tr>
            </tbody>
          </table>
        </ScrollTable>

        <p>A WSLATL se reserva o direito de:</p>
        <ul>
          <li>Suspender serviços imediatamente e sem aviso prévio quando houver uma ameaça ativa e em andamento à nossa rede ou a terceiros</li>
          <li>Cooperar plena e proativamente com investigações das autoridades policiais</li>
          <li>Compartilhar denúncias de abuso, logs e informações de identificação com as autoridades competentes e com registros de abuso (AbuseIPDB, SpamCop etc.)</li>
          <li>Encerrar contas de infratores reincidentes sem direito a reembolso</li>
          <li>Buscar medidas judiciais cíveis ou criminais contra clientes que causem dano significativo</li>
        </ul>

        <Callout tone="caution" title="Nota sobre abuso de rede">
          Se o seu servidor for a
          origem de tráfego abusivo de saída (DDoS, spam, varredura), vamos suspender o serviço
          primeiro e investigar depois. Isso é para proteger os outros clientes e a internet como um
          todo. Entraremos em contato com você logo após a suspensão para conversar sobre o que
          encontramos.
        </Callout>
      </LegalSection>

      <LegalSection number="10" title="Alterações a Esta Política">
        <p>
          Podemos atualizar esta Política de Uso Aceitável de tempos em tempos para tratar de novas
          ameaças, de novos serviços ou de exigências legais. Quando fizermos alterações
          substanciais, vamos:
        </p>
        <ul>
          <li>Atualizar a data de vigência no topo desta página</li>
          <li>Avisar os clientes ativos por e-mail com um resumo do que mudou</li>
          <li>Publicar a AUP atualizada em {siteConfig.paths.acceptableUse}</li>
        </ul>
        <p>
          O seu uso continuado dos serviços da WSLATL após a data de vigência de qualquer alteração
          constitui aceitação da política atualizada.
        </p>
      </LegalSection>

      <LegalSection number="11" title="Contato">
        <p>
          Dúvidas sobre esta Política de Uso Aceitável ou sobre se um caso de uso específico é
          permitido devem ser dirigidas a nós antes de você começar, não depois.
        </p>
        <CompanyContact>
          <InfoRow label="E-mail">
            <Email name="support" />
          </InfoRow>
        </CompanyContact>
      </LegalSection>
    </>
  )
}
