import React from 'react';
import MeshBackground from '../components/MeshBackground';

const Chapter = ({ 
  number, 
  title, 
  text, 
  image, 
  mockup, 
  imageSide = 'right' 
}: { 
  number: string, 
  title: string, 
  text: string | React.ReactNode, 
  image?: string, 
  mockup?: React.ReactNode, 
  imageSide?: 'left' | 'right' 
}) => (
  <div className={`flex flex-col ${imageSide === 'left' ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-16 mb-24 md:mb-32`}>
    <div className="w-full md:w-[45%]">
      <div className="text-[12px] font-bold tracking-[0.3em] uppercase text-cromia-gold mb-4">Capítulo {number}</div>
      <h2 className="font-fraunces text-3xl md:text-4xl font-black text-cromia-ink mb-6 leading-tight">
        {title}
      </h2>
      <div className="text-[17px] text-cromia-ink2 leading-[1.8] font-light">
        {text}
      </div>
    </div>
    <div className="w-full md:w-[55%]">
      <div className="bg-white/40 border border-cromia-border rounded-sm shadow-2xl relative overflow-hidden group transition-transform duration-500 hover:scale-[1.02]">
        {image ? (
          <img src={image} alt={title} className="w-full h-auto block" />
        ) : mockup ? (
          <div className="bg-cromia-bg/30 p-8 min-h-[300px] flex flex-col justify-center">
            {mockup}
          </div>
        ) : (
          <div className="aspect-[16/10] flex items-center justify-center text-cromia-muted/30 italic text-sm font-space-grotesk tracking-widest">
            [ Espaço para Print da Área: {title} ]
          </div>
        )}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(180,95,59,0.05),transparent)] pointer-events-none" />
        <div className="absolute inset-0 border-[1px] border-white/20 pointer-events-none" />
      </div>
    </div>
  </div>
);

const CromiaHealth = () => {
  return (
    <>
      <MeshBackground />
      <div className="bg-transparent text-[#b45f3b] font-space-grotesk min-h-screen m-0 p-0 overflow-x-hidden pt-4">
        <div className="max-w-[1100px] mx-auto px-6 py-[30px] relative">
          
          {/* Logo */}
          <a href="https://cromia.app" className="absolute top-4 right-6 transition-transform hover:scale-105 active:scale-95">
            <img src="/imgs/logo.svg" alt="Cromia Logo" className="w-40 md:w-40" />
          </a>

          {/* Hero Section */}
          <div className="mb-32 pt-28 text-center max-w-[800px] mx-auto">
            <h1 className="font-fraunces text-4xl md:text-5xl lg:text-7xl font-black text-cromia-ink leading-[1] m-0 mb-8">
              O Portal que<br />
              <em className="italic font-light text-[#b45f3b]">muda o jogo</em>
            </h1>
            <p className="text-[19px] text-cromia-ink2 leading-[1.7] font-light">
              Explore o ecossistema Cromia Health. Muito mais que uma agenda, um centro de comando inteligente projetado para clínicas que buscam eficiência absoluta e crescimento escala.
            </p>
            <div className="mt-10 h-px w-24 bg-cromia-gold/30 mx-auto" />
          </div>

          {/* Jornada por Capítulos */}
          <div className="space-y-12">
            
            <Chapter 
              number="01"
              title="Dashboard: O pulso da sua clínica em tempo real"
              text={
                <p>
                  O Sistema Cromia Health possui um Dashboard gráfico de acompanhamento de dados relevantes à gestão da Clínica. Visual, conta com rankings que mostram o desempenho de cada área e profissional envolvido, além de mostrar a performance da <strong>Yasmim</strong> com a conversão de leads e agendamentos realizados dentro e fora do horário comercial. Tudo com filtros dinâmicos de período, para que as estratégias sejam implementadas com precisão cirúrgica.
                </p>
              }
              image="/imgs/dashboard_print.png"
              imageSide="right"
            />

            <Chapter 
              number="02"
              title="Relatórios: De dados soltos a decisões lucrativas"
              text={
                <p>
                  Esqueça planilhas confusas. Nossa área de relatórios consolida faturamento, produtividade e taxas de no-show em documentos prontos para análise. Entenda onde a clínica está ganhando dinheiro e onde estão os gargalos operacionais, tudo exportável e intuitivo, permitindo uma gestão baseada em fatos, não em suposições.
                </p>
              }
              mockup={
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="h-20 flex-1 bg-white border border-cromia-border rounded-sm p-3 shadow-sm">
                      <div className="text-[9px] uppercase text-cromia-muted font-bold">Faturamento</div>
                      <div className="text-lg font-bold text-cromia-ink">R$ 142.500</div>
                    </div>
                    <div className="h-20 flex-1 bg-white border border-cromia-border rounded-sm p-3 shadow-sm">
                      <div className="text-[9px] uppercase text-cromia-muted font-bold">No-Show</div>
                      <div className="text-lg font-bold text-[#e53e3e]">↓ 12.4%</div>
                    </div>
                  </div>
                  <div className="h-3 w-full bg-white/50 rounded-full overflow-hidden">
                    <div className="h-full bg-cromia-gold w-3/4" />
                  </div>
                </div>
              }
              imageSide="left"
            />

            <Chapter 
              number="03"
              title="Agenda: O coração pulsante da sua operação"
              text={
                <p>
                  A agenda não é apenas um registro de horários, é uma ferramenta de otimização de fluxo. Totalmente integrada à inteligência da <strong>Yasmim</strong>, ela se ajusta em tempo real a cancelamentos e reagendamentos. O sistema identifica "buracos" e sugere reencaixes automáticos, garantindo que o tempo dos seus médicos seja aproveitado ao máximo.
                </p>
              }
              mockup={
                <div className="space-y-2">
                  {[
                    { doc: "Dra. Helena Souza", time: "10:30", status: "Confirmado", color: "bg-cromia-teal" },
                    { doc: "Dr. Ricardo Neves", time: "11:15", status: "Yasmim reagendando...", color: "bg-cromia-gold" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white p-3 border border-cromia-border rounded-sm shadow-sm">
                      <div className={`w-1 h-8 ${item.color} rounded-full`} />
                      <div className="flex-1">
                        <div className="text-[11px] font-bold text-cromia-ink">{item.doc}</div>
                        <div className="text-[9px] text-cromia-muted">{item.time}</div>
                      </div>
                      <div className="text-[9px] px-2 py-0.5 bg-cromia-bg text-cromia-ink rounded-full font-bold uppercase">{item.status}</div>
                    </div>
                  ))}
                </div>
              }
              imageSide="right"
            />

            <Chapter 
              number="04"
              title="Médicos & Especialidades: Gestão de Ativos"
              text={
                <p>
                  Cadastre seu corpo clínico com flexibilidade total. Configure escalas, especialidades e regras de atendimento individuais. O sistema entende as particularidades de cada profissional, garantindo que o agendador inteligente direcione cada paciente para o médico certo, no horário correto, sem erros de conflito.
                </p>
              }
              mockup={
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-white border border-cromia-border rounded-sm text-center shadow-sm">
                    <div className="text-[9px] text-cromia-muted font-bold mb-1 uppercase tracking-tight">Especialidades</div>
                    <div className="text-lg font-bold text-cromia-ink">12</div>
                  </div>
                  <div className="p-4 bg-white border border-cromia-border rounded-sm text-center shadow-sm">
                    <div className="text-[9px] text-cromia-muted font-bold mb-1 uppercase tracking-tight">Ativos</div>
                    <div className="text-lg font-bold text-cromia-ink">24 Profissionais</div>
                  </div>
                </div>
              }
              imageSide="left"
            />

            <Chapter 
              number="05"
              title="Cenários & Feriados: Controle Total sobre o Tempo"
              text={
                <p>
                  Gerencie datas especiais, recessos e feriados com um clique. Ao configurar uma data de folga no portal, a <strong>Yasmim</strong> para de oferecer horários instantaneamente e começa a gerenciar as expectativas dos pacientes para os dias úteis seguintes. Você tem o controle absoluto de quando a clínica opera, sem precisar avisar a ninguém.
                </p>
              }
              mockup={
                <div className="bg-white p-4 border border-cromia-border rounded-sm shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-xs font-bold text-cromia-ink">Abril 2026</div>
                    <div className="flex gap-1">
                      <div className="w-4 h-4 rounded-full bg-cromia-bg" />
                      <div className="w-4 h-4 rounded-full bg-cromia-gold/20" />
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {[...Array(21)].map((_, i) => (
                      <div key={i} className={`h-6 rounded-sm flex items-center justify-center text-[10px] ${i === 20 ? 'bg-cromia-gold text-white font-bold' : 'bg-cromia-bg/50'}`}>{i + 1}</div>
                    ))}
                  </div>
                </div>
              }
              imageSide="right"
            />

            <Chapter 
              number="06"
              title="Planos & Convênios: Inteligência Financeira"
              text={
                <p>
                  Uma central de convênios completa. Configure quais planos cada médico aceita e associe tabelas de preços específicas para cada procedimento. A Yasmim utiliza essas informações para filtrar o atendimento, agendando apenas o que sua clínica realmente atende e informando valores de forma automatizada e precisa.
                </p>
              }
              mockup={
                <div className="space-y-2">
                  <div className="bg-white p-3 border border-cromia-border rounded-sm flex justify-between items-center">
                    <div className="text-[11px] font-bold text-cromia-ink">Particular</div>
                    <div className="text-[11px] text-cromia-teal font-bold">R$ 350,00</div>
                  </div>
                  <div className="bg-white p-3 border border-cromia-border rounded-sm flex justify-between items-center">
                    <div className="text-[11px] font-bold text-cromia-ink">Bradesco Saúde</div>
                    <div className="text-[11px] text-cromia-gold font-bold">Tabela 2A</div>
                  </div>
                </div>
              }
              imageSide="left"
            />

            <Chapter 
              number="07"
              title="Membros & Hierarquia: Segurança e Delegação"
              text={
                <p>
                  Defina quem vê o quê. Com o sistema de membros, você cria níveis de acesso granulares (Administrador, Recepção, Médico). Enquanto o gestor foca em relatórios e ROI, a equipe operacional foca na agenda e no chat, tudo sob protocolos rigorosos de segurança e log de acessos.
                </p>
              }
              mockup={
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cromia-ink text-white flex items-center justify-center font-fraunces">G</div>
                    <div>
                      <div className="text-[11px] font-bold text-cromia-ink">Gerência Geral</div>
                      <div className="text-[9px] text-cromia-teal uppercase tracking-widest font-bold">Acesso Total</div>
                    </div>
                  </div>
                  <div className="h-px w-full bg-cromia-border/50" />
                  <div className="flex items-center gap-3 opacity-60">
                    <div className="w-10 h-10 rounded-full bg-white border border-cromia-border flex items-center justify-center font-fraunces">R</div>
                    <div>
                      <div className="text-[11px] font-bold text-cromia-ink">Recepção</div>
                      <div className="text-[9px] text-cromia-muted uppercase tracking-widest">Acesso Limitado</div>
                    </div>
                  </div>
                </div>
              }
              imageSide="right"
            />

            <Chapter 
              number="08"
              title="FAQ Operacional: Treine sua IA em segundos"
              text={
                <p>
                  Sua clínica mudou de endereço ou trocou o laboratório de exames? Basta atualizar o FAQ no portal. A <strong>Yasmim</strong> consome essa nova informação imediatamente e passa a responder aos pacientes com o dado atualizado. É o fim dos manuais de recepção desatualizados: a inteligência da sua clínica agora é centralizada e viva.
                </p>
              }
              mockup={
                <div className="bg-white p-5 border border-cromia-border rounded-sm shadow-sm relative italic text-cromia-ink text-xs">
                  "Informar que aceitamos Bradesco Saúde apenas para consultas, não exames."
                  <div className="absolute bottom-2 right-2 flex items-center gap-2">
                    <div className="w-2 h-2 bg-cromia-teal rounded-full animate-pulse" />
                    <span className="text-[8px] font-bold uppercase tracking-widest text-cromia-muted">Ativo na Yasmim</span>
                  </div>
                </div>
              }
              imageSide="left"
            />

            <Chapter 
              number="09"
              title="Auditoria de Tokens & Custos: Transparência Absoluta"
              text={
                <p>
                  Acreditamos em parcerias transparentes. Nossa área de auditoria permite que você veja exatamente o consumo de recursos tecnológicos (tokens) da sua conta. Saiba o custo exato de cada interação e acompanhe o uso da IA com total clareza financeira, garantindo que o investimento esteja sempre alinhado ao retorno gerado.
                </p>
              }
              mockup={
                <div className="relative h-24 flex items-end gap-1 px-2">
                  {[40, 70, 45, 90, 65, 80, 50, 75, 60, 85].map((h, i) => (
                    <div key={i} className="flex-1 bg-cromia-ink/10 hover:bg-cromia-teal transition-all rounded-t-sm" style={{ height: `${h}%` }} />
                  ))}
                </div>
              }
              imageSide="right"
            />

            <Chapter 
              number="02"
              title="Relatórios: De dados soltos a decisões lucrativas"
              text={
                <p>
                  Esqueça planilhas confusas. Nossa área de relatórios consolida faturamento, produtividade e taxas de no-show em documentos prontos para análise. Entenda onde a clínica está ganhando dinheiro e onde estão os gargalos operacionais, tudo exportável e intuitivo, permitindo uma gestão baseada em fatos, não em suposições.
                </p>
              }
              imageSide="left"
            />

            <Chapter 
              number="03"
              title="Agenda: O coração pulsante da sua operação"
              text={
                <p>
                  A agenda não é apenas um registro de horários, é uma ferramenta de otimização de fluxo. Totalmente integrada à inteligência da <strong>Yasmim</strong>, ela se ajusta em tempo real a cancelamentos e reagendamentos. O sistema identifica "buracos" e sugere reencaixes automáticos, garantindo que o tempo dos seus médicos seja aproveitado ao máximo.
                </p>
              }
              imageSide="right"
            />

            <Chapter 
              number="04"
              title="Médicos & Especialidades: Gestão de Ativos"
              text={
                <p>
                  Cadastre seu corpo clínico com flexibilidade total. Configure escalas, especialidades e regras de atendimento individuais. O sistema entende as particularidades de cada profissional, garantindo que o agendador inteligente direcione cada paciente para o médico certo, no horário correto, sem erros de conflito.
                </p>
              }
              imageSide="left"
            />

            <Chapter 
              number="05"
              title="Cenários & Feriados: Controle Total sobre o Tempo"
              text={
                <p>
                  Gerencie datas especiais, recessos e feriados com um clique. Ao configurar uma data de folga no portal, a <strong>Yasmim</strong> para de oferecer horários instantaneamente e começa a gerenciar as expectativas dos pacientes para os dias úteis seguintes. Você tem o controle absoluto de quando a clínica opera, sem precisar avisar a ninguém.
                </p>
              }
              imageSide="right"
            />

            <Chapter 
              number="06"
              title="Planos & Convênios: Inteligência Financeira"
              text={
                <p>
                  Uma central de convênios completa. Configure quais planos cada médico aceita e associe tabelas de preços específicas para cada procedimento. A Yasmim utiliza essas informações para filtrar o atendimento, agendando apenas o que sua clínica realmente atende e informando valores de forma automatizada e precisa.
                </p>
              }
              imageSide="left"
            />

            <Chapter 
              number="07"
              title="Membros & Hierarquia: Segurança e Delegação"
              text={
                <p>
                  Defina quem vê o quê. Com o sistema de membros, você cria níveis de acesso granulares (Administrador, Recepção, Médico). Enquanto o gestor foca em relatórios e ROI, a equipe operacional foca na agenda e no chat, tudo sob protocolos rigorosos de segurança e log de acessos.
                </p>
              }
              imageSide="right"
            />

            <Chapter 
              number="08"
              title="FAQ Operacional: Treine sua IA em segundos"
              text={
                <p>
                  Sua clínica mudou de endereço ou trocou o laboratório de exames? Basta atualizar o FAQ no portal. A <strong>Yasmim</strong> consome essa nova informação imediatamente e passa a responder aos pacientes com o dado atualizado. É o fim dos manuais de recepção desatualizados: a inteligência da sua clínica agora é centralizada e viva.
                </p>
              }
              imageSide="left"
            />

            <Chapter 
              number="09"
              title="Auditoria de Tokens & Custos: Transparência Absoluta"
              text={
                <p>
                  Acreditamos em parcerias transparentes. Nossa área de auditoria permite que você veja exatamente o consumo de recursos tecnológicos (tokens) da sua conta. Saiba o custo exato de cada interação e acompanhe o uso da IA com total clareza financeira, garantindo que o investimento esteja sempre alinhado ao retorno gerado.
                </p>
              }
              imageSide="right"
            />

            <div className="bg-cromia-ink text-white rounded-sm p-12 mt-20 mb-32 relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(180,95,59,0.15)_0%,transparent_100%)] pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1">
                  <div className="text-[12px] font-bold tracking-[0.3em] uppercase text-cromia-gold mb-4">Capítulo 10</div>
                  <h2 className="font-fraunces text-4xl font-black mb-6">CRM & Chatwoot: Comunicação Segura</h2>
                  <p className="text-lg text-white/80 leading-[1.8] font-light italic">
                    Centralize todos os seus canais em um único lugar. O nosso CRM integrado via **Chatwoot** oferece uma interface exclusiva com login e senha próprios, garantindo que todas as conversas entre a Yasmim e seus pacientes sejam auditáveis e seguras. Assuma o chat quando a complexidade exigir um toque humano, sem nunca perder o histórico ou a privacidade dos dados.
                  </p>
                </div>
                <div className="flex-1 w-full">
                  <div className="aspect-video bg-white/5 border border-white/10 rounded-sm backdrop-blur-sm flex items-center justify-center text-white/20 italic text-sm">
                    [ Print do Chatwoot Customizado ]
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Call to Action Final */}
          <div className="text-center py-20 border-t border-cromia-border">
            <h3 className="font-fraunces text-3xl font-black text-cromia-ink mb-6">Leve a inteligência da Cromia para sua clínica</h3>
            <a 
              href="https://wa.me/5511999999999" 
              className="inline-block bg-cromia-ink text-white px-10 py-5 rounded-sm font-bold tracking-widest uppercase hover:bg-cromia-gold transition-all duration-300 shadow-xl"
            >
              Agendar Demonstração
            </a>
          </div>

          {/* Footer */}
          <div className="text-center py-12 text-cromia-muted text-sm tracking-widest border-t border-cromia-border">
            DESENVOLVIDO PELA <a href="https://cromia.app" className="font-semibold hover:text-cromia-gold transition-colors underline decoration-cromia-border underline-offset-4">CROMIA</a> - {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </>
  );
};

export default CromiaHealth;
