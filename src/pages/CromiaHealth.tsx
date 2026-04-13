import React from 'react';
import MeshBackground from '../components/MeshBackground';

const CromiaHealth = () => {
  return (
    <>
      <MeshBackground />
      <div className="bg-transparent text-[#b45f3b] font-space-grotesk min-h-screen m-0 p-0 overflow-x-hidden pt-4">
        <div className="max-w-[1000px] mx-auto px-6 py-[30px] relative">
          
          {/* Logo */}
          <a href="https://cromia.app" className="absolute top-4 right-6 transition-transform hover:scale-105 active:scale-95">
            <img src="/imgs/logo.svg" alt="Cromia Logo" className="w-40 md:w-40" />
          </a>

          {/* Hero Section */}
          <div className="mb-16 pt-20 text-center">
            <h1 className="font-fraunces text-cromia-ink/80 text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05] m-0 mb-6">
              Ecossistema<br />
              <em className="italic font-light text-[#b45f3b]">Cromia Health</em>
            </h1>
            <p className="text-[18px] text-cromia-ink leading-[1.7] max-w-[700px] mx-auto opacity-90">
              O controle absoluto da sua clínica em um só lugar. Uma interface administrativa projetada para dar inteligência, velocidade e escala à sua operação.
            </p>
          </div>

          {/* Grid de Funcionalidades */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            
            {/* 1. Dashboard de Performance */}
            <div className="bg-white border border-cromia-border rounded-sm p-8 shadow-lg">
              <div className="text-sm font-bold tracking-widest uppercase text-cromia-gold mb-4 text-center md:text-left">Inteligência Estratégica</div>
              <h2 className="font-fraunces text-2xl font-black text-cromia-ink mb-4">Dashboard & Relatórios</h2>
              <div className="bg-cromia-bg/30 border border-cromia-border/50 rounded-sm p-6 mb-6">
                {/* Mockup do Dashboard */}
                <div className="flex gap-4 mb-4">
                  <div className="h-24 flex-1 bg-white border border-cromia-border rounded-sm p-3 shadow-sm">
                    <div className="text-[10px] uppercase text-cromia-muted font-bold">Conversão</div>
                    <div className="text-xl font-bold text-cromia-teal">84%</div>
                    <div className="h-1 w-full bg-cromia-teal/20 mt-2 rounded-full overflow-hidden">
                      <div className="h-full bg-cromia-teal w-[84%]" />
                    </div>
                  </div>
                  <div className="h-24 flex-1 bg-white border border-cromia-border rounded-sm p-3 shadow-sm">
                    <div className="text-[10px] uppercase text-cromia-muted font-bold">ROI Estimado</div>
                    <div className="text-xl font-bold text-cromia-gold">14.2x</div>
                    <div className="text-[9px] text-cromia-teal font-medium mt-1">↑ 12% vs mês anterior</div>
                  </div>
                </div>
                <div className="h-4 w-1/2 bg-cromia-muted/20 rounded-full" />
              </div>
              <p className="text-base text-cromia-ink2 leading-relaxed">
                Visualize taxas de conversão, ROI real em tempo real e relatórios detalhados de faturamento e produtividade por médico.
              </p>
            </div>

            {/* 2. Agenda Integrada */}
            <div className="bg-white border border-cromia-border rounded-sm p-8 shadow-lg">
              <div className="text-sm font-bold tracking-widest uppercase text-cromia-gold mb-4 text-center md:text-left">Operação 24/7</div>
              <h2 className="font-fraunces text-2xl font-black text-cromia-ink mb-4">Agenda Inteligente</h2>
              <div className="bg-cromia-bg/30 border border-cromia-border/50 rounded-sm p-6 mb-6">
                {/* Mockup da Agenda */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3 bg-white p-2 border border-cromia-border rounded-sm shadow-sm">
                    <div className="w-1.5 h-6 bg-cromia-gold rounded-full" />
                    <div className="flex-1">
                      <div className="text-[11px] font-bold text-cromia-ink">Dra. Helena Souza</div>
                      <div className="text-[9px] text-cromia-muted">Pediatria • 10:30</div>
                    </div>
                    <div className="text-[9px] px-2 py-0.5 bg-cromia-teal-light text-cromia-teal rounded-full font-bold uppercase">Confirmado</div>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-2 border border-cromia-border rounded-sm shadow-sm">
                    <div className="w-1.5 h-6 bg-cromia-muted rounded-full" />
                    <div className="flex-1">
                      <div className="text-[11px] font-bold text-cromia-ink">Dr. Ricardo Neves</div>
                      <div className="text-[9px] text-cromia-muted">Dermatologia • 11:15</div>
                    </div>
                    <div className="text-[9px] px-2 py-0.5 bg-cromia-gold/10 text-cromia-gold rounded-full font-bold uppercase italic">Yasmim reagendando...</div>
                  </div>
                </div>
              </div>
              <p className="text-base text-cromia-ink2 leading-relaxed">
                Gestão de horários dinâmica. A Yasmim sincroniza automaticamente com a agenda física, resolvendo cancelamentos e reencaixes sem intervenção humana.
              </p>
            </div>

            {/* 3. Administração de Ativos */}
            <div className="bg-white border border-cromia-border rounded-sm p-8 shadow-lg">
              <div className="text-sm font-bold tracking-widest uppercase text-cromia-gold mb-4 text-center md:text-left">Infraestrutura</div>
              <h2 className="font-fraunces text-2xl font-black text-cromia-ink mb-4">Médicos & Convênios</h2>
              <div className="bg-cromia-bg/30 border border-cromia-border/50 rounded-sm p-6 mb-6">
                {/* Mockup de Administração */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white border border-cromia-border rounded-sm text-center">
                    <div className="text-[10px] text-cromia-muted font-bold mb-1 uppercase tracking-tight">Especialidades</div>
                    <div className="text-sm font-bold text-cromia-ink">12 Ativas</div>
                  </div>
                  <div className="p-3 bg-white border border-cromia-border rounded-sm text-center">
                    <div className="text-[10px] text-cromia-muted font-bold mb-1 uppercase tracking-tight">Planos</div>
                    <div className="text-sm font-bold text-cromia-ink">8 Aceitos</div>
                  </div>
                </div>
                <div className="mt-3 text-[10px] italic text-cromia-muted text-center border-t border-cromia-border/40 pt-2">
                  Tabela de preços integrada por convênio/procedimento
                </div>
              </div>
              <p className="text-base text-cromia-ink2 leading-relaxed">
                Controle total sobre seu corpo clínico, especialidades atendidas e regras específicas de cada plano de saúde e tabela de preços.
              </p>
            </div>

            {/* 4. Hierarquia e Membros */}
            <div className="bg-white border border-cromia-border rounded-sm p-8 shadow-lg">
              <div className="text-sm font-bold tracking-widest uppercase text-cromia-gold mb-4 text-center md:text-left">Segurança</div>
              <h2 className="font-fraunces text-2xl font-black text-cromia-ink mb-4">Membros & Hierarquia</h2>
              <div className="bg-cromia-bg/30 border border-cromia-border/50 rounded-sm p-6 mb-6">
                {/* Mockup de Hierarquia */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-cromia-ink text-white flex items-center justify-center text-xs font-bold font-fraunces">D</div>
                    <div>
                      <div className="text-[11px] font-bold text-cromia-ink">Dono da Clínica</div>
                      <div className="text-[9px] text-cromia-teal">Acesso Total • Auditoria</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pl-6 border-l-2 border-cromia-border/50">
                    <div className="w-7 h-7 rounded-full bg-cromia-gold text-white flex items-center justify-center text-xs font-bold font-fraunces">R</div>
                    <div>
                      <div className="text-[11px] font-bold text-cromia-ink">Recepção</div>
                      <div className="text-[9px] text-cromia-muted">Gestão de Agenda • FAQ</div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-base text-cromia-ink2 leading-relaxed">
                Níveis granulares de permissão. Defina quem pode alterar preços, ver relatórios ou apenas gerenciar a agenda do dia.
              </p>
            </div>

            {/* 5. Treinamento da IA */}
            <div className="bg-white border border-cromia-border rounded-sm p-8 shadow-lg">
              <div className="text-sm font-bold tracking-widest uppercase text-cromia-gold mb-4 text-center md:text-left">Knowledge Base</div>
              <h2 className="font-fraunces text-2xl font-black text-cromia-ink mb-4">FAQ Operacional</h2>
              <div className="bg-cromia-bg/30 border border-cromia-border/50 rounded-sm p-6 mb-6">
                {/* Mockup do FAQ */}
                <div className="bg-white p-3 border border-cromia-border rounded-sm">
                  <div className="text-[9px] uppercase text-cromia-gold font-bold mb-1">Nova Instrução para Yasmim:</div>
                  <div className="text-[11px] text-cromia-ink italic">"Informar que aceitamos Bradesco Saúde apenas para consultas, não exames."</div>
                  <div className="mt-2 flex justify-end">
                    <div className="text-[9px] px-2 py-1 bg-cromia-ink text-white rounded-sm font-bold">ATUALIZAR IA</div>
                  </div>
                </div>
              </div>
              <p className="text-base text-cromia-ink2 leading-relaxed">
                Possibilite que sua equipe atualize o conhecimento da Yasmim em segundos. Novos horários, regras de feriados ou mudanças de endereço são refletidos instantaneamente.
              </p>
            </div>

            {/* 6. Auditoria de Tokens */}
            <div className="bg-white border border-cromia-border rounded-sm p-8 shadow-lg">
              <div className="text-sm font-bold tracking-widest uppercase text-cromia-gold mb-4 text-center md:text-left">Transparência</div>
              <h2 className="font-fraunces text-2xl font-black text-cromia-ink mb-4">Auditoria de Tokens</h2>
              <div className="bg-cromia-bg/30 border border-cromia-border/50 rounded-sm p-6 mb-6">
                {/* Mockup de Tokens */}
                <div className="relative h-20 flex items-end gap-1">
                  {[40, 60, 45, 90, 65, 80, 50, 70].map((h, i) => (
                    <div key={i} className="flex-1 bg-cromia-ink/20 hover:bg-cromia-ink transition-colors rounded-t-sm" style={{ height: `${h}%` }} />
                  ))}
                  <div className="absolute top-0 right-0 text-[10px] font-bold text-cromia-muted uppercase">Consumo Estimado</div>
                </div>
                <div className="flex justify-between mt-2 text-[10px] font-bold text-cromia-ink">
                  <span>Usage: 142k tokens</span>
                  <span className="text-cromia-teal">R$ 15,20 / dia</span>
                </div>
              </div>
              <p className="text-base text-cromia-ink2 leading-relaxed">
                Controle granular de custos. Acompanhe exatamente quanto cada interação da IA está custando e monitore o uso dos recursos tecnológicos.
              </p>
            </div>
          </div>

          {/* CRM / Chatwoot Section - Full Width */}
          <div className="bg-cromia-ink text-white rounded-sm p-12 mb-20 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(180,95,59,0.15)_0%,transparent_100%)] pointer-events-none" />
            <div className="relative z-10 max-w-[800px] mx-auto text-center">
              <div className="text-sm font-bold tracking-[0.3em] uppercase text-cromia-gold mb-6">Comunicação Unificada</div>
              <h2 className="font-fraunces text-4xl md:text-5xl font-black mb-8">CRM & Chat Multicanal</h2>
              
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-sm p-8 mb-10 text-left">
                {/* Mockup do Chatwoot */}
                <div className="flex gap-4">
                  <div className="w-1/3 hidden md:block border-r border-white/10 pr-4 space-y-3">
                    <div className="h-10 bg-white/10 rounded-sm animate-pulse" />
                    <div className="h-10 bg-white/5 rounded-sm" />
                    <div className="h-10 bg-white/5 rounded-sm" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-cromia-gold rounded-full flex items-center justify-center font-bold">M</div>
                      <div>
                        <div className="text-sm font-bold font-space-grotesk">Maria Clara</div>
                        <div className="text-[10px] text-white/50">via WhatsApp • Aguardando agendador</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-white/10 p-3 rounded-sm rounded-tl-none max-w-[80%] text-xs">
                        Olá! Gostaria de saber se a Dra. Helena atende amanhã?
                      </div>
                      <div className="bg-cromia-gold/20 p-3 rounded-sm rounded-tr-none max-w-[80%] ml-auto text-xs italic border border-cromia-gold/30">
                        A Yasmim está respondendo...
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-lg text-white/80 leading-[1.8] mb-10 font-light italic">
                "Integramos o **Chatwoot de forma exclusiva**, com login e senha protegidos, garantindo segurança total de dados. Acompanhe as conversas da Yasmim em tempo real e assuma o controle quando necessário."
              </p>
              
              <div className="flex flex-wrap justify-center gap-6">
                {[
                  { label: "Login Seguro", desc: "Acesso por níveis" },
                  { label: "Atendimento Híbrido", desc: "Humano + IA" },
                  { label: "Protocolo LGPD", desc: "Dados Criptografados" }
                ].map((item, i) => (
                  <div key={i} className="text-center group">
                    <div className="text-sm font-bold text-cromia-gold group-hover:scale-110 transition-transform">{item.label}</div>
                    <div className="text-[10px] text-white/40 uppercase tracking-widest mt-1">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Call to Action Final */}
          <div className="text-center py-20 border-t border-cromia-border">
            <h3 className="font-fraunces text-3xl font-black text-cromia-ink mb-6">Sua clínica está pronta para o próximo nível?</h3>
            <a 
              href="https://wa.me/5511999999999" 
              className="inline-block bg-cromia-ink text-white px-10 py-5 rounded-sm font-bold tracking-widest uppercase hover:bg-cromia-gold transition-all duration-300 shadow-xl"
            >
              Falar com um Especialista
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
