import { Link } from '@/components/legal/doc-link'
import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'
import { Callout, CompanyContact, ScrollTable } from '@/components/legal/blocks'
import { Email } from '@/components/ui/email'
import { ShortLink } from '@/components/ui/short-link'

export default function BackupsContent() {
  return (
    <>
      <LegalSection number="1" title="Visão Geral e Escopo">
        <p>
          Esta Política de Backup explica quais backups a WSLATL LLC (&ldquo;WSLATL&rdquo;,
          &ldquo;nós&rdquo;, &ldquo;nosso&rdquo; ou &ldquo;nos&rdquo;) faz, o que esses backups são
          e o que não são, quem é responsável pelos seus dados e como pedir uma restauração.
        </p>
        <p>
          Ela é incorporada por referência aos nossos{' '}
          <Link href={siteConfig.paths.terms}>Termos de Serviço</Link>{' '}
          e deve ser lida junto com a Seção 2 (Descrição dos Serviços), a Seção 9.3 (Efeito da
          Rescisão) e a Seção 11 (Limitação de Responsabilidade).
        </p>
        <p>
          Esta política existe como documento próprio, e não como uma cláusula dos Termos, por um
          motivo prático: o que está incluído em cada plano muda conforme os nossos planos mudam, e
          uma mudança de plano não deve exigir uma revisão dos Termos de Serviço nem o prazo de
          aviso que vem com ela. A divisão de responsabilidades abaixo não muda; só o detalhe do
          plano muda.
        </p>
      </LegalSection>

      <LegalSection number="2" title="A Versão Curta">
        <Callout tone="critical" title="Mantenha os seus próprios backups">
          Qualquer backup que fornecemos é uma conveniência, não uma garantia. Ele é de melhor
          esforço e não substitui as suas próprias cópias independentes dos seus dados. Se os seus
          dados importam para você, você deve manter os seus próprios backups, guardados em outro
          lugar que não o serviço de onde vieram. Não conte com a gente como a sua única cópia.
        </Callout>
        <p>
          Fazemos backups porque eles são úteis e porque nos ajudam a ajudar você. Levamos isso a
          sério. Mas backups podem falhar, podem estar incompletos, podem estar corrompidos e podem
          estar indisponíveis exatamente no momento em que você mais precisa deles. Toda empresa de
          hospedagem que diz o contrário está prometendo mais do que entrega. O resto desta página
          expõe com honestidade o que você recebe.
        </p>
      </LegalSection>

      <LegalSection number="3" title="O Que Está Incluído">
        <p>
          O que é copiado, com que frequência o backup é feito e por quanto tempo ele é mantido
          depende do serviço e do plano. A tabela abaixo resume o que está incluído por serviço. Os
          prazos exatos de retenção do seu serviço específico aparecem no seu portal de faturamento,
          e você sempre pode confirmá-los com a nossa equipe.
        </p>

        <ScrollTable label="Backups por serviço">
          <table className="legal-table">
            <thead>
              <tr>
                <th scope="col">Serviço</th>
                <th scope="col">Backups incluídos</th>
                <th scope="col">O que é capturado</th>
                <th scope="col">Frequência</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium text-foreground">Servidores dedicados</td>
                <td>Não incluído (autogerenciado)</td>
                <td>Não se aplica</td>
                <td>Não se aplica</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Hospedagem de servidores de jogos</td>
                <td>Incluído</td>
                <td>Contêiner completo do servidor</td>
                <td>Mensal</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Hospedagem VPS</td>
                <td>Incluído <span className="text-muted-foreground">(em breve)</span></td>
                <td>Imagem completa do disco</td>
                <td>Mensal</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Hospedagem de sites</td>
                <td>Incluído</td>
                <td>O site e o seu estado</td>
                <td>Mensal</td>
              </tr>
            </tbody>
          </table>
        </ScrollTable>

        <p>Alguns detalhes por trás da tabela:</p>
        <ul>
          <li>
            <strong>Servidores dedicados.</strong> Um servidor
            dedicado é a sua máquina. Você tem controle total do sistema operacional e de tudo o que
            está nele, e não fazemos backups dele para você. Executar e armazenar backups de um
            servidor dedicado é responsabilidade sua. Teremos prazer em conversar sobre um arranjo
            de backup gerenciado mediante solicitação.
          </li>
          <li>
            <strong>Hospedagem de servidores de jogos.</strong> Fazemos
            um backup do contêiner completo do servidor de jogos em um ciclo mensal.
          </li>
          <li>
            <strong>Hospedagem VPS.</strong> A hospedagem VPS
            será lançada em breve. Quando entrar no ar, faremos um backup mensal da imagem completa
            do disco de cada VPS. Até lá, esta linha descreve o que está planejado, não algo que já
            está em funcionamento.
          </li>
          <li>
            <strong>Hospedagem de sites.</strong> Fazemos um
            backup mensal do próprio site e do seu estado atual (os seus arquivos e dados), não de
            toda a conta de hospedagem ao redor dele.
          </li>
        </ul>
        <p>
          Quando um backup é descrito como mensal, ele é feito em um ciclo aproximadamente mensal,
          não em uma data de calendário garantida. Conforme exposto na Seção 4, todo backup que
          fazemos é de melhor esforço e não substitui as cópias independentes que você mesmo mantém.
        </p>
      </LegalSection>

      <LegalSection number="4" title="Os Backups São de Melhor Esforço">
        <p>
          Quando os backups estão incluídos no seu serviço, nós os fornecemos em regime de melhor
          esforço. Não garantimos que:
        </p>
        <ul>
          <li>Exista um backup de qualquer serviço específico em qualquer momento específico</li>
          <li>Um backup feito esteja completo, não corrompido ou restaurável</li>
          <li>Uma restauração tenha êxito, ou tenha êxito dentro de qualquer prazo específico</li>
          <li>Os dados recuperados de um backup estejam atualizados até qualquer momento específico</li>
          <li>Um backup sobreviva à perda da infraestrutura subjacente</li>
        </ul>
        <p>
          Isso é consistente com as isenções de responsabilidade da Seção 10 e com a limitação de
          responsabilidade da Seção 11 dos nossos Termos de Serviço. Nada nesta política cria uma
          garantia que essas seções excluem.
        </p>

        <LegalSubSection title="4.1 Coisas Contra as Quais os Backups Não Protegem">
          <p>
            Um backup é uma cópia dos seus dados feita em um momento no tempo. Ele não protege você
            de tudo e, em particular, não protege contra:
          </p>
          <ul>
            <li>
              Um dano que é ele próprio copiado, como um banco de dados corrompido ou um deploy
              ruim que foi capturado antes de você notar o problema
            </li>
            <li>
              Uma exclusão que cai entre dois backups, ou seja, qualquer trabalho feito desde que o
              último backup rodou
            </li>
            <li>
              A perda de um serviço que foi rescindido, quando os dados já foram removidos sob a
              Seção 9.3 dos Termos de Serviço
            </li>
          </ul>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="5" title="As Suas Responsabilidades">
        <p>
          Você é responsável pelos dados que armazena na nossa infraestrutura. Especificamente, você
          concorda que:
        </p>
        <ul>
          <li>
            <strong>Você mantém os seus próprios backups.</strong>{' '}
            Você é responsável por manter cópias atuais e independentes de quaisquer dados que não
            pode se dar ao luxo de perder, guardadas fora do serviço da WSLATL que as produziu.
          </li>
          <li>
            <strong>Você verifica se os seus backups funcionam.</strong>{' '}
            Um backup do qual você nunca restaurou é uma hipótese, não um backup. Teste os seus.
          </li>
          <li>
            <strong>Você faz uma cópia antes de mudanças arriscadas.</strong>{' '}
            Antes de uma reinstalação do sistema operacional, de uma mudança de plano, de uma
            migração, de um cancelamento ou de qualquer outra operação que possa destruir dados,
            faça a sua própria cópia primeiro. Não conseguiremos desfazer uma ação destrutiva que
            você pediu.
          </li>
          <li>
            <strong>Você exporta antes de sair.</strong> Se
            você cancelar um serviço ou deixá-lo expirar, exporte os seus dados antes de a rescisão
            entrar em vigor. A retenção após a rescisão é limitada e está descrita na Seção 9.3 dos
            Termos de Serviço.
          </li>
          <li>
            <strong>Você mantém seguros os dados dos seus próprios usuários.</strong>{' '}
            Se outras pessoas dependem do serviço que você opera na nossa infraestrutura, as
            expectativas delas quanto a backup são responsabilidade sua, não nossa.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="6" title="Como Pedir uma Restauração">
        <p>
          Para pedir uma restauração, abra um ticket no portal de faturamento em{' '}
          <ShortLink name="billing" />{' '}
          ou escreva para{' '}
          <Email name="support" />. Informe:
        </p>
        <ul>
          <li>O serviço a que a restauração se refere</li>
          <li>O que foi perdido e, com a maior precisão possível, quando foi perdido</li>
          <li>O momento no tempo para o qual você gostaria de restaurar</li>
          <li>Se você quer uma restauração completa sobre o serviço em execução ou uma cópia entregue ao lado dele</li>
        </ul>

        <LegalSubSection title="6.1 Como Tratamos os Pedidos de Restauração">
          <p>
            Vamos dizer a você quais backups realmente temos do serviço e o que uma restauração a
            partir deles envolveria antes de fazer qualquer coisa. Quando um backup existe e a
            restauração é possível, nós a realizaremos ou disponibilizaremos os dados para você.
          </p>
          <p>
            Uma restauração é destrutiva por natureza. Restaurar sobre um serviço em execução
            substitui o estado atual dele, incluindo tudo o que foi criado desde que o backup foi
            feito. Não iniciaremos uma restauração que sobrescreva dados em produção sem a sua
            confirmação explícita do ponto de restauração.
          </p>
          <p>
            Não nos comprometemos com um prazo de resposta para restaurações. Quanto tempo uma
            restauração leva depende inteiramente do tamanho dos dados, do tipo de serviço e de onde
            o backup está guardado. Daremos uma estimativa quando confirmarmos o que está
            disponível, e priorizamos restaurações sobre o trabalho de rotina.
          </p>
        </LegalSubSection>

        <LegalSubSection title="6.2 Quando uma Restauração É Cobrada">
          <p>
            Algumas restaurações são um serviço pago, e não um serviço incluído. Se uma restauração
            é cobrada, e a que preço, depende do seu plano e da natureza do pedido. Informaremos o
            custo antes de realizar qualquer trabalho cobrado, e você pode recusá-lo.
          </p>
          <p>
            Quando uma restauração foi realizada como um adicional pago, ela é um serviço consumido
            e não é reembolsável, conforme exposto na Seção 5 da nossa{' '}
            <Link href={siteConfig.paths.refund}>Política de Reembolso</Link>.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="7" title="Backups e Rescisão">
        <p>
          Os backups fazem parte do seu serviço, não são algo mantido separadamente dele. Quando um
          serviço é rescindido, os seus backups ficam sujeitos às mesmas regras de retenção e
          exclusão do próprio serviço, descritas na Seção 9.3 dos nossos Termos de Serviço. Depois
          que esse período se esgota, os dados se foram e não podemos recuperá-los para você,
          qualquer que seja o motivo do pedido.
        </p>
        <p>
          Se você precisa de dados de um serviço rescindido, peça imediatamente. Não presuma que
          eles ainda estarão lá na semana que vem.
        </p>
      </LegalSection>

      <LegalSection number="8" title="Segurança dos Backups">
        <p>
          Os backups contêm os seus dados e são protegidos pelos mesmos controles descritos na Seção
          6 da nossa{' '}
          <Link href={siteConfig.paths.privacy}>Política de Privacidade</Link>,
          incluindo controles de acesso que limitam quais membros da nossa equipe podem alcançá-los.
          Quando um backup é mantido em infraestrutura operada por um parceiro, os destinatários
          listados na nossa página de{' '}
          <Link href={siteConfig.paths.subprocessors}>Subprocessadores</Link>{' '}
          se aplicam também a essa cópia.
        </p>
      </LegalSection>

      <LegalSection number="9" title="Alterações a Esta Política">
        <p>
          Podemos atualizar esta Política de Backup para refletir mudanças na nossa infraestrutura
          ou nos nossos planos. Quando fizermos alterações substanciais, atualizaremos a data de
          vigência no topo desta página e publicaremos a política atualizada em{' '}
          <Link href={siteConfig.paths.backups}>
            {siteConfig.siteUrl}{siteConfig.paths.backups}
          </Link>. Alterações que reduzam o que está incluído em um serviço que você já contratou
          serão comunicadas por e-mail antes de entrarem em vigor.
        </p>
      </LegalSection>

      <LegalSection number="10" title="Contato">
        <p>
          Pedidos de restauração e dúvidas sobre backups devem ser dirigidos a:
        </p>
        <CompanyContact />
      </LegalSection>
    </>
  )
}
