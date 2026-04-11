import React, { useState, useMemo, useEffect } from 'react';

const fmt = (v: number) => 'R$ ' + Math.round(v).toLocaleString('pt-BR');
const fmtN = (v: number) => Math.round(v).toLocaleString('pt-BR');

interface Scenario {
  label: string;
  shortDesc: string;
  context: string;
  noshow_atual: number;
  noshow_reducao: number;
  recep_reducao: number;
  fora_horario_vol: number;
  fora_horario_perda: number;
  encaixe_taxa: number;
  reativ_taxa: number;
}

const scenarios: Record<string, Scenario> = {
  organizada: {
    label: 'Organizada',
    shortDesc: 'Processos razoáveis,<br>poucos buracos',
    context: 'Recepção funciona bem no horário comercial. No-show em torno de <strong>10%</strong> das consultas — a Yasmim elimina <strong>40%</strong> disso com confirmação ativa. Cerca de <strong>20%</strong> das tentativas de agendamento chegam fora do expediente, e <strong>60%</strong> dessas se perdem hoje. A Yasmim captura esse volume. Redução de <strong>30%</strong> na necessidade de recepcionistas. Reencaixe de <strong>30%</strong> dos cancelamentos. Reativação residual de <strong>1%</strong> dos inativos por mês.',
    noshow_atual: 0.10,
    noshow_reducao: 0.40,
    recep_reducao: 0.30,
    fora_horario_vol: 0.20,
    fora_horario_perda: 0.60,
    encaixe_taxa: 0.30,
    reativ_taxa: 0.01,
  },
  media: {
    label: 'Média',
    shortDesc: 'Gaps claros,<br>recepção sobrecarregada',
    context: 'Recepção sobrecarregada, telefone frequentemente ocupado. No-show em torno de <strong>18%</strong> — a Yasmim reduz <strong>55%</strong> disso com confirmação e reagendamento automático. <strong>30%</strong> das tentativas chegam fora do horário e <strong>75%</strong> dessas se perdem sem atendimento. Redução de <strong>50%</strong> no headcount de recepção. Reencaixe de <strong>45%</strong> dos cancelamentos. Reativação de <strong>2,5%</strong> da base de inativos por mês.',
    noshow_atual: 0.18,
    noshow_reducao: 0.55,
    recep_reducao: 0.50,
    fora_horario_vol: 0.30,
    fora_horario_perda: 0.75,
    encaixe_taxa: 0.45,
    reativ_taxa: 0.025,
  },
  precaria: {
    label: 'Precária',
    shortDesc: 'Muita perda,<br>sem automação nenhuma',
    context: 'Sem nenhuma automação. No-show chega a <strong>28%</strong> da agenda — a Yasmim elimina <strong>70%</strong> desse volume. <strong>40%</strong> das tentativas de agendamento chegam fora do expediente and <strong>90%</strong> se perdem hoje por completo. Redução de até <strong>80%</strong> na dependência da recepção. Reencaixe de <strong>60%</strong> dos cancelamentos. Reativação de <strong>5%</strong> da base inativa por mês — pacientes que nunca foram recontactados.',
    noshow_atual: 0.28,
    noshow_reducao: 0.70,
    recep_reducao: 0.80,
    fora_horario_vol: 0.40,
    fora_horario_perda: 0.90,
    encaixe_taxa: 0.60,
    reativ_taxa: 0.05,
  },
};

const DIAS_MES = 26;
const RECORRENCIA = 2000;

const Numeros: React.FC = () => {
  const [consultas, setConsultas] = useState(40);
  const [ticket, setTicket] = useState(200);
  const [recep, setRecep] = useState(3);
  const [salario, setSalario] = useState(1900);
  const [activeScenario, setActiveScenario] = useState('media');
  const [pulsing, setPulsing] = useState<Record<string, boolean>>({});

  const sc = scenarios[activeScenario];

  const results = useMemo(() => {
    // --- ECONOMIA ---
    const ecoRecep = salario * recep * sc.recep_reducao;
    const consultasMes = consultas * DIAS_MES;
    const noshowMes = consultasMes * sc.noshow_atual;
    const ecoNoshow = noshowMes * sc.noshow_reducao * ticket;
    const ecoExtras = salario * recep * sc.recep_reducao * 0.10;
    const totalEco = ecoRecep + ecoNoshow + ecoExtras;

    // --- RECEITA NOVA ---
    const tentativasFora = consultasMes * sc.fora_horario_vol;
    const recFora = tentativasFora * sc.fora_horario_perda * ticket;
    const recEncaixe = noshowMes * sc.encaixe_taxa * ticket;
    const recReativ = consultasMes * sc.reativ_taxa * ticket;
    const totalRec = recFora + recEncaixe + recReativ;

    // --- TOTAIS ---
    const total = totalEco + totalRec;
    const totalAno = total * 12;
    const paybackDias = Math.ceil(RECORRENCIA / (total / DIAS_MES));
    const roi = Math.round((total / RECORRENCIA - 1) * 100);
    const mult = (total / RECORRENCIA).toFixed(1);
    const consultasExtra = Math.round((recFora + recEncaixe) / ticket);

    return {
      ecoRecep, ecoNoshow, ecoExtras, totalEco,
      recFora, recEncaixe, recReativ, totalRec,
      total, totalAno, paybackDias, roi, mult, consultasExtra,
    };
  }, [consultas, ticket, recep, salario, activeScenario]);

  useEffect(() => {
    const keys = Object.keys(results);
    const newPulsing: Record<string, boolean> = {};
    keys.forEach(k => { newPulsing[k] = true; });
    setPulsing(newPulsing);
    const timer = setTimeout(() => setPulsing({}), 400);
    return () => clearTimeout(timer);
  }, [results]);

  const getPulseClass = (id: string) => pulsing[id] ? 'animate-calculator-pulse' : '';

  return (
    <div className="bg-cromia-bg text-cromia-ink font-space-grotesk min-h-screen m-0 p-0 overflow-x-hidden pt-4">
      <div className="max-w-[860px] mx-auto px-6 py-[30px]">
        {/* Header */}
        <div className="mb-12 border-b-1 border-cromia-ink/20 pb-8">
          <div className="text-sm font-semibold tracking-[0.3em] uppercase text-cromia-gold mb-4 flex items-center gap-[10px] before:content-[''] before:w-6 before:h-[2px] before:bg-cromia-gold">
            Cromia Health · Yasmim
          </div>
          <h1 className="font-fraunces text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05] m-0 mb-3">
            O que a Yasmim gera<br />
            <em className="italic font-light text-cromia-gold">trabalhando</em> enquanto<br />
            você dorme
          </h1>
          <p className="text-[17px] text-cromia-ink leading-[1.7] max-w-[860px] m-0">
            Configure o tamanho da clínica nos parâmetros. Escolha o cenário conforme a maturidade operacional atual dela — quanto mais desorganizada hoje, maior o benefício com a Yasmim.
          </p>
        </div>

        {/* Parâmetros */}
        <div className="bg-cromia-surface border border-cromia-border rounded-sm p-8 mb-5 shadow-lg">
          <div className="text-sm font-semibold tracking-[0.25em] uppercase text-cromia-ink2 mb-6 flex items-center gap-[10px] after:content-[''] after:flex-1 after:h-[1px] after:bg-cromia-border/50">
            Tamanho da clínica
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="flex flex-col gap-[10px]">
              <div className="flex justify-between items-baseline">
                <span className="text-base text-cromia-ink2 tracking-wider">Consultas por dia</span>
                <span className="font-fraunces text-[1.8rem] font-semibold text-cromia-ink">
                  {consultas} <small className="font-space-grotesk text-base text-cromia-muted font-normal">consultas</small>
                </span>
              </div>
              <input
                type="range" min="10" max="150" step="5" value={consultas}
                onChange={e => setConsultas(+e.target.value)}
                className="w-full h-[2px] bg-cromia-border appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:bg-cromia-gold [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(200,130,10,0.35)] [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:transition-transform"
              />
            </div>
            <div className="flex flex-col gap-[10px]">
              <div className="flex justify-between items-baseline">
                <span className="text-base text-cromia-ink2 tracking-wider">Ticket médio</span>
                <span className="font-fraunces text-[1.8rem] font-semibold text-cromia-ink">
                  R$ {ticket} <small className="font-space-grotesk text-base text-cromia-muted font-normal">/ consulta</small>
                </span>
              </div>
              <input
                type="range" min="100" max="300" step="10" value={ticket}
                onChange={e => setTicket(+e.target.value)}
                className="w-full h-[2px] bg-cromia-border appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:bg-cromia-gold [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(200,130,10,0.35)] [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:transition-transform"
              />
            </div>
            <div className="flex flex-col gap-[10px]">
              <div className="flex justify-between items-baseline">
                <span className="text-base text-cromia-ink2 tracking-wider">Recepcionistas</span>
                <span className="font-fraunces text-[1.8rem] font-semibold text-cromia-ink">
                  {recep} <small className="font-space-grotesk text-base text-cromia-muted font-normal">pessoas</small>
                </span>
              </div>
              <input
                type="range" min="1" max="10" value={recep}
                onChange={e => setRecep(+e.target.value)}
                className="w-full h-[2px] bg-cromia-border appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:bg-cromia-gold [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(200,130,10,0.35)] [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:transition-transform"
              />
            </div>
            <div className="flex flex-col gap-[10px]">
              <div className="flex justify-between items-baseline">
                <span className="text-base text-cromia-ink2 tracking-wider">Salário recepção</span>
                <span className="font-fraunces text-[1.8rem] font-semibold text-cromia-ink">
                  R$ {salario.toLocaleString('pt-BR')} <small className="font-space-grotesk text-base text-cromia-muted font-normal">/ mês</small>
                </span>
              </div>
              <input
                type="range" min="1200" max="4000" step="50" value={salario}
                onChange={e => setSalario(+e.target.value)}
                className="w-full h-[2px] bg-cromia-border appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:bg-cromia-gold [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(200,130,10,0.35)] [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:transition-transform"
              />
            </div>
          </div>
        </div>

        {/* Cenários */}
        <div className="mt-15 mb-20 shadow-lg">
          <div className="text-base font-semibold tracking-wide uppercase text-cromia-ink2 mb-5 mt-[50px] flex items-center gap-[10px] after:content-[''] after:flex-1 after:h-[1px] after:bg-cromia-border">
            Maturidade operacional atual
            <span className="text-base font-normal tracking-wide normal-case text-cromia-ink2">— Quanto mais precária, maior o impacto da Yasmim</span>
          </div>
          <div className="flex border border-cromia-border rounded-sm overflow-hidden bg-cromia-surface shadow-lg">
            {Object.keys(scenarios).map(s => (
              <button
                key={s}
                onClick={() => setActiveScenario(s)}
                className={`flex-1 py-4 px-2 md:px-8 text-center cursor-pointer text-sm font-semibold tracking-wider uppercase transition-all duration-200 border-r border-cromia-border last:border-r-0 ${activeScenario === s ? 'bg-cromia-gold text-white' : 'bg-none text-cromia-ink'
                  }`}
              >
                <span className="block mb-1">{scenarios[s].label}</span>
                <span className="block text-sm font-normal tracking-normal lowercase opacity-80 leading-tight" dangerouslySetInnerHTML={{ __html: scenarios[s].shortDesc }} />
              </button>
            ))}
          </div>
          <div
            className="mt-0 p-[14px_18px] bg-white border border-cromia-gold/15 rounded-sm text-[18px] text-cromia-ink2 leading-[1.4] [&_strong]:font-black [&_strong]:text-cromia-gold-dim [&_strong]:italic-none"
            dangerouslySetInnerHTML={{ __html: scenarios[activeScenario].context }}
          />
        </div>

        {/* Base de Informações */}
        <div className="mb-10 px-8 py-7 bg-cromia-surface border border-cromia-border rounded-sm shadow-sm transition-all hover:shadow-md">
          <div className="text-sm font-semibold tracking-[0.2em] uppercase text-cromia-gold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cromia-gold animate-pulse"></span>
            Base de Cálculo e Referências
          </div>
          <div className="space-y-4 text-cromia-ink2 leading-relaxed text-base">
            <p>
              <strong className="text-cromia-gold-dim">Base:</strong> literatura internacional de saúde aponta no-show entre <span className="font-semibold text-cromia-ink">15%–30%</span> em clínicas sem sistema de confirmação ativa. No Brasil, estudos do CFM e relatos de gestores de clínicas apontam médias próximas de <span className="font-semibold text-cromia-ink">20%</span> sem automação.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
              <div className="flex flex-col border-l-2 border-cromia-gold/30 pl-4">
                <span className="text-2xl font-fraunces font-bold text-cromia-gold">10%</span>
                <span className="text-sm leading-snug">Clínica que já faz alguma confirmação manual (ligação da recepção)</span>
              </div>
              <div className="flex flex-col border-l-2 border-cromia-gold/30 pl-4">
                <span className="text-2xl font-fraunces font-bold text-cromia-gold">18%</span>
                <span className="text-sm leading-snug">Clínica que não confirma sistematicamente, recepção ocupada</span>
              </div>
              <div className="flex flex-col border-l-2 border-cromia-gold/30 pl-4">
                <span className="text-2xl font-fraunces font-bold text-cromia-gold">28%</span>
                <span className="text-sm leading-snug">Sem nenhuma confirmação, agenda por telefone apenas</span>
              </div>
            </div>
            
            <p className="text-sm italic opacity-85 border-t border-cromia-border pt-4">
              <strong className="not-italic text-cromia-gold-dim">Risco:</strong> esses números variam muito por especialidade. Psiquiatria e nutrição têm no-show muito maior (30%–40%). Urgências, menor.
            </p>
          </div>
        </div>

        {/* Blocos de Valor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Economia */}
          <div className="rounded-sm p-7 bg-cromia-red-light border border-cromia-red/15 shadow-lg">
            <div className="text-sm font-semibold tracking-[0.25em] uppercase mb-[6px] text-cromia-red">O que deixa de perder</div>
            <div className="text-sm text-cromia-ink2 mb-[18px] leading-[1.4]">Economia com automação do atendimento</div>
            <div className={`font-fraunces text-3xl md:text-4xl lg:text-[2.4rem] font-black leading-none mb-1 text-cromia-red transition-all duration-300 ${getPulseClass('totalEco')}`}>
              {fmt(results.totalEco)}
            </div>
            <div className="text-[18px] text-cromia-ink2 mb-[18px]">por mês</div>
            <div className="flex flex-col gap-0">
              <div className="flex justify-between text-[15px] text-cromia-ink2 py-[6px] border-b border-black/5 last:border-b-0">
                <span>Redução de headcount</span>
                <strong className={getPulseClass('ecoRecep')}>{fmt(results.ecoRecep)}</strong>
              </div>
              <div className="flex justify-between text-[15px] text-cromia-ink2 py-[6px] border-b border-black/5 last:border-b-0">
                <span>Redução de no-show</span>
                <strong className={getPulseClass('ecoNoshow')}>{fmt(results.ecoNoshow)}</strong>
              </div>
              <div className="flex justify-between text-[15px] text-cromia-ink2 py-[6px] border-b border-black/5 last:border-b-0">
                <span>Horas extras evitadas</span>
                <strong className={getPulseClass('ecoExtras')}>{fmt(results.ecoExtras)}</strong>
              </div>
            </div>
          </div>

          {/* Receita */}
          <div className="rounded-sm p-7 bg-cromia-teal-light border border-cromia-teal/15 shadow-lg">
            <div className="text-sm font-semibold tracking-[0.25em] uppercase mb-[6px] text-cromia-teal">O que passa a ganhar</div>
            <div className="text-sm text-cromia-ink2 mb-[18px] leading-[1.4]">Receita nova capturada 24/7</div>
            <div className={`font-fraunces text-3xl md:text-4xl lg:text-[2.4rem] font-black leading-none mb-1 text-cromia-teal transition-all duration-300 ${getPulseClass('totalRec')}`}>
              {fmt(results.totalRec)}
            </div>
            <div className="text-[18px] text-cromia-ink2 mb-[18px]">por mês</div>
            <div className="flex flex-col gap-0">
              <div className="flex justify-between text-[15px] text-cromia-ink2 py-[6px] border-b border-black/5 last:border-b-0">
                <span>Agendamentos fora do horário</span>
                <strong className={getPulseClass('recFora')}>{fmt(results.recFora)}</strong>
              </div>
              <div className="flex justify-between text-[15px] text-cromia-ink2 py-[6px] border-b border-black/5 last:border-b-0">
                <span>Reencaixe de cancelamentos</span>
                <strong className={getPulseClass('recEncaixe')}>{fmt(results.recEncaixe)}</strong>
              </div>
              <div className="flex justify-between text-[15px] text-cromia-ink2 py-[6px] border-b border-black/5 last:border-b-0">
                <span>Reativação de pacientes inativos</span>
                <strong className={getPulseClass('recReativ')}>{fmt(results.recReativ)}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Final */}
        <div className="bg-cromia-ink rounded-sm p-10 text-center mt-10 mb-4 relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_130%,rgba(200,130,10,0.7)_0%,transparent_65%)] pointer-events-none" />
          <div className="text-sm font-normal tracking-[0.3em] uppercase text-white/70 mb-[10px] relative z-10">
            Valor total gerado com a Yasmim / mês
          </div>
          <div className={`font-fraunces text-[clamp(2.5rem,8vw,5rem)] font-black text-cromia-bg leading-none mb-2 transition-all duration-400 relative z-10 [text-shadow:0_0_80px_rgba(200,130,10,0.25)] ${getPulseClass('total')}`}>
            {fmt(results.total)}
          </div>
          <div className="text-[18px] text-white/70 tracking-wider leading-relaxed relative z-10">
            <strong className={`text-white/85 ${getPulseClass('totalAno')}`}>{fmt(results.totalAno)}</strong> por ano &nbsp;·&nbsp;
            A Yasmim se paga em <strong className={`text-white/100 ${getPulseClass('paybackDias')}`}>{results.paybackDias} dias</strong> de operação
          </div>
        </div>

        {/* ROI / Pills */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-10 mt-10">
          <div className="bg-cromia-teal-light border border-cromia-gold/20 rounded-sm p-[18px] text-center shadow-lg">
            <span className={`block font-fraunces text-3xl font-black text-cromia-teal mb-1 transition-all duration-300 ${getPulseClass('roi')}`}>{results.roi}%</span>
            <span className="text-[14px] text-cromia-ink2 tracking-widest uppercase">ROI sobre Mensalidade Starter</span>
          </div>
          <div className="bg-cromia-teal-light border border-cromia-gold/20 rounded-sm p-[18px] text-center shadow-lg">
            <span className={`block font-fraunces text-3xl font-black text-cromia-teal mb-1 transition-all duration-300 ${getPulseClass('mult')}`}>{results.mult}x</span>
            <span className="text-[14px] text-cromia-ink2 tracking-widest uppercase">Retorno por cada R$ investido</span>
          </div>
          <div className="bg-cromia-teal-light border border-cromia-gold/20 rounded-sm p-[18px] text-center shadow-lg">
            <span className={`block font-fraunces text-3xl font-black text-cromia-teal mb-1 transition-all duration-300 ${getPulseClass('consultasExtra')}`}>+{fmtN(results.consultasExtra)}/mês</span>
            <span className="text-[14px] text-cromia-ink2 tracking-widest uppercase">Consultas novas/mês</span>
          </div>
        </div>

        {/* Pitch Argument */}
        <div className="bg-cromia-surface border border-cromia-border border-l-4 border-l-cromia-gold rounded-sm px-8 py-7 mb-10 shadow-lg">
          <div className="text-[18px] font-bold tracking-widest uppercase text-cromia-gold mb-3.5">
            O fato é...
          </div>
          <p className="font-fraunces text-[1.3rem] font-light italic text-cromia-ink leading-[1.8]">
            "Com <strong className="font-semibold not-italic text-cromia-gold-dim">{consultas} consultas/dia</strong> e ticket médio de <strong className="font-semibold not-italic text-cromia-gold-dim">{fmt(ticket)}</strong>,
            essa clínica perde hoje em torno de <strong className="font-semibold not-italic text-cromia-gold-dim">{fmt(results.ecoNoshow)}/mês</strong> só com <strong className="font-semibold not-italic text-cromia-gold-dim">no-show</strong> —
            e mais <strong className="font-semibold not-italic text-cromia-gold-dim">{fmt(results.recFora)}/mês</strong> em pacientes que tentam agendar fora do horário e não encontram ninguém.
            A Yasmim trabalha às 23h de domingo. No total, ela gera <strong className="font-semibold not-italic text-cromia-gold-dim">{fmt(results.total)}/mês</strong> de valor real.
            A recorrência (starter) é <strong className="font-semibold not-italic text-cromia-gold-dim">R$ 2.000</strong>. O resto fica inteiro no caixa da clínica."
          </p>
        </div>

        {/* Planos */}
        <div className="bg-cromia-surface2 border border-cromia-border rounded-sm px-8 py-7 mb-30 shadow-lg">
          <div className="text-base font-semibold tracking-widest uppercase text-cromia-ink2 mb-6 flex items-center gap-[10px] after:content-[''] after:flex-1 after:h-[1px] after:bg-cromia-border">
            Planos de Implementação - Proporcionais ao tamanho da Clínica
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-cromia-border rounded-sm p-5 bg-cromia-surface text-center">
              <div className="text-base font-semibold tracking-widest uppercase text-cromia-muted mb-2">Starter</div>
              <div className="font-fraunces text-[1.8rem] font-black text-cromia-ink mb-1">R$ 2.000</div>
              <div className="text-[17px] text-cromia-ink2 mb-3.5">1–5 médicos</div>
              <span className={`text-sm px-2.5 py-1 rounded-full font-semibold bg-cromia-teal-light text-cromia-teal inline-block transition-all duration-300 ${getPulseClass('total')}`}>
                gera {(results.total / 2000).toFixed(1)}x
              </span>
            </div>
            <div className="border border-cromia-border rounded-sm p-5 bg-cromia-surface text-center">
              <div className="text-base font-semibold tracking-widest uppercase text-cromia-muted mb-2">Standard</div>
              <div className="font-fraunces text-[1.8rem] font-black text-cromia-ink mb-1">R$ 2.800</div>
              <div className="text-[17px] text-cromia-ink2 mb-3.5">6–15 médicos</div>
              <span className={`text-sm px-2.5 py-1 rounded-full font-semibold bg-cromia-teal-light text-cromia-teal inline-block transition-all duration-300 ${getPulseClass('total')}`}>
                gera {(results.total / 2800).toFixed(1)}x
              </span>
            </div>
            <div className="border border-cromia-border rounded-sm p-5 bg-cromia-surface text-center">
              <div className="text-base font-semibold tracking-widest uppercase text-cromia-muted mb-2">Pro</div>
              <div className="font-fraunces text-[1.8rem] font-black text-cromia-ink mb-1">R$ 3.900</div>
              <div className="text-[17px] text-cromia-ink2 mb-3.5">15+ médicos</div>
              <span className={`text-sm px-2.5 py-1 rounded-full font-semibold bg-cromia-teal-light text-cromia-teal inline-block transition-all duration-300 ${getPulseClass('total')}`}>
                gera {(results.total / 3900).toFixed(1)}x
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Numeros;
