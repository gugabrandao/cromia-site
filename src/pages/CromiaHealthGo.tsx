import React, { useState, useEffect } from 'react';
import MeshBackground from '../components/MeshBackground';
import {
  Handshake, Lightbulb, Bot,
  DollarSign, CalendarDays, BarChart3, MessageSquare,
  Stethoscope, ShieldCheck, BookOpen, LineChart,
  Bell, RefreshCcw, Moon, UserRoundCog,
  ChevronDown, CheckCircle2,
} from 'lucide-react';

const WA_LINK = 'https://wa.me/5521994679907?text=Ol%C3%A1%2C%20vim%20pela%20p%C3%A1gina%20Cromia%20Health%20e%20quero%20saber%20mais!';

const CTA = ({ label = 'Quero uma demonstração gratuita', size = 'md' }: { label?: string; size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = {
    sm: 'px-6 py-3 text-sm',
    md: 'px-8 py-4 text-base',
    lg: 'px-10 py-5 text-lg',
  };
  return (
    <a
      href={WA_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-3 bg-emerald-500 !text-white font-bold tracking-wide rounded-2xl shadow-xl hover:bg-emerald-600 active:scale-95 transition-all duration-200 hover:shadow-2xl hover:scale-105 ${sizes[size]}`}
    >
      <svg className="w-7 h-7 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      {label}
    </a>
  );
};

const pillars = [
  {
    icon: <Handshake className="w-11 h-11 text-[#b45f3b]" />,
    title: 'Parceria Estratégica',
    desc: 'Não vendemos apenas um produto, mas sim uma parceria. Mapeamos a sua operação, entendemos seus gargalos e crescemos juntos com você. Sem ticket de suporte sem rosto — um desenvolvedor real que conhece sua clínica pelo nome.',
  },
  {
    icon: <Lightbulb className="w-11 h-11 text-[#b45f3b]" />,
    title: 'Interface Amigável',
    desc: 'Sua equipe aprende a usar o Sistema no primeiro dia. Sem manuais de 500 páginas, sem batalha com ferramentas escondidas ou desnecessárias. Simples de usar — robusto na infraestrutura.',
  },
  {
    icon: <Bot className="w-11 h-11 text-[#b45f3b]" />,
    title: 'IA Nativa, Sem Gambiarras',
    desc: 'A Agente de IA agenda em uma agenda real, altera em banco de dados real, compreende áudios e mantém contexto de conversa. Sem ferramentas de terceiros, sem "Aperte 1, 2 ou 3", sem chatbot de FAQ disfarçado de IA.',
  },
] as { icon: React.ReactNode; title: string; desc: string }[];

const features: { icon: React.ReactNode; label: string }[] = [
  { icon: <BarChart3 className="w-5 h-5 text-[#b45f3b]" />, label: 'Dashboard em tempo real' },
  { icon: <CalendarDays className="w-5 h-5 text-[#b45f3b]" />, label: 'Agenda inteligente' },
  { icon: <LineChart className="w-5 h-5 text-[#b45f3b]" />, label: 'Relatórios e faturamento' },
  { icon: <MessageSquare className="w-5 h-5 text-[#b45f3b]" />, label: 'WhatsApp API Oficial' },
  { icon: <Stethoscope className="w-5 h-5 text-[#b45f3b]" />, label: 'Gestão de médicos e escalas' },
  { icon: <ShieldCheck className="w-5 h-5 text-[#b45f3b]" />, label: 'Hierarquia de acesso e segurança' },
  { icon: <BookOpen className="w-5 h-5 text-[#b45f3b]" />, label: 'FAQ operacional prático' },
  { icon: <DollarSign className="w-5 h-5 text-[#b45f3b]" />, label: 'Auditoria de custos de IA' },
  { icon: <Bell className="w-5 h-5 text-[#b45f3b]" />, label: 'Confirmação e lembretes anti No-Show' },
  { icon: <RefreshCcw className="w-5 h-5 text-[#b45f3b]" />, label: 'Reativação automática de inativos' },
  { icon: <Moon className="w-5 h-5 text-[#b45f3b]" />, label: 'Agendamento 24/7' },
  { icon: <UserRoundCog className="w-5 h-5 text-[#b45f3b]" />, label: 'Painel extra para médicos' },
];

const objections = [
  {
    q: 'Já uso outras plataformas renomadas do mercado, por que eu deveria mudar?',
    a: 'Você realmente está satisfeito com as ferramentas que usa hoje? Sabemos o quanto você investe nesses Sistemas que até entregam o que se propõem a entregar, mas provavelmente não trazem o resultado que você espera: Agendamentos em escala. Não temos a intensão de ser anti-éticos e difamar o trabalho alheio, mas sabemos das dificuldades que nossos clientes enfrentam ao utilizar essas ferramentas complexas e confusas e por isso criamos um Ecossistema com o foco em produção, usabilidade e resultados reais, com valor justo.',
  },
  {
    q: 'A IA realmente agenda sem intervenção humana?',
    a: 'Sim. A chamamos carinhosamente de Yasmim, podendo ser personalizada com o nome que for compatível com a identidade da sua clínica. A Yasmim agenda, reagenda, cancela e oferece horários em uma agenda real, criada pelos nossos desenvolvedores — não em calendário genérico de terceiros. Ela entende envios de áudios, mantém contexto de conversa e só aciona a recepção humana se realmente desejarem ou quando a complexidade realmente exigir um toque humano, como a avaliação de um exame, por exemplo. Sabemos a responsabilidade que é lidar com dados sensíveis.',
  },
  {
    q: 'Minha equipe vai conseguir usar?',
    a: 'Essa talvez seja a nossa principal premissa. O Cromia Health foi projetado para que uma secretária de nível júnior comece a operar no primeiro dia, sem treinamento caro - entendemos que tempo é dinheiro e "aqueles" treinamentos podem ser, de fato, intermináveis. O Sistema foi desenhado para ser intuitivo, mas ao mesmo tempo robusto para que as necessidades da rotina da sua clínica sejam atendidas.',
  },
  {
    q: 'Como funciona o suporte?',
    a: 'Você tem parceiros estratégicos de verdade que conhecem sua clínica pelo nome e que estão presentes. Não somos revendedores de um produto, somos os desenvolvedores, não somos um ticket sem rosto. Seus problemas são nossas prioridades de desenvolvimento — Eles não entram numa fila de meses de um SaaS que atende mil mercados ao mesmo tempo.',
  },
];

const CromiaHealthGo = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <MeshBackground />
      <div className="bg-cromia-gold/5 text-[#3a3a3a] font-space-grotesk min-h-screen overflow-x-hidden">

        {/* ── HERO ── */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-16 pb-20 text-center">
          <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <a href="https://cromia.app" className="inline-block mb-10 -ml-10">
              <img src="/imgs/logo.svg" alt="Cromia Health" className="w-44 md:w-64 mx-auto" />
            </a>

            <div className="inline-block text-lg font-bold tracking-[0.3em] uppercase text-[#b45f3b] bg-[#b45f3b]/10 px-4 py-2 rounded-full mb-6 items-end">
              Ecossistema de Gestão Clínica com IA
            </div>

            <h1 className="font-fraunces font-black text-4xl md:text-6xl lg:text-7xl text-cromia-grey leading-[1.0] mb-4 max-w-4xl mx-auto">
              Sua clínica atendendo<br />
              <em className="font-light italic text-[#b45f3b]">enquanto você dorme.</em>
            </h1>

            <p className="text-base md:text-xl text-cromia-ink2 font-light leading-relaxed max-w-2xl mx-auto mb-10 mt-6">
              A sua <strong className="font-semibold text-cromia-ink">Agente de IA</strong> agenda, confirma, reagenda e reativa pacientes às 23h de um domingo —
              sem fila, sem erro e sem perder pacientes em potencial. Um único ecossistema que substitui várias ferramentas empilhadas no famoso efeito <span className="italic">"Frankstein".</span>
            </p>

            <CTA size="lg" />

            <p className="mt-4 text-lg text-black/70 italic">Demonstração gratuita · Sem compromisso</p>
          </div>

          {/* scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cromia-muted/40 animate-bounce">
            <ChevronDown className="w-6 h-6" />
          </div>
        </section>

        {/* ── NÚMEROS DE IMPACTO ── */}
        <section className="py-16 bg-cromia-ink text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,#b45f3b50,transparent_100%)] pointer-events-none" />
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10 text-center">
            {[
              { num: '24/7', label: 'Atendimento da Yasmim' },
              { num: '-55%', label: 'Redução de No-Show' },
              { num: '0', label: 'Integrações externas necessárias' },
              { num: '1º dia', label: 'Equipe já opera o sistema' },
            ].map((s) => (
              <div key={s.num}>
                <div className="font-fraunces text-4xl md:text-5xl font-black !text-cromia-gold-light mb-2">{s.num}</div>
                <div className="text-base text-cromia-gold-light tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3 PILARES ── */}
        <section className="py-20 px-6 mb-22 mt-22">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <div className="text-lg font-bold tracking-[0.3em] uppercase text-[#b45f3b] mb-3">Nossos Pilares</div>
              <h2 className="font-fraunces text-3xl md:text-5xl font-black text-cromia-grey leading-tight">
                Três razões pra você
                <em className="font-light italic text-[#b45f3b]"> simplesmente mudar.</em>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pillars.map((p) => (
                <div key={p.title} className="bg-white/80 backdrop-blur-sm border border-cromia-border rounded-2xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="mb-5">{p.icon}</div>
                  <h3 className="font-fraunces text-2xl font-black text-cromia-ink mb-3">{p.title}</h3>
                  <p className="text-cromia-ink2 font-light leading-relaxed text-lg">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── O PROBLEMA ── */}
        <section className="py-20 px-6 bg-white/50">
          <div className="max-w-[1100px] mx-auto">
            <div className="border-l-4 border-[#b45f3b] pl-8">
              <div className="text-xl font-bold tracking-[0.3em] uppercase text-[#b45f3b] mb-4">O cenário real</div>
              <h2 className="font-fraunces text-3xl md:text-4xl font-black text-cromia-grey mb-6">
                A maioria das clínicas paga entre 5.000 a R$ 10.000/mês (ou mais),
                <em className="font-semibold italic text-[#b45f3b]"> empilhando ferramentas que não conversam.</em>
              </h2>
              <p className="text-cromia-ink2 text-xl font-light leading-relaxed mb-8">
                São Ferramentas para visibilidade. Outras para agenda (muitas vezes do mesmo grupo, mas com cobranças separadas).
                Chatbot de um terceiro que "promete integrar" ao sistema que faz questão de dificultar o funcionamento adequado.
                Sendo necessárias integrações das mais escusas pra tentar conectar esse caos e mais a pessoa pra, provavelmente, realizar esse monitoramento e administração em tempo integral, mão de obra extremamente técnica dificultando até a contratação desse funcionário específico no Mercado.
                E ainda pra somar: Add-on sobre add-on. Custo sobre custo. E sabemos que não pára por aí.
              </p>
              <div className="bg-green-800 text-white rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
                <DollarSign className="w-12 h-12 text-white flex-shrink-0" />
                <div>
                  <div className="font-fraunces text-3xl font-black mb-1">Cromia Health propõe outro caminho.</div>
                  <p className="text-white/90 font-light mt-4 text-xl">Um único Ecossistema. Uma única plataforma. Uma única parceria para os diversos problemas de atendimento, agendamento e relacionamento com o paciente da sua clínica. Mais Agendamentos, mais receita porque esse é o foco, sem complicar de um ponto a outro. Um Sistema que se propõe a se desenvolver constantemente junto com as necessidades da clínica.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── YASMIM ── */}
        <section className="py-20 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,#b45f3b08,transparent_60%)] pointer-events-none" />
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="text-xl font-bold tracking-[0.3em] uppercase text-[#b45f3b] mb-4">A Agente de IA</div>
                <h2 className="font-fraunces text-3xl md:text-5xl font-black text-cromia-grey leading-tight mb-6">
                  Conheça a <em className="font-light italic text-[#b45f3b]">Yasmim.</em>
                </h2>
                <p className="text-cromia-ink2 font-light leading-relaxed text-base md:text-xl mb-6">
                  Treinada com todos as particularidades da sua clínica — especialidades, médicos, horários, planos, dúvidas frequentes —
                  ela atende seus pacientes no WhatsApp com uma naturalidade humana.
                  Não é um chatbot de FAQ. É uma especialista em gestão clínica.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    'Agenda, reagenda e cancela em uma agenda real',
                    'Responde áudios e mantém contexto de conversa',
                    'Reativa pacientes inativos automaticamente',
                    'Dispara lembretes anti No-Show com confirmação ativa',
                    'Disponível 24/7 sem feriados ou finais de semana',
                    'Integra-se ao sistema existente sem barreiras',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-cromia-ink2 text-base md:text-base">
                      <CheckCircle2 className="w-5 h-5 text-[#b45f3b] flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-cromia-ink rounded-2xl p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,#b45f3b40,transparent_60%)] pointer-events-none" />
                <div className="relative z-10 space-y-4">
                  <div className="!text-sm font-bold tracking-[0.3em] uppercase text-cromia-gold-light/80 mb-6">Simulação de Conversa</div>
                  {[
                    { from: 'patient', msg: 'Oi, quero marcar uma consulta com cardiologista pra semana que vem' },
                    { from: 'yasmim', msg: 'Olá! 😊 Tenho horários disponíveis na terça (dia 22) às 09h e às 14h, e na quinta (dia 24) às 10h. Qual prefere?' },
                    { from: 'patient', msg: 'Quinta às 10h fica ótimo' },
                    { from: 'yasmim', msg: 'Perfeito! Consulta confirmada para quinta-feira, dia 24, às 10h com o Dr. Ricardo. Vou te enviar um lembrete na véspera. 👍' },
                  ].map((m, i) => (
                    <div key={i} className={`flex ${m.from === 'patient' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.from === 'patient'
                        ? 'bg-white/15 text-white/90 rounded-br-sm'
                        : 'bg-[#b45f3b]/80 text-white rounded-bl-sm'
                        }`}>
                        {m.from === 'yasmim' && <span className="block text-[10px] font-bold tracking-wider text-white/60 mb-1 uppercase">Yasmim · Agora</span>}
                        {m.msg}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES GRID ── */}
        <section className="py-20 px-6 bg-white/50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-2xl font-bold tracking-[0.3em] uppercase text-[#b45f3b] mb-3">Tudo incluso</div>
              <h2 className="font-fraunces text-3xl md:text-5xl font-black text-cromia-grey">Um ecossistema completo.</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {features.map((f) => (
                <div key={f.label} className="bg-white border border-cromia-border rounded-xl p-5 flex items-center gap-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <span className="flex-shrink-0">{f.icon}</span>
                  <span className="text-lg text-cromia-ink font-light leading-tight">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PARCERIA ── */}
        <section className="py-20 px-6 bg-cromia-ink text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_100%,#b45f3b40,transparent_50%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_0%,#b45f3b25,transparent_50%)] pointer-events-none" />
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="text-center mb-14">
              <div className="text-lg font-bold tracking-[0.3em] uppercase text-cromia-gold/80 mb-3">Nosso maior predicado</div>
              <h2 className="font-fraunces text-3xl md:text-5xl font-semibold leading-tight text-cromia-gold-light">
                Não vendemos um sistema.<br />
                <em className="font-light italic text-[#b45f3b]">Construímos uma parceria.</em>
              </h2>
              <p className="text-cromia-gold-light text-xl font-light max-w-2xl mx-auto mt-6">
                Muitas ferramentas geram um boleto e desaparecem atrás de um formulário de suporte.
                A Cromia opera com uma premissa diferente: <strong className="text-cromia-gold-light font-bold">Parceria Estratégica e Inteligente são fundamentais para nós.</strong>
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  title: 'Comprometimento com resultado',
                  desc: 'Antes de fechar contrato, mapeamos a operação e então propomos a solução se acreditarmos que vai funcionar para o seu contexto específico, porque entendemos que não existem fórmulas mágicas.',
                },
                {
                  title: 'Presença além do onboarding',
                  desc: 'Desenvolvedores que se propõem a conhecer a sua clínica pessoalmente, seu histórico e seus objetivos — interessados em criar soluções definitivas para o seu negócio.',
                },
                {
                  title: 'Evolução co-criada',
                  desc: 'Feedbacks viram funcionalidades. Problemas viram prioridades — não entram numa fila genérica de espera. O Sistema se adapta e evolui junto com a sua clínica.',
                },
              ].map((c) => (
                <div key={c.title} className="border-t-2 border-cromia-gold/40 pt-6">
                  <h3 className="font-fraunces text-3xl font-semibold text-cromia-gold mb-3">{c.title}</h3>
                  <p className="text-cromia-gold-light/90 font-light leading-relaxed text-lg">{c.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-14 text-center">
              <CTA label="Conversar com a equipe Cromia" size="lg" />
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-lg font-bold tracking-[0.3em] uppercase text-[#b45f3b] mb-3">Dúvidas Frequentes</div>
              <h2 className="font-fraunces text-3xl md:text-5xl font-black text-cromia-grey">Respostas diretas.</h2>
            </div>
            <div className="space-y-3">
              {objections.map((o, i) => (
                <div key={i} className="bg-white border border-cromia-border rounded-xl overflow-hidden shadow-sm">
                  <button
                    className="w-full flex justify-between items-center p-6 text-left text-cromia-ink font-medium text-xl hover:bg-cromia-gold/5 transition-colors cursor-pointer"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span>{o.q}</span>
                    <span className={`text-[#b45f3b] ml-4 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-45' : ''}`}>
                      <ChevronDown className="w-5 h-5" />
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-6 text-cromia-ink2 font-light leading-relaxed text-lg border-t border-cromia-border/50 pt-4">
                      {o.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="py-24 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,#b45f3b08,transparent_70%)] pointer-events-none" />
          <div className="max-w-3xl mx-auto relative z-10">
            <div className="text-lg font-bold tracking-[0.3em] uppercase text-[#b45f3b] mb-6">Próximo passo</div>
            <h2 className="font-fraunces text-4xl md:text-6xl font-black text-cromia-grey leading-tight mb-6">
              Fez sentido pra você?<br />
              <em className="font-light italic text-[#b45f3b]">Que tal uma conversa?</em>
            </h2>
            <p className="text-cromia-ink2 text-xl font-light leading-relaxed mb-10 max-w-xl mx-auto">
              Uma demonstração ao vivo é mais produtiva do que qualquer argumento.
              Mostraremos quão impressionante pode ser a gestão da sua clínica.
            </p>
            <CTA label="Entre em Contato com a Cromia" size="lg" />
          </div>
        </section>

        {/* ── FOOTER ── */}
        <div className="text-center py-12 text-cromia-muted text-sm tracking-widest border-t border-cromia-border">
          DESENVOLVIDO PELA{' '}
          <a href="https://cromia.app" className="font-semibold hover:text-cromia-gold transition-colors underline decoration-cromia-border underline-offset-4">
            CROMIA
          </a>{' '}
          — {new Date().getFullYear()}
        </div>
      </div>
    </>
  );
};

export default CromiaHealthGo;
