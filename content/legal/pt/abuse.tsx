import { Link } from '@/components/legal/doc-link'
import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'
import { Callout, CompanyContact, InfoCard, InfoRow } from '@/components/legal/blocks'
import { Email } from '@/components/ui/email'
import { ShortLink } from '@/components/ui/short-link'

export default function AbuseContent() {
  return (
    <>
      <LegalSection number="1" title="Visão Geral e Escopo">
        <p>
          Esta Política de Abuso explica como denunciar abuso da infraestrutura operada pela WSLATL
          LLC (&ldquo;WSLATL&rdquo;, &ldquo;nós&rdquo;, &ldquo;nosso&rdquo; ou &ldquo;nos&rdquo;), o
          que fazemos com uma denúncia depois de recebê-la e como lidamos com serviços na nossa
          rede que são a origem do abuso.
        </p>
        <p>
          Ela acompanha a nossa{' '}
          <Link href={siteConfig.paths.acceptableUse}>Política de Uso Aceitável</Link>,
          que define o que é e o que não é permitido na nossa infraestrutura, e os nossos{' '}
          <Link href={siteConfig.paths.terms}>Termos de Serviço</Link>,
          aos quais ambas são incorporadas por referência. Reclamações de direitos autorais são
          tratadas pela nossa{' '}
          <Link href={siteConfig.paths.dmca}>Política de DMCA</Link>{' '}
          e não por esta página.
        </p>
        <p>
          Somos uma empresa de hospedagem pequena e privada, e levamos a sério o abuso da nossa
          rede, tanto porque ele prejudica outras pessoas quanto porque coloca em risco os clientes
          que compartilham a nossa infraestrutura. Toda denúncia crível é investigada.
        </p>
      </LegalSection>

      <LegalSection number="2" title="Como Denunciar Abuso">
        <p>
          Se você acredita que alguma infraestrutura da WSLATL (um servidor, endereço IP, site,
          servidor de jogos ou e-mail) está sendo usada para atividade abusiva, ilegal ou danosa,
          denuncie à nossa equipe antiabuso. Este é o caminho mais rápido para chegar às pessoas que
          podem agir sobre isso.
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
          O e-mail é o canal que monitoramos para abuso e o que gera um registro sobre o qual
          podemos agir. Uma denúncia feita apenas em um canal do Discord pode passar despercebida;
          se o assunto for urgente, mande por e-mail.
        </p>
      </LegalSection>

      <LegalSection number="3" title="O Que Incluir em uma Denúncia">
        <p>
          Quanto mais precisa for a sua denúncia, mais rápido conseguimos encontrar a origem e agir.
          Por favor, inclua o máximo que você tiver do seguinte:
        </p>
        <ul>
          <li>O endereço IP, o domínio, a URL ou o servidor envolvido</li>
          <li>Os horários da atividade, com o fuso horário ou a diferença em relação ao UTC</li>
          <li>Trechos de log relevantes, cabeçalhos de e-mail ou capturas de pacotes, colados como texto sempre que possível</li>
          <li>Uma descrição clara da atividade e por que você acredita que ela é abusiva</li>
          <li>Como entrar em contato com você se precisarmos de mais informações</li>
        </ul>
        <p>
          Os logs são mais úteis na sua forma original em texto, com os cabeçalhos completos
          intactos. Capturas de tela servem como complemento, mas são mais difíceis de verificar
          sozinhas.
        </p>
      </LegalSection>

      <LegalSection number="4" title="O Que Tratamos como Abuso">
        <p>
          Abuso é qualquer uso da nossa infraestrutura que viole a nossa{' '}
          <Link href={siteConfig.paths.acceptableUse}>Política de Uso Aceitável</Link>{' '}
          ou a lei aplicável. As categorias comuns sobre as quais agimos incluem:
        </p>
        <ul>
          <li>
            <strong>Ataques de rede.</strong> Tráfego de DDoS,
            varredura de portas e de vulnerabilidades, tentativas de força bruta ou tentativas de
            invasão originadas do nosso espaço de IP.
          </li>
          <li>
            <strong>Spam e mensagens não solicitadas.</strong> E-mail
            em massa ou não solicitado, open relays de e-mail e falsificação de e-mail.
          </li>
          <li>
            <strong>Phishing e fraude.</strong> Páginas ou
            serviços criados para roubar credenciais ou dados de pagamento, ou para enganar pessoas
            com fins financeiros.
          </li>
          <li>
            <strong>Malware.</strong> Hospedar ou distribuir
            vírus, ransomware, servidores de comando e controle ou outros softwares maliciosos.
          </li>
          <li>
            <strong>Conteúdo ilegal.</strong> Conteúdo cuja
            hospedagem é ilícita, incluindo o material descrito na Seção 3 da nossa Política de Uso
            Aceitável.
          </li>
          <li>
            <strong>Assédio e ameaças.</strong> Usar os nossos
            serviços para assediar, ameaçar, praticar doxxing ou colocar uma pessoa em perigo.
          </li>
        </ul>
        <p>
          Para o relato completo do que é proibido, veja as Seções 3 e 4 da Política de Uso
          Aceitável. A violação de direitos autorais é tratada separadamente sob a{' '}
          <Link href={siteConfig.paths.dmca}>Política de DMCA</Link>.
        </p>
      </LegalSection>

      <LegalSection number="5" title="O Que Acontece Depois da Sua Denúncia">
        <p>Analisamos toda denúncia crível. O nosso processo geral é:</p>
        <ul>
          <li>
            <strong>Confirmamos o recebimento.</strong> Buscamos
            confirmar o recebimento de uma denúncia enviada por e-mail o mais rápido que
            conseguimos, e priorizamos abuso ativo e em andamento sobre o trabalho de rotina.
          </li>
          <li>
            <strong>Investigamos.</strong> Identificamos o
            serviço envolvido, analisamos as provas e determinamos se as nossas políticas ou a lei
            foram violadas.
          </li>
          <li>
            <strong>Agimos de forma proporcional.</strong> Dependendo
            da gravidade, podemos contatar o cliente para remediação, remover ou desativar conteúdo
            específico, suspender o serviço ou encerrar a conta. A aplicação segue a Seção 9 da
            Política de Uso Aceitável.
          </li>
        </ul>

        <LegalSubSection title="5.1 Abuso Ativo de Saída: Suspender Primeiro">
          <p>
            Quando um serviço na nossa rede é a origem ativa de abuso de saída, como um DDoS ao
            vivo, um disparo de spam em andamento ou varredura ativa, vamos suspender o serviço
            primeiro e investigar depois, para proteger os outros clientes e a internet como um
            todo. Entramos em contato com o cliente afetado logo após a suspensão para explicar o
            que encontramos.
          </p>
        </LegalSubSection>

        <LegalSubSection title="5.2 O Que Podemos Contar a Você">
          <p>
            Confirmaremos que uma denúncia foi recebida e que houve providências sempre que
            pudermos razoavelmente fazê-lo. Não compartilhamos os dados da conta de outro cliente,
            os detalhes de uma investigação nem o resultado de medidas tomadas contra terceiros, e
            podemos ser limitados no que podemos divulgar enquanto uma investigação estiver aberta
            ou quando a lei exigir confidencialidade.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="6" title="Cooperação com Registros e Autoridades">
        <p>
          Quando apropriado, cooperamos com registros de abuso e serviços de denúncia e podemos
          compartilhar logs relevantes e informações de identificação com eles ou com os operadores
          das redes afetadas. Preservamos provas e comunicamos às autoridades policiais quando a
          lei exige ou quando a conduta justifica.
        </p>
        <Callout tone="critical" title="Material de abuso sexual infantil">
          Temos tolerância zero com material de abuso sexual infantil (CSAM). CSAM confirmado é
          comunicado imediatamente ao National Center for Missing &amp; Exploited Children
          (NCMEC) e às autoridades policiais, a conta é encerrada e as provas são preservadas.
          Para denunciar suspeita de CSAM na nossa infraestrutura, escreva para <Email name="abuse" /> com
          &ldquo;CSAM&rdquo; na linha de assunto, ou denuncie diretamente ao NCMEC pela
          CyberTipline.
        </Callout>
      </LegalSection>

      <LegalSection number="7" title="Solicitações de Autoridades Policiais">
        <p>
          Autoridades policiais que busquem registros ou preservação devem entrar em contato
          conosco em{' '}
          <Email name="abuse" />{' '}
          com &ldquo;Law Enforcement Request&rdquo; na linha de assunto. Respondemos a processo
          legal válido notificado à WSLATL LLC e preservaremos os registros relevantes mediante
          pedido de preservação com escopo adequado enquanto o processo apropriado é obtido. Não
          divulgamos dados de clientes sem processo legal válido, exceto quando a lei permite ou
          exige, como em uma emergência que envolva risco de morte ou de dano físico grave.
        </p>
      </LegalSection>

      <LegalSection number="8" title="Denúncias Que Não Podemos Tratar Aqui">
        <p>Alguns assuntos pertencem a outro canal:</p>
        <ul>
          <li>
            <strong>Direitos autorais.</strong> Notificações de
            remoção por direitos autorais e contranotificações passam pela nossa{' '}
            <Link href={siteConfig.paths.dmca}>Política de DMCA</Link>,
            não por esta página.
          </li>
          <li>
            <strong>Conteúdo que não hospedamos.</strong> Para
            um domínio registrado em outro lugar, conteúdo em uma rede de terceiros ou uma conta em
            uma plataforma que não operamos, não somos o destinatário correto e não podemos remover
            o material. Denuncie ao operador daquele serviço.
          </li>
          <li>
            <strong>Dúvidas de faturamento e de conta.</strong>{' '}
            Dúvidas sobre o seu próprio serviço ou sobre faturamento vão para{' '}
            <Email name="support" />, não para o canal de denúncia de abuso.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="9" title="Denúncia de Boa-Fé">
        <p>
          Denuncie com honestidade e boa-fé. Denúncias de abuso sabidamente falsas ou de má-fé,
          denúncias feitas para assediar outro cliente e tentativas de usar este canal como arma
          contra um concorrente desperdiçam o tempo que gastaríamos com dano real. Podemos recusar
          agir sobre denúncias vindas de uma origem que tenha abusado repetidamente deste processo.
        </p>
      </LegalSection>

      <LegalSection number="10" title="Alterações a Esta Política">
        <p>
          Podemos atualizar esta Política de Abuso para refletir mudanças nas nossas práticas, nos
          nossos serviços ou na lei aplicável. Quando fizermos alterações substanciais,
          atualizaremos a data de vigência no topo desta página e publicaremos a política
          atualizada em{' '}
          <Link href={siteConfig.paths.abuse}>
            {siteConfig.siteUrl}{siteConfig.paths.abuse}
          </Link>.
        </p>
      </LegalSection>

      <LegalSection number="11" title="Contato">
        <p>
          As denúncias de abuso devem ir para a nossa equipe antiabuso. Dúvidas gerais sobre esta
          política podem ser enviadas para os endereços abaixo.
        </p>
        <CompanyContact>
          <InfoRow label="Abuso">
            <Email name="abuse" />
          </InfoRow>
          <InfoRow label="Geral">
            <Email name="support" /> ou <Email name="hello" />
          </InfoRow>
        </CompanyContact>
      </LegalSection>
    </>
  )
}
