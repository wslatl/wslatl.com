import { Link } from '@/components/legal/doc-link'
import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'
import { UptimeTable } from '@/components/legal/uptime-table'
import { CompanyContact, InfoCard, InfoRow } from '@/components/legal/blocks'
import { Email } from '@/components/ui/email'

export default function TermsContent() {
  return (
    <>
      <LegalSection number="1" title="Aceitação dos Termos">
        <p>
          Ao se inscrever, cadastrar-se, acessar ou usar qualquer serviço prestado pela WSLATL LLC
          (&ldquo;WSLATL&rdquo;, &ldquo;nós&rdquo;, &ldquo;nosso&rdquo; ou &ldquo;nos&rdquo;), você
          (&ldquo;Cliente&rdquo;, &ldquo;você&rdquo; ou &ldquo;seu&rdquo;) confirma que:
        </p>
        <ul>
          <li>
            Você cumpre os nossos requisitos de idade: você (a) tem 18 anos ou mais ou (b) tem entre
            13 e 17 anos e obteve o consentimento explícito de um pai, mãe ou responsável legal que
            analisou estes Termos e concorda com eles em seu nome. Menores de 13 anos estão
            estritamente proibidos de usar qualquer serviço da WSLATL e serão banidos
            permanentemente quando descobertos.
          </li>
          <li>Você tem plena capacidade legal para celebrar um contrato vinculante</li>
          <li>Você leu, entendeu e concorda em se vincular a estes Termos de Serviço, à nossa Política de Privacidade e à nossa Política de Uso Aceitável</li>
          <li>Se você está aceitando em nome de uma empresa ou de outra pessoa jurídica, você tem autoridade para vincular essa entidade a estes termos</li>
        </ul>
        <p>
          Se você não concorda com estes termos, não use os nossos serviços. Estes Termos, junto com
          a nossa Política de Privacidade e a nossa Política de Uso Aceitável, formam o acordo
          completo entre você e a WSLATL LLC.
        </p>
      </LegalSection>

      <LegalSection number="2" title="Descrição dos Serviços">
        <p>
          A WSLATL LLC presta serviços privados de hospedagem, baseados em inscrição, a clientes
          aprovados. Os nossos serviços incluem, entre outros:
        </p>
        <ul>
          <li><strong>Servidores dedicados:</strong> Hardware físico de servidor provisionado exclusivamente para um único cliente, disponível gerenciado ou não gerenciado</li>
          <li><strong>Hospedagem de servidores de jogos:</strong> Servidores de jogos gerenciados pelo painel Pterodactyl, com suporte a títulos como Minecraft, Rust, CS2, ARK, Valheim, FiveM e outros</li>
          <li><strong>Hospedagem VPS:</strong> Servidores privados virtuais isolados, com acesso root completo e o sistema operacional que você escolher</li>
          <li><strong>Hospedagem de sites:</strong> Hospedagem gerenciada para sites e aplicações web, incluindo SSL, backups e suporte</li>
        </ul>
        <p>
          Os serviços estão sujeitos à disponibilidade e podem ser modificados, ampliados ou
          descontinuados a nosso critério, com aviso razoável aos clientes afetados.
        </p>

        <LegalSubSection title="2.1 Backups e Responsabilidade pelos Seus Dados">
          <p>
            Quando um serviço inclui backups, esses backups são fornecidos em{' '}
            <strong>regime de melhor esforço</strong> e são uma
            conveniência, não uma garantia. Não garantimos que exista um backup de um serviço
            específico em um momento específico, que um backup esteja completo ou restaurável, nem
            que uma restauração terá êxito.
          </p>
          <p>
            <strong>
              Você é responsável por manter os seus próprios backups independentes
            </strong>{' '}
            de quaisquer dados que não pode se dar ao luxo de perder, guardados em outro lugar que
            não o serviço da WSLATL que os produziu. Qualquer backup que fornecemos não substitui as
            suas próprias cópias. Esta divisão de responsabilidade é parte material do preço dos
            nossos serviços e deve ser lida junto com a Seção 10 (Isenção de Garantias) e a Seção 11
            (Limitação de Responsabilidade).
          </p>
          <p>
            O que está incluído em cada plano, como as restaurações são solicitadas e o que uma
            restauração envolve estão expostos na nossa{' '}
            <Link href={siteConfig.paths.backups}>Política de Backup</Link>{' '}
            em{' '}
            <Link href={siteConfig.paths.backups}>
              {siteConfig.siteUrl}{siteConfig.paths.backups}
            </Link>, que é incorporada a estes Termos por referência.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="3" title="Inscrição e Cadastro de Conta">
        <p>
          A WSLATL opera como uma empresa de hospedagem privada, somente por inscrição. O acesso aos
          nossos serviços não é automático e exige análise e aprovação da nossa equipe. Aplicam-se
          as seguintes condições:
        </p>
        <ul>
          <li>Você precisa enviar uma inscrição pelo nosso portal de faturamento em billing.wslatl.com e ser aprovado explicitamente antes de qualquer serviço ser provisionado</li>
          <li>Reservamo-nos o direito de recusar qualquer inscrição a nosso exclusivo critério, sem obrigação de apresentar um motivo</li>
          <li>Você precisa fornecer informações exatas, atuais e completas durante o cadastro e mantê-las atualizadas</li>
          <li>Você é o único responsável por manter a segurança das credenciais da sua conta, incluindo a sua senha e quaisquer chaves de API</li>
          <li>É permitida uma conta por pessoa física ou pessoa jurídica, a menos que tenhamos autorizado expressamente contas adicionais por escrito</li>
          <li>Você precisa nos avisar imediatamente em <Email name="support" /> se suspeitar de acesso não autorizado à sua conta</li>
          <li>É proibido compartilhar as credenciais da sua conta com terceiros, a menos que explicitamente permitido por escrito</li>
        </ul>
      </LegalSection>

      <LegalSection number="4" title="Condições de Pagamento">

        <LegalSubSection title="4.1 Ciclos de Faturamento">
          <p>
            Os serviços são cobrados antecipadamente em um ciclo que você seleciona no cadastro. Os
            intervalos de faturamento disponíveis (mensal, trimestral, semestral ou anual) dependem
            do tipo de serviço. As faturas são geradas automaticamente e enviadas ao endereço de
            e-mail cadastrado antes da data de vencimento.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.2 Meios de Pagamento e Processamento">
          <p>
            O pagamento precisa ser feito pelo nosso portal de faturamento em billing.wslatl.com. Os
            meios de pagamento aceitos estão listados no portal. Os pagamentos são processados por
            processadores de pagamento terceirizados. Ao fornecer informações de pagamento, você nos
            autoriza a cobrar do meio de pagamento que você selecionar todas as taxas devidas.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.3 Atrasos de Pagamento e Suspensão do Serviço">
          <p>
            Os serviços são considerados em atraso se o pagamento não for recebido até a data de
            vencimento da fatura. Aplica-se o seguinte às contas em atraso:
          </p>
          <ul>
            <li>Os serviços podem ser suspensos se o pagamento não for recebido em <strong>7 dias</strong> após a data de vencimento</li>
            <li>Os serviços suspensos podem ser rescindidos e os dados excluídos permanentemente se o pagamento não for recebido em <strong>14 dias</strong> após a suspensão</li>
            <li>A WSLATL não se responsabiliza por perda de dados, interrupção de negócios ou quaisquer outros danos decorrentes da suspensão ou rescisão do serviço por falta de pagamento</li>
            <li>Pode ser aplicada uma taxa de reativação a serviços que foram suspensos por falta de pagamento</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="4.4 Política de Reembolso">
          <p>
            A nossa política de reembolso é mantida como documento separado em{' '}
            <Link href={siteConfig.paths.refund}>{siteConfig.siteUrl}{siteConfig.paths.refund}</Link>{' '}
            e é incorporada a estes Termos por referência. A Política de Reembolso é a fonte oficial
            para todas as questões sobre elegibilidade de reembolso, prazos, motivos elegíveis,
            processamento e itens não reembolsáveis. As regras da Política de Reembolso prevalecem
            sobre qualquer texto conflitante em outra parte destes Termos.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.5 Mudanças de Preço">
          <p>
            A WSLATL se reserva o direito de alterar os preços dos serviços. Daremos, no mínimo,{' '}
            <strong>30 dias de aviso prévio por escrito</strong> de
            qualquer aumento de preço, por e-mail ao seu endereço cadastrado. Os serviços existentes
            serão mantidos pelo preço atual até a primeira data de renovação após esse prazo de
            aviso.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.6 Impostos">
          <p>
            As taxas de serviço não incluem os impostos aplicáveis. Você é responsável por pagar
            todos os impostos, tributos ou encargos impostos pelo governo aplicáveis ao seu uso dos
            nossos serviços, salvo se especificamente incluídos na sua fatura.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="5" title="Acordo de Nível de Serviço (SLA)">
        <p>
          O nosso Acordo de Nível de Serviço também é publicado como documento autônomo em{' '}
          <Link href={siteConfig.paths.sla}>
            {siteConfig.siteUrl}{siteConfig.paths.sla}
          </Link>, que é mais fácil de encontrar e de citar. Essa página reafirma esta seção; ela não
          acrescenta nada a ela nem a altera. Os compromissos abaixo são reproduzidos lá na íntegra
          e, se algum dia os dois divergirem, prevalece esta seção.
        </p>

        <LegalSubSection title="5.1 Metas de Uptime">
          <UptimeTable />
          <p>
            O uptime é medido por mês civil e exclui as janelas de manutenção programada e a
            indisponibilidade causada por eventos fora do nosso controle razoável (veja a Seção 15,
            Força Maior).
          </p>
        </LegalSubSection>

        <LegalSubSection title="5.2 Manutenção Programada">
          <p>
            Daremos, no mínimo, <strong>24 horas de aviso prévio</strong> para
            janelas de manutenção programada, pela nossa página de status (status.wslatl.com) e/ou
            por e-mail aos clientes afetados. A manutenção emergencial necessária para proteger a
            integridade ou a segurança do serviço pode ser realizada sem aviso prévio, embora
            comuniquemos o mais rápido possível.
          </p>
        </LegalSubSection>

        <LegalSubSection title="5.3 Créditos de SLA">
          <p>
            Se deixarmos de cumprir a meta de uptime aplicável por culpa nossa, você pode solicitar
            um crédito de serviço equivalente a <strong>10% do custo mensal do serviço afetado</strong> por
            incidente que se qualifique. Os créditos são aplicados ao saldo da sua conta e não
            excederão o custo de um mês completo do serviço afetado. Os créditos de serviço são a
            sua única e exclusiva reparação por falhas de uptime e não lhe dão direito a reembolso
            em dinheiro.
          </p>
          <p>
            Para solicitar um crédito, entre em contato conosco em até 15 dias após o incidente pelo
            e-mail <Email name="support" /> com a data, a duração e a natureza da interrupção.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="6" title="Uso Aceitável">
        <p>
          Todo uso dos serviços da WSLATL é regido pela nossa Política de Uso Aceitável (AUP), que é
          incorporada a estes Termos por referência e está disponível em{' '}
          <Link href={siteConfig.paths.acceptableUse}>{siteConfig.siteUrl}{siteConfig.paths.acceptableUse}</Link>.
          Você concorda em cumprir a AUP em todos os momentos.
        </p>
        <p>
          As violações da AUP podem resultar em suspensão ou rescisão imediata dos seus serviços,
          sem aviso e sem qualquer direito a reembolso. Violações graves podem ser encaminhadas às
          autoridades policiais.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Propriedade Intelectual">
        <p>
          Todo o software, ferramental, documentação e materiais desenvolvidos e fornecidos pela
          WSLATL (excluindo softwares de terceiros, como o Pterodactyl, que está sujeito à sua
          própria licença) são e continuam sendo propriedade intelectual da WSLATL LLC. Você não
          pode reproduzir, distribuir, fazer engenharia reversa nem criar obras derivadas dos nossos
          materiais proprietários sem o nosso consentimento prévio por escrito.
        </p>
        <p>
          Você mantém a propriedade integral de todos os dados, conteúdos e softwares que envia para
          a infraestrutura da WSLATL ou executa nela. Você concede à WSLATL uma licença limitada,
          não exclusiva e intransferível para armazenar, processar e transmitir o seu conteúdo
          apenas na medida necessária para prestar os serviços que você contratou.
        </p>
      </LegalSection>

      <LegalSection number="8" title="DMCA e Direitos Autorais">
        <p>
          A WSLATL LLC cumpre o Digital Millennium Copyright Act (DMCA), 17 U.S.C. &sect;&nbsp;512.
          A nossa Política de DMCA completa é publicada em{' '}
          <Link href={siteConfig.paths.dmca}>
            {siteConfig.siteUrl}{siteConfig.paths.dmca}
          </Link>{' '}
          e é incorporada a estes Termos por referência. Ela expõe o nosso agente designado, o
          processo de contranotificação, o prazo legal de restabelecimento e a nossa política para
          infratores reincidentes. Leia-a antes de nos notificar ou de contestar uma remoção.
        </p>
        <p>
          Em resumo: se você acredita que um conteúdo hospedado na infraestrutura da WSLATL viola os
          seus direitos autorais, envie uma notificação de remoção DMCA por escrito para:
        </p>
        <InfoCard>
          <InfoRow label="E-mail">
            <Email name="dmca" />
          </InfoRow>
          <InfoRow label="Linha de assunto">
            DMCA Takedown Notice
          </InfoRow>
        </InfoCard>
        <p>A sua notificação precisa incluir, sob pena de perjúrio:</p>
        <ul>
          <li>As suas informações de contato (nome, endereço, telefone, e-mail)</li>
          <li>Uma descrição da obra protegida por direitos autorais que você alega ter sido violada</li>
          <li>A identificação do material alegadamente infrator e da sua localização na nossa infraestrutura</li>
          <li>Uma declaração de que você tem a crença de boa-fé de que o uso contestado não é autorizado pelo titular dos direitos autorais, pelo seu agente ou pela lei</li>
          <li>Uma declaração de que as informações da notificação são exatas e, sob pena de perjúrio, de que você é o titular dos direitos autorais ou está autorizado a agir em nome do titular</li>
          <li>A sua assinatura física ou eletrônica</li>
        </ul>
        <p>
          As contranotificações podem ser enviadas para o mesmo endereço de e-mail e precisam
          cumprir os requisitos expostos na Seção 4 da nossa{' '}
          <Link href={siteConfig.paths.dmca}>Política de DMCA</Link>.
          Reservamo-nos o direito de encerrar as contas de clientes que sejam infratores
          reincidentes de direitos autorais, de acordo com a política para infratores reincidentes
          da Seção 5 daquele documento.
        </p>
      </LegalSection>

      <LegalSection number="9" title="Rescisão">

        <LegalSubSection title="9.1 Cancelamento por Você">
          <p>
            Você pode cancelar o seu serviço a qualquer momento enviando um pedido de cancelamento
            pelo nosso portal de faturamento ou falando com a gente pelo Discord ou por e-mail. Os
            cancelamentos entram em vigor no fim do ciclo de faturamento atual, a menos que um
            cancelamento imediato seja explicitamente solicitado. Nenhum reembolso é emitido pelos
            dias restantes de um período de faturamento cancelado, a menos que a nossa política de
            reembolso se aplique (veja a Seção 4.4).
          </p>
        </LegalSubSection>

        <LegalSubSection title="9.2 Rescisão pela WSLATL">
          <p>
            Podemos suspender ou rescindir os seus serviços imediatamente e sem aviso prévio se:
          </p>
          <ul>
            <li>Você violar estes Termos, a Política de Uso Aceitável ou a nossa Política de Privacidade</li>
            <li>Você tiver faturas em aberto não pagas além do período de tolerância (veja a Seção 4.3)</li>
            <li>As suas atividades representarem um risco ativo à infraestrutura da nossa rede, a outros clientes ou a terceiros na internet</li>
            <li>Recebermos uma ordem legal válida exigindo a rescisão ou a suspensão</li>
            <li>A continuidade da prestação dos serviços expuser a WSLATL LLC a responsabilidade legal</li>
            <li>Você fornecer informações falsas ou fraudulentas em qualquer momento do ciclo de vida da sua conta</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="9.3 Efeito da Rescisão">
          <p>
            Com a rescisão da sua conta:
          </p>
          <ul>
            <li>O acesso a todos os serviços e painéis será revogado imediatamente</li>
            <li>Os seus dados podem ser recuperados mediante pedido por um prazo limitado de até 14 dias após a rescisão; depois desse prazo, quaisquer dados remanescentes são excluídos de forma permanente e irreversível e, em todos os casos, em no máximo 90 dias após o encerramento da conta, de forma consistente com a tabela de retenção da nossa Política de Privacidade</li>
            <li>Quaisquer pedidos de recuperação de dados precisam ser feitos dentro do prazo de recuperação de 14 dias e ficam sujeitos ao nosso critério</li>
            <li>A WSLATL não se responsabiliza por qualquer perda de dados decorrente da rescisão da conta</li>
            <li>Todas as faturas em aberto continuam devidas e exigíveis após a rescisão</li>
          </ul>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="10" title="Isenção de Garantias">
        <p>
          OS SERVIÇOS SÃO FORNECIDOS &ldquo;NO ESTADO EM QUE SE ENCONTRAM&rdquo; E &ldquo;CONFORME
          DISPONÍVEIS&rdquo;, SEM GARANTIA DE QUALQUER TIPO, EXPRESSA OU IMPLÍCITA. NA MÁXIMA
          EXTENSÃO PERMITIDA PELA LEI APLICÁVEL, A WSLATL LLC SE EXIME EXPRESSAMENTE DE TODAS AS
          GARANTIAS, INCLUINDO, ENTRE OUTRAS:
        </p>
        <ul className="uppercase">
          <li>Garantias implícitas de comercialização e de adequação a uma finalidade específica</li>
          <li>Garantias de não violação</li>
          <li>Garantias de que os serviços serão ininterruptos, livres de erros ou livres de componentes nocivos</li>
          <li>Garantias de que os defeitos serão corrigidos dentro de qualquer prazo específico</li>
          <li>Garantias quanto à exatidão ou à integridade de qualquer conteúdo</li>
        </ul>
        <p>
          Algumas jurisdições não permitem a exclusão de certas garantias. Nessas jurisdições, as
          nossas isenções se aplicam na máxima extensão permitida por lei.
        </p>
      </LegalSection>

      <LegalSection number="11" title="Limitação de Responsabilidade">
        <p>
          NA MÁXIMA EXTENSÃO PERMITIDA PELA LEI APLICÁVEL, A WSLATL LLC E OS SEUS SÓCIOS,
          ADMINISTRADORES, DIRETORES, EMPREGADOS, CONTRATADOS E AGENTES NÃO SERÃO RESPONSÁVEIS POR
          QUAISQUER:
        </p>
        <ul className="uppercase">
          <li>Danos indiretos, incidentais, especiais, consequenciais ou punitivos</li>
          <li>Perda de lucros, receita, dados, fundo de comércio ou oportunidades de negócio</li>
          <li>Danos decorrentes de acesso não autorizado aos seus dados ou de alteração deles</li>
          <li>Danos decorrentes de você confiar em informações obtidas por meio dos nossos serviços</li>
          <li>Danos causados por eventos fora do nosso controle razoável</li>
        </ul>
        <p>
          A NOSSA RESPONSABILIDADE CUMULATIVA TOTAL PERANTE VOCÊ POR TODAS AS RECLAMAÇÕES
          DECORRENTES DESTES TERMOS OU DO SEU USO DOS NOSSOS SERVIÇOS, OU A ELES RELACIONADAS, NÃO
          EXCEDERÁ O VALOR TOTAL QUE VOCÊ PAGOU À WSLATL LLC NOS <strong>TRÊS (3) MESES</strong> IMEDIATAMENTE
          ANTERIORES AO EVENTO QUE DEU ORIGEM À RECLAMAÇÃO.
        </p>
        <p>
          Algumas jurisdições não permitem certas limitações de responsabilidade. Nessas
          jurisdições, a nossa responsabilidade é limitada na máxima extensão permitida por lei.
        </p>
      </LegalSection>

      <LegalSection number="12" title="Indenização">
        <p>
          Você concorda em indenizar, defender e isentar de responsabilidade a WSLATL LLC, os seus
          sócios, administradores, diretores, empregados, contratados e agentes de todas e quaisquer
          reclamações, responsabilidades, danos, perdas, custos e despesas (incluindo honorários
          advocatícios razoáveis) decorrentes de ou relacionados a:
        </p>
        <ul>
          <li>O seu uso dos nossos serviços em violação destes Termos, da AUP ou da lei aplicável</li>
          <li>O conteúdo que você hospeda, transmite ou armazena na infraestrutura da WSLATL</li>
          <li>A sua violação de quaisquer direitos de terceiros, incluindo direitos de propriedade intelectual</li>
          <li>Quaisquer informações falsas ou fraudulentas que você forneça à WSLATL</li>
          <li>Qualquer disputa entre você e um terceiro decorrente do seu uso dos nossos serviços</li>
        </ul>
        <p>
          A WSLATL se reserva o direito de assumir a defesa e o controle exclusivos de qualquer
          matéria sujeita a indenização por você, às suas custas, e você concorda em cooperar com a
          nossa defesa.
        </p>
      </LegalSection>

      <LegalSection number="13" title="Lei Aplicável e Resolução de Disputas">
        <p>
          Estes Termos de Serviço são regidos e interpretados de acordo com as leis do Estado do
          Missouri, Estados Unidos, sem considerar os princípios de conflito de leis.
        </p>
        <p>
          Qualquer disputa legal, reclamação ou controvérsia decorrente destes Termos ou do seu uso
          dos serviços da WSLATL, ou a eles relacionada, será resolvida exclusivamente nos tribunais
          estaduais ou federais localizados no Estado do Missouri. Você consente com a jurisdição
          pessoal desses tribunais e renuncia a qualquer objeção ao foro no Missouri.
        </p>
        <p>
          Antes de iniciar um processo judicial formal, as duas partes concordam em tentar resolver
          as disputas de forma informal. Para iniciar a resolução informal, entre em contato conosco
          em <Email name="support" />{' '}
          com uma descrição escrita da disputa. Se a disputa não for resolvida em{' '}
          <strong>30 dias</strong> após esse aviso, qualquer das
          partes pode buscar medidas judiciais formais.
        </p>
      </LegalSection>

      <LegalSection number="14" title="Modificação dos Termos">
        <p>
          A WSLATL se reserva o direito de modificar estes Termos a qualquer momento. Para
          alterações substanciais, vamos:
        </p>
        <ul>
          <li>Dar, no mínimo, <strong>14 dias de aviso prévio</strong> por e-mail ao seu endereço cadastrado</li>
          <li>Publicar os Termos atualizados em {siteConfig.paths.terms} com uma data de vigência revisada</li>
          <li>Resumir as alterações no e-mail de aviso</li>
        </ul>
        <p>
          O seu uso continuado dos nossos serviços após a data de vigência de quaisquer Termos
          revisados constitui a sua aceitação dessas alterações. Se você se opuser a alterações
          substanciais, pode cancelar o seu serviço antes da data de vigência e receber um reembolso
          proporcional por qualquer período pré-pago, a nosso critério.
        </p>
      </LegalSection>

      <LegalSection number="15" title="Disposições Gerais">

        <LegalSubSection title="Força Maior">
          <p>
            A WSLATL não se responsabiliza por atrasos ou falhas no cumprimento decorrentes de
            causas fora do nosso controle razoável, incluindo desastres naturais, casos fortuitos,
            atos governamentais, falhas na infraestrutura da internet, interrupções em data center
            causadas por terceiros, conflitos trabalhistas ou outros eventos extraordinários.
            Faremos esforços razoáveis para avisar os clientes afetados e restabelecer o serviço o
            mais rápido possível.
          </p>
        </LegalSubSection>

        <LegalSubSection title="Acordo Integral">
          <p>
            Estes Termos de Serviço, junto com a nossa Política de Privacidade e a nossa Política de
            Uso Aceitável, constituem o acordo integral entre você e a WSLATL LLC quanto ao seu uso
            dos nossos serviços e substituem todos os acordos, declarações ou entendimentos
            anteriores.
          </p>
        </LegalSubSection>

        <LegalSubSection title="Independência das Cláusulas">
          <p>
            Se qualquer disposição destes Termos for considerada inválida, ilegal ou inexequível por
            um tribunal competente, essa disposição será modificada na medida mínima necessária para
            torná-la exequível, e as demais disposições continuarão em pleno vigor e efeito.
          </p>
        </LegalSubSection>

        <LegalSubSection title="Renúncia">
          <p>
            A nossa falha em fazer valer qualquer direito ou disposição destes Termos em qualquer
            ocasião não constitui renúncia a esse direito ou disposição. Qualquer renúncia precisa
            ser feita por escrito e assinada por um representante autorizado da WSLATL LLC.
          </p>
        </LegalSubSection>

        <LegalSubSection title="Cessão">
          <p>
            Você não pode ceder nem transferir estes Termos, nem quaisquer direitos ou obrigações
            decorrentes deles, sem o nosso consentimento prévio por escrito. A WSLATL pode ceder ou
            transferir estes Termos, no todo ou em parte, em conexão com uma fusão, aquisição ou
            venda de substancialmente todos os ativos, mediante aviso a você.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="16" title="Contato">
        <p>
          Dúvidas sobre estes Termos de Serviço devem ser dirigidas a:
        </p>
        <CompanyContact />
      </LegalSection>
    </>
  )
}
