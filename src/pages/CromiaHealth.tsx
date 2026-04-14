import React, { useState, useEffect } from 'react';
import MeshBackground from '../components/MeshBackground';

const Chapter = ({
  number,
  title,
  text,
  images,
  mockup,
  imageSide = 'right',
  onImageClick
}: {
  number: string,
  title: string,
  text: string | React.ReactNode,
  images?: string[],
  mockup?: React.ReactNode,
  imageSide?: 'left' | 'right',
  onImageClick?: (images: string[], index: number) => void
}) => (
  <div className={`flex max-w-[860px] mx-auto flex-col ${imageSide === 'left' ? 'md:flex-row-reverse' : 'md:flex-row'} items-start gap-10 md:gap-10 mb-32`}>
    <div className="w-full md:w-[60%] bg-white/80 backdrop-blur-sm p-11 rounded-2xl shadow-xl -mt-12">
      <div className="text-[22px] font-bold tracking-widest uppercase text-cromia-gold mb-6 opacity-80">Item {number}</div>
      <h2 className="font-fraunces text-3xl md:text-4xl font-black text-[#3a3a3a] mb-6 leading-[1.1]">
        {title}
      </h2>
      <div className="text-[18px] text-cromia-ink2 leading-[1.8] font-light opacity-90">
        {text}
      </div>
    </div>
    <div className="w-full md:w-[55%] flex flex-col gap-10 mt-5">
      {images && images.length > 0 ? (
        images.map((img, idx) => (
          <div
            key={idx}
            className={`bg-white/60 backdrop-blur-sm ${idx === 0 ? '-mt-12' : ''} rounded-lg border border-cromia-border/40 shadow-lg relative overflow-hidden group transition-all duration-500 hover:shadow-2xl cursor-zoom-in`}
            onClick={() => onImageClick?.(images, idx)}
          >
            <div className="p-3 md:p-3 bg-cromia-bg/20">
              <div className="relative rounded-lg overflow-hidden shadow-sm border border-cromia-border/20">
                <img src={img} alt={`${title} - ${idx + 1}`} className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.1]" />
              </div>
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(180,95,59,0.03),transparent)] pointer-events-none" />
          </div>
        ))
      ) : mockup ? (
        <div className="bg-white/60 backdrop-blur-sm -mt-12 border border-cromia-border/40 shadow-lg relative overflow-hidden p-0 md:p-0">
          <div className="bg-cromia-bg/20 p-8 min-h-[340px] flex flex-col justify-center rounded-[2px]">
            {mockup}
          </div>
        </div>
      ) : (
        <div className="bg-white/60 backdrop-blur-sm -mt-12 border border-cromia-border/40 shadow-lg relative overflow-hidden p-8 flex items-center justify-center text-cromia-muted/30 italic text-sm font-space-grotesk tracking-widest">
          [ Espaço para Print da Área: {title} ]
        </div>
      )}
    </div>
  </div>
);

const ImageLightbox = ({ images, initialIndex, onClose }: { images: string[], initialIndex: number, onClose: () => void }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setCurrentIndex(prev => prev < images.length - 1 ? prev + 1 : prev);
      }
      if (e.key === 'ArrowLeft') {
        setCurrentIndex(prev => prev > 0 ? prev - 1 : prev);
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length, onClose]);

  const src = images[currentIndex];

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => prev < images.length - 1 ? prev + 1 : prev);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => prev > 0 ? prev - 1 : prev);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md transition-all duration-300 animate-in fade-in"
      onClick={onClose}
    >
      <button
        className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-[110]"
        onClick={onClose}
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {images.length > 1 && (
        <>
          {currentIndex > 0 && (
            <button
              className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-4 z-[110]"
              onClick={handlePrev}
            >
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {currentIndex < images.length - 1 && (
            <button
              className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-4 z-[110]"
              onClick={handleNext}
            >
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </>
      )}

      <div
        key={currentIndex}
        className="max-w-[90vw] max-h-[85vh] relative animate-in zoom-in-95 duration-300 flex flex-col items-center"
        onClick={e => e.stopPropagation()}
      >
        <img
          src={src}
          alt="Visualização ampliada"
          className="max-w-full max-h-[85vh] w-[70vw] h-auto object-contain shadow-2xl rounded-sm"
        />
        {images.length > 1 && (
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-sm tracking-widest font-space-grotesk">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
};

const CromiaHealth = () => {
  const [lightboxData, setLightboxData] = useState<{ images: string[], index: number } | null>(null);

  const handleImageClick = (images: string[], index: number) => {
    setLightboxData({ images, index });
  };

  useEffect(() => {
    if (lightboxData) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [lightboxData]);

  return (
    <>
      <MeshBackground />
      <div className="bg-cromia-gold/5 text-[#b45f3b] font-space-grotesk min-h-screen m-0 p-0 overflow-x-hidden pt-4">
        <div className="max-w-[1100px] mx-auto px-6 relative">

          {/* Logo */}
          <a href="https://cromia.app" className="flex justify-center">
            <img src="/imgs/logo.svg" alt="Cromia Logo" className="w-80 md:w-80 mb-4" />
          </a>

          {/* Hero Section */}
          <div className="mb-32  p-15 text-left max-w-[860px] h-[850px] mx-auto bg-white/80 backdrop-blur-sm border border-cromia-border/40 rounded-2xl shadow-lg relative overflow-x-hidden overflow-y-auto scrollbar">

            <h1 className="font-fraunces font-black not-italic text-6xl text-cromia-grey">Cromia Health</h1>
            <h2 className="font-fraunces text-4xl md:text-4xl tracking-tight lg:text-5xl font-semibold text-cromia-gold-dark leading-[1] m-0 mb-8">
              Ecossistema que
              <em className="italic font-light text-[#b45f3b] text-6xl"> muda o jogo</em>
            </h2>
            <div className="mt-16 h-[1px] w-[740px] bg-cromia-gold/80 mx-auto" />
            <p className="text-[19px] text-cromia-ink2 leading-[1.7] font-light mt-20">
              <span className="font-semibold">Cromia Health</span> é um Ecossistema desenvolvido meticulosamente para o uso com as mais modernas <span className="font-semibold">ferramentas de automação</span> e com a nossa <span className="font-semibold italic">Yasmim</span>, uma agente de <span className="font-semibold">IA</span> com atendimento humanizado, capaz de fazer multiplos agendamentos ao mesmo tempo, sem filas, sem qualquer intervenção humana e o detalhe mais importante: com uma <span className="font-semibold">escala de 24/7</span>.<br /><br />
              <span className="font-semibold italic">Yasmim</span> realiza reagendamentos, confirmações, cancelamentos e muito mais. Responde as <span className="font-semibold">"Perguntas Mais Frequentes"</span> dos pacientes, que hoje são respondidas pela recepção ou deixam de ser respondidas, gerando perda de receita.<br /><br />
              O <span className="font-semibold">Portal Administrativo</span>, muito mais que um <span className="italic">Sistema de Agendamento</span>, é um Painel Administrativo inteligente projetado para Clínicas que buscam eficiência absoluta e crescimento em escala com as ferramentas mais modernas do Mercado.<br /><br />
              E para complementar esse <span className="font-semibold">Ecossistema</span>, várias automações são implementadas para uma melhor experiência dos envolvidos e gerenciamento por parte dos administradores, sem qualquer necessidade de programação e envolvimento humano:<br /><br />
              • Envio diário direcionado aos Gestores da Clínica com os números do dia: Faturamento Bruto, número de agendamentos X cancelamentos, especialidades mais procuradas, médicos mais agendados, planos de saúde mais usados, relatórios que permitem uma melhor administração de recursos e planejamentos estratégicos.<br /><br />
              • Envio diário das Agendas do Dia Seguinte direcionada ao Corpo Clínico com informações relevantes.<br /><br />
              • Envio de lembretes de consultas para os pacientes (no dia anterior e 2 horas antes da consulta), imprescindíveis para reduzir o índice de <span className="font-semibold">No-Show</span>.<br /><br />
              • O acesso ao Painel é na Nuvem e pode ser logado em qualquer computador com acesso à Internet, inclusive de dispositivos móveis, trazendo flexibilidade e mobilidade para a gestão da Clínica. Você não precisa estar preso aos computadores da rede da Clínica.<br /><br />
              Aqui é uma breve apresentação do que o <span className="font-semibold">Cromia Health</span> é capaz de oferecer, suas funcionalidades e como ele pode transformar a gestão da sua Clínica e o impacto financeiro que ele pode gerar.
            </p>

          </div>

          {/* Jornada por Capítulos */}
          <div className="space-y-12">

            <Chapter
              number="01"
              title="Dashboard: O pulso da sua clínica em tempo real"
              text={
                <p>
                  O Painel Administrativo possui um Dashboard gráfico de acompanhamento de dados relevantes à gestão da Clínica. Visual, conta com rankings que mostram o desempenho de cada área e profissionais envolvidos, além de mostrar a performance da <strong>Yasmim</strong> com a conversão de leads em clientes e a taxa de agendamentos realizados dentro e fora do horário comercial. Tudo com filtros dinâmicos de períodos para uma melhor leitura do processo, permitindo que as estratégias sejam implementadas com precisão cirúrgica.
                </p>
              }
              images={['/imgs/dashboard.png', '/imgs/dashboard2.png', '/imgs/dashboard3.png']}
              imageSide="right"
              onImageClick={handleImageClick}
            />

            <Chapter
              number="02"
              title="Agenda: O coração pulsante da sua operação"
              text={
                <p>
                  No Cromia Health a agenda não é apenas um registro de horários, é uma ferramenta de otimização de todo o fluxo da Clínica. Os horários são os ativos mais importantes e merecem ser tratados como tal. Totalmente integrada à inteligência da <strong>Yasmim</strong>, ela se ajusta em tempo real aos agendamentos, cancelamentos e reagendamentos. Visual e intuitiva, a agenda usa um sistema dinâmico e é integrada inteligentemente com os dados de expediente dos Médicos (facilmente imputados no Painel), datas especiais e feriados, tudo integrado para facilitar a vida da Clínica e otimizar o tempo dos profissionais e uma organização sem igual.
                </p>
              }
              images={['/imgs/agenda1.png', '/imgs/agenda2.png', '/imgs/agenda3.png']}
              imageSide="left"
              onImageClick={handleImageClick}
            />
            <Chapter
              number="03"
              title="Relatórios: De dados soltos a decisões lucrativas"
              text={
                <p>
                  Provavelmente o segundo maior ativo da Clínica: Dados de Clientes e dos movimentos da Clínica. Nossa área de relatórios consolida faturamento, produtividade, taxas de no-show, e muito mais, em documentos prontos para análise e estratégias. Logs dos atendimentos, filtros por período, por médico, por especialidade, por plano de saúde, etiqueta "Crônicos" pra mapear os pacientes que necessitam de acompanhamento contínuo, logo listado em automações inteligentes de follow-up e oferta de agendamentos mais frequentes, tudo muito intuitivo, permitindo uma gestão baseada em fatos, não em suposições.
                </p>
              }
              images={['/imgs/relatorio1.png', '/imgs/relatorio2.png', '/imgs/relatorio3.png']}
              imageSide="right"
              onImageClick={handleImageClick}
            />
            <Chapter
              number="04"
              title="Feriados & Datas Especiais: Controle Total sobre o Tempo"
              text={
                <p>
                  Gerencie as datas especiais, recessos e feriados com um clique. Ao inserir uma data especial no Painel Administrativo ou algum recesso específico da Clínica ou mesmo em algum expediente atípico como uma quarta-feira de cinzas com o meio expediente à partir de 12h ou como um feriadão prolongado e recessos, a <strong>Yasmim</strong>, automaticamente, para de oferecer horários e começa a gerenciar as expectativas dos pacientes para os dias úteis seguintes. Você tem o controle absoluto de quando a Clínica opera, sem precisar lutar contra a agenda e os Sistemas engessados do Mercado.
                </p>
              }
              images={['/imgs/feriados1.png', '/imgs/feriados2.png', '/imgs/feriados3.png']}
              imageSide="left"
              onImageClick={handleImageClick}
            />
            <Chapter
              number="05"
              title="Médicos & Especialidades: Gestão de Profissionais"
              text={
                <p>
                  Cadastre os profissionais e as especialidades da sua clínica com flexibilidade total. Configure escalas, especialidades e regras de atendimentos individuais. O sistema entende as particularidades de cada profissional, garantindo que a nossa Agenda Inteligente direcione cada paciente para o médico certo, no horário correto, sem erros de conflito. Ao inserir um médico, automaticamente são gerados os horários livres na Agenda e pra Yasmim. Você consegue administrar detalhes importantes como Férias, aviso prévio, tudo sincronizado com o Sistema. Os médicos também desfrutam de um Painel Administrativo próprio, onde podem visualizar suas agendas, seus atendimentos, seus pacientes e seus relatórios, tudo de forma intuitiva e organizada. Uma automação específica ao Corpo Clínico é o envio de lembretes de consultas via WhatsApp, trazendo o médico pro fluxo inteligente da plataforma.
                </p>
              }
              images={['/imgs/medicos1.png', '/imgs/medicos2.png', '/imgs/medicos3.png', '/imgs/medicos4.png']}
              imageSide="right"
              onImageClick={handleImageClick}
            />
            <Chapter
              number="06"
              title="Planos & Convênios: Inteligência Financeira"
              text={
                <p>
                  Configure quais planos são aceitos na Clínica e seus respectivos repasses para cada especialidade. Uma matriz de valores com o intuito de facilitar a gestão de faturamento bruto direcionada à uma analise financeira simplificada para os Gestores da Clínica. Ao adicionar o novo plano de saúde no Painel todo o Sistema, incluindo a Yasmim, sincroniza com as novas informações. O intuito dessa área no Cromia Health não é substituir o Sistema Financeiro da Clínica, mas sim trazer uma visão geral e sintetizada para facilitar a gestão na analise diária enviada via automação pelo Whatsapp.
                </p>
              }
              images={['/imgs/planos1.png', '/imgs/planos2.png', '/imgs/planos3.png']}
              imageSide="left"
              onImageClick={handleImageClick}
            />

            <Chapter
              number="07"
              title="Membros & Hierarquia: Segurança e Delegação"
              text={
                <p>
                  Defina quem vê o quê. Com o sistema de membros, você cria níveis de acesso granulares (Administrador, Recepção, Médico). Uma hierarquia funcional e flexível, onde o Gestor foca em relatórios e ROI, a equipe operacional foca na agenda e no chat, tudo sob protocolos rigorosos de segurança e log de acessos pra que os movimentos sejam rastreáveis e as informações financeiras não fiquem expostas a todos os usuários, somente aos Gestores. São 4 níveis de acesso: Admin, que tem acesso a tudo e a todos os dados. Nível Ouro que tem acesso à todas as áreas, exceto às informações financeiras do relatório. Nível Prata, que tem acesso somente à agenda, ao log e ao Chat do Whatsapp, sem qualquer informação financeira. Médicos tem um acesso específico, onde podem visualizar somente seus atendimentos, seus pacientes e seus relatórios.
                </p>
              }
              images={['/imgs/membros1.png', '/imgs/membros2.png', '/imgs/membros3.png', '/imgs/membros4.png']}
              imageSide="right"
              onImageClick={handleImageClick}
            />

            <Chapter
              number="08"
              title="FAQ Operacional: Treine sua IA em segundos"
              text={
                <p>
                  Sua clínica mudou de endereço ou trocou o laboratório de exames? Basta atualizar o FAQ no portal. A <strong>Yasmim</strong> consome essa nova informação imediatamente e passa a responder aos pacientes com o dado atualizado. É o fim dos manuais de recepção desatualizados: a inteligência da sua clínica agora é centralizada e viva. É uma área especial, onde essas informações se incorporam ao Prompt Master da Yasmim, fazendo com que ela responda de forma autônoma e inteligente sobre questões operacionais da clínica, dúvidas Institucionais, dúvidas sobre exames e jejuns.
                </p>
              }
              images={['/imgs/faq1.png', '/imgs/faq2.png', '/imgs/faq3.png']}
              imageSide="left"
              onImageClick={handleImageClick}
            />

            <Chapter
              number="09"
              title="Auditoria de Tokens & Custos: Transparência Absoluta"
              text={
                <p>
                  Acreditamos em parcerias transparentes. Nossa área de auditoria de tokens permite que você rastreie o consumo desses recursos tecnológicos em cada atendimento realizado pela sua Clínica. Saiba o custo de cada interação e acompanhe o uso da IA com total clareza financeira, garantindo que o investimento esteja sempre alinhado ao retorno gerado. São informações que ficam disponíveis em tempo real, permitindo que você acompanhe de perto o funcionamento da Yasmim e seu custo operacional. Essa auditoria é feita de forma automática e segura, sem qualquer interferência humana. Cotação do dólar atualizada dinamicamente e períodos de análise convenientes para o Gestor.
                </p>
              }
              images={['/imgs/tokens1.png', '/imgs/tokens2.png', '/imgs/tokens3.png']}
              imageSide="right"
              onImageClick={handleImageClick}
            />
            <div className="bg-cromia-ink text-white rounded-2xl p-15 -mt-10 mb-10 relative overflow-hidden w-[860px] !shadow-xl mx-auto">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_50%,#30df4de3_10%,transparent_120%)] pointer-events-none z-0" />
              <svg className="absolute top-1/2 left-10/12 -translate-y-1/2 -translate-x-1/2 w-[850px] h-[850px] text-white opacity-5 pointer-events-none z-0 -rotate-12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1">
                  <div className="text-[24px] font-bold tracking-[0.3em] uppercase text-white mb-4">ITEM 10</div>
                  <h2 className="font-fraunces text-4xl font-black mb-6">Whatsapp API Oficial & Chat/CRM: Comunicação Segura</h2>
                  <p className="text-lg text-white/100 leading-[1.8] font-light italic">
                    Ao utilizar o Whatsapp API Oficial, o monitoramento das conversas não se aplica à um celular ou algum outro simples dispositivo e a única maneira de se visualizar e atribuir as conversas é através do Chat incorporado no Painel Administrativo, onde a recepcionista consegue ter acesso a todas as conversas entre a Yasmim e os pacientes, podendo intervir quando necessário, garantindo que todas as conversas sejam auditáveis e seguras. Assuma o chat quando a complexidade exigir um toque humano ou quando for solicitado pela Yasmim, sem nunca perder o histórico ou a privacidade dos dados. Os pacientes ficam cadastrados como em um CRM, com o histórico de todas as conversas, permitindo um atendimento personalizado e eficiente.
                  </p>
                </div>
                <div className="flex-1 w-full flex flex-col gap-10">
                  {['/imgs/chat1.png', '/imgs/chat2.png'].map((img, idx) => (
                    <div
                      key={idx}
                      className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 shadow-2xl relative overflow-hidden group transition-all duration-500 hover:shadow-[0_0_40px_rgba(48,223,77,0.15)] cursor-zoom-in"
                      onClick={() => handleImageClick(['/imgs/chat1.png', '/imgs/chat2.png'], idx)}
                    >
                      <div className="p-3 md:p-3 bg-black/20">
                        <div className="relative rounded-lg overflow-hidden shadow-sm border border-white/10 bg-cromia-bg/5">
                          <img src={img} alt={`WhatsApp CRM - ${idx + 1}`} className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.05]" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Nova Seção: Automações do WhatsApp */}
            <div className="mt-10 mb-20 border-t border-cromia-border/50 pt-20">
              <div className="text-center mb-16">
                <div className="text-[12px] font-bold tracking-[0.3em] uppercase text-cromia-gold mb-4">Em Ação</div>
                <h3 className="font-fraunces text-4xl font-black text-[#3a3a3a] mb-4">Automações Ativas no WhatsApp</h3>
                <p className="text-lg text-cromia-ink2 font-light max-w-[600px] mx-auto">
                  Alguns exemplos de como a Yasmim interage ativamente com os pacientes para organizar o fluxo e proteger a receita da Clínica, trabalhando 24h por dia.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-[860px] mx-auto">
                {/* Automação 1 */}
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-cromia-border shadow-lg hover:shadow-xl transition-shadow">
                  <div className="bg-cromia-bg/50 rounded-lg h-[280px] mb-6 flex items-center justify-center border border-cromia-border/30 text-cromia-muted italic text-sm cursor-zoom-in hover:bg-cromia-bg/80 transition-colors">
                    [ Print: Relatório Gerencial ]
                  </div>
                  <h4 className="font-fraunces font-bold text-2xl text-cromia-ink mb-3">Relatório Executivo para Gestores</h4>
                  <p className="text-cromia-ink2 leading-relaxed font-light">
                    O pulso da clínica, todo fim de dia no WhatsApp do Gestor. Receba instantaneamente o faturamento bruto, número de pacientes atendidos, faltas, especialistas e planos mais recorrentes sem abrir o Painel. A bússola perfeita para fechar a noite.
                  </p>
                </div>
                {/* Automação 2 */}
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-cromia-border shadow-lg hover:shadow-xl transition-shadow">
                  <div className="bg-cromia-bg/50 rounded-lg h-[280px] mb-6 flex items-center justify-center border border-cromia-border/30 text-cromia-muted italic text-sm cursor-zoom-in hover:bg-cromia-bg/80 transition-colors">
                    [ Print: Agenda Diária do Médico ]
                  </div>
                  <h4 className="font-fraunces font-bold text-2xl text-cromia-ink mb-3">Agenda Automática Direto ao Médico</h4>
                  <p className="text-cromia-ink2 leading-relaxed font-light">
                    Todos os dias, a Yasmim envia um resumo completo com a agenda de atendimentos para o WhatsApp pessoal de cada médico. Chega de papéis impressos confusos ou desinformação — tudo atualizado de forma dinâmica e objetiva, centralizando a operação.
                  </p>
                </div>
                {/* Automação 3 */}
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-cromia-border shadow-lg hover:shadow-xl transition-shadow">
                  <div className="bg-cromia-bg/50 rounded-lg h-[280px] mb-6 flex items-center justify-center border border-cromia-border/30 text-cromia-muted italic text-sm cursor-zoom-in hover:bg-cromia-bg/80 transition-colors">
                    [ Print: Lembrete de Consulta ]
                  </div>
                  <h4 className="font-fraunces font-bold text-2xl text-cromia-ink mb-3">Lembrete & Confirmação</h4>
                  <p className="text-cromia-ink2 leading-relaxed font-light">
                    Disparo inteligente 24h e 2h antes da consulta. Se o paciente cancelar, a Yasmim já avisa a recepção e pode engatilhar uma mensagem oferecendo o horário para pacientes na lista de espera ou crônicos. O antídoto definitivo contra o No-Show.
                  </p>
                </div>

                {/* Automação 4 */}
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl border border-cromia-border shadow-lg hover:shadow-xl transition-shadow">
                  <div className="bg-cromia-bg/50 rounded-lg h-[280px] mb-6 flex items-center justify-center border border-cromia-border/30 text-cromia-muted italic text-sm cursor-zoom-in hover:bg-cromia-bg/80 transition-colors">
                    [ Print: Pesquisa de Qualidade / NPS ]
                  </div>
                  <h4 className="font-fraunces font-bold text-2xl text-cromia-ink mb-3">Pesquisa de Satisfação</h4>
                  <p className="text-cromia-ink2 leading-relaxed font-light">
                    Terminou a consulta? O sistema envia automaticamente uma mensagem colhendo o feedback do paciente. Excelente para auditar o atendimento dos profissionais e elevar a nota da clínica no Google.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Call to Action Final */}
          <div className="text-center py-20 border-t border-cromia-border">
            <h3 className="font-fraunces text-4xl font-black text-cromia-grey mb-10">Leve a inteligência da Cromia para sua clínica</h3>
            <a
              href="https://wa.me/5521991550328"
              className="inline-block bg-cromia-gold-light !text-cromia-ink2 px-10 py-5 mt-10 rounded-lg font-bold tracking-widest uppercase hover:bg-cromia-gold-dim/20 transition-all duration-300 hover:scale-110 shadow-xl"
            >
              Agendar Demonstração
            </a>
          </div>

          {/* Footer */}
          <div className="text-center py-12 text-cromia-muted text-sm tracking-widest border-t border-cromia-border">
            DESENVOLVIDO PELA <a href="https://cromia.app" className="font-semibold hover:text-cromia-gold transition-colors underline decoration-cromia-border underline-offset-4">CROMIA</a> - {new Date().getFullYear()}
          </div>
        </div >
      </div >

      {lightboxData && (
        <ImageLightbox images={lightboxData.images} initialIndex={lightboxData.index} onClose={() => setLightboxData(null)} />
      )}
    </>
  );
};

export default CromiaHealth;
