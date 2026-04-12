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
    context: '- Recepção funciona bem no horário comercial. No-show em torno de <strong>10%</strong> das consultas.</br></br>- <strong>Yasmim</strong> elimina <strong>40%</strong> disso com confirmação ativa.</br></br>- Cerca de <strong>20%</strong> das tentativas de agendamento chegam fora do expediente.</br></br>- <strong>60%</strong> dessas se perdem hoje. A <strong>Yasmim</strong> captura esse volume.</br></br>- Redução de <strong>30%</strong> na necessidade de recepcionistas.</br></br>- Reencaixe de <strong>30%</strong> dos cancelamentos.</br></br>- Reativação residual de <strong>1%</strong> dos inativos por mês.',
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
    context: '- Recepção sobrecarregada, telefone frequentemente ocupado. No-show em torno de <strong>18%</strong>.</br></br>- <strong>Yasmim</strong> reduz <strong>55%</strong> disso com confirmação e reagendamento automático.</br></br>- <strong>30%</strong> das tentativas chegam fora do horário.</br></br>- <strong>75%</strong> dessas se perdem sem atendimento.</br></br>- Redução de <strong>50%</strong> no headcount de recepção.</br></br>- Reencaixe de <strong>45%</strong> dos cancelamentos.</br></br>- Reativação de <strong>2,5%</strong> da base de inativos por mês.',
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
    context: '- Sem nenhuma automação. No-show chega a <strong>28%</strong> da agenda.</br></br>- <strong>Yasmim</strong> elimina <strong>70%</strong> desse volume.</br></br>- <strong>40%</strong> das tentativas de agendamento chegam fora do expediente.</br></br>- <strong>90%</strong> se perdem hoje por completo.</br></br>- Redução de até <strong>80%</strong> na dependência da recepção.</br></br>- Reencaixe de <strong>60%</strong> dos cancelamentos.</br></br>- Reativação de <strong>5%</strong> da base inativa por mês — pacientes que nunca foram recontactados.',
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

const referenceData: Record<string, {
  label: string;
  title: string;
  base: React.ReactNode;
  benchmarks: { value: string; desc: string }[];
  obs?: string;
}> = {
  'noshow-mercado': {
    label: 'NO-SHOW',
    title: 'No-Show (Médias de Mercado)',
    base: <>Literatura internacional de saúde aponta no-show entre <span className="font-semibold text-cromia-ink">15%–30%</span> em clínicas sem sistema de confirmação ativa. No Brasil, estudos do CFM e relatos de gestores de clínicas apontam médias próximas de <span className="font-semibold text-cromia-ink">20%</span> sem automação.</>,
    benchmarks: [
      { value: '10%', desc: 'Clínica que já faz alguma confirmação manual (ligação da recepção)' },
      { value: '18%', desc: 'Clínica que não confirma sistematicamente, recepção ocupada' },
      { value: '28%', desc: 'Sem nenhuma confirmação, agenda por telefone apenas' }
    ],
    obs: 'Esses números variam muito por especialidade. Psiquiatria e nutrição têm no-show muito maior (30%–40%). Urgências, menor.'
  },
  'noshow-yasmim': {
    label: 'REDUÇÃO NO-SHOW',
    title: 'Redução de No-Show pela Yasmim',
    base: <>Estudos de SMS e WhatsApp reminder em saúde mostram redução de <span className="font-semibold text-cromia-ink">25%–50%</span> no no-show. Com confirmação ativa + reagendamento automático, o teto sobe.</>,
    benchmarks: [
      { value: '40%', desc: 'Clínica que já confirmava manualmente — a Yasmim melhora, mas o delta é menor' },
      { value: '55%', desc: 'Substitui um processo inexistente por um consistente' },
      { value: '70%', desc: 'Substitui o caos total — qualquer confirmação já resolve muito' }
    ]
  },
  'headcount': {
    label: 'REDUÇÃO HEADCOUNT',
    title: 'Redução de headcount de recepção',
    base: <>Estimativa funcional — se a Yasmim absorve agendamento, cancelamento, FAQ e confirmação, quanto do trabalho da recepção ela substitui?</>,
    benchmarks: [
      { value: '30%', desc: 'Clínica organizada ainda precisa de recepção para acolhimento, prontuário, pagamento' },
      { value: '50%', desc: 'Metade do volume era atendimento que a Yasmim resolve' },
      { value: '80%', desc: 'Clínica que usava recepção quase exclusivamente para agendamento por telefone' }
    ],
    obs: 'Esse é o número mais difícil de vender. Gestores resistem a falar em demissão. Na prática, o argumento muda para "não precisa contratar mais quando crescer" em vez de "vai demitir".'
  },
  'volume-fora': {
    label: 'FORA DO HORÁRIO',
    title: 'Volume fora do horário',
    base: <>Comportamento de consumidor digital. Dados do Google Health e pesquisas de UX em saúde mostram que <span className="font-semibold text-cromia-ink">30%–40%</span> das buscas por serviços de saúde acontecem fora do horário comercial — noite, madrugada e fins de semana.</>,
    benchmarks: [
      { value: '20%', desc: 'Especialidade com perfil mais corporativo (plano empresarial, horário comercial)' },
      { value: '30%', desc: 'Média geral do mercado' },
      { value: '40%', desc: 'Especialidades com perfil familiar ou popular (pediatria, clínica geral)' }
    ]
  },
  'perda-tentativas': {
    label: 'PERDAS',
    title: 'Perda dessas tentativas',
    base: <>Inferência direta da maturidade da clínica.</>,
    benchmarks: [
      { value: '60%', desc: 'Tem WhatsApp ativo, mas sem resposta automática — alguns pacientes tentam de novo no dia seguinte' },
      { value: '75%', desc: 'Telefone fixo ou WhatsApp sem bot — maioria desiste' },
      { value: '90%', desc: 'Só telefone, sem WhatsApp — quase perda total fora do horário' }
    ]
  },
  'reencaixe': {
    label: 'REENCAIXE',
    title: 'Reencaixe de cancelamentos',
    base: <>Estimativa de eficiência de fila de espera ativa. Sem automação, horário cancelado vira buraco. Com Yasmim oferecendo o horário para lista de espera:</>,
    benchmarks: [
      { value: '30%', desc: 'Clínica com agenda muito cheia, pouca lista de espera' },
      { value: '45%', desc: 'Média com alguma demanda reprimida' },
      { value: '60%', desc: 'Clínica precária tem mais cancelamentos E mais pacientes esperando' }
    ]
  },
  'reativacao': {
    label: 'REATIVAÇÃO',
    title: 'Reativação de inativos',
    base: <>Benchmarks de CRM em saúde e varejo. Taxa de reativação de base inativa via mensagem ativa gira entre <span className="font-semibold text-cromia-ink">2%–8%</span> dependendo do tempo de inatividade e da oferta.</>,
    benchmarks: [
      { value: '1%', desc: 'Base relativamente recente, pacientes não sumiram há muito tempo' },
      { value: '2,5%', desc: 'Base mista, algum potencial de recuperação' },
      { value: '5%', desc: 'Base antiga, nunca recontactada — qualquer mensagem já converte mais' }
    ]
  }
};

const Numeros: React.FC = () => {
  const [consultas, setConsultas] = useState(40);
  const [ticket, setTicket] = useState(200);
  const [recep, setRecep] = useState(3);
  const [salario, setSalario] = useState(1900);
  const [activeScenario, setActiveScenario] = useState('media');
  const [activeRef, setActiveRef] = useState('noshow-mercado');
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
    <div className="bg-[#faf4f2] text-[#b45f3b] font-space-grotesk min-h-screen m-0 p-0 overflow-x-hidden pt-4">
      <div className="max-w-[860px] mx-auto px-6 py-[30px] relative">
        <a href="https://cromia.app" className="absolute top-4 right-6 transition-transform hover:scale-105 active:scale-95">
          <img src="/imgs/logo.svg" alt="Cromia Logo" className="w-40 md:w-40" />
        </a>
        {/* Header */}
        <div className="mb-12 border-b-1 border-cromia-ink/20 pb-8">
          <div className="text-base font-semibold tracking-[0.3em] uppercase text-[#b45f3b] mb-4 flex items-center gap-[10px] before:content-[''] before:w-6 before:h-[2px] before:bg-cromia-gold">
            Cromia Health
          </div>
          <h1 className="font-fraunces text-cromia-ink/80 text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05] m-0 mb-3">
            O que a Yasmim gera<br />
            <em className="italic font-light text-[#b45f3b]">trabalhando</em> enquanto<br />
            você dorme
          </h1>
          <p className="text-[17px] text-cromia-ink leading-[1.7] max-w-[860px] m-0">
            Configure o <span className="font-semibold">tamanho da clínica</span> nos parâmetros abaixo. Escolha o cenário conforme a maturidade operacional atual dela — Quanto mais desestruturada hoje, maior o custo/benefício com a implementação do <span className="font-semibold">Sistema Cromia Health</span>.
          </p>
        </div>

        {/* Parâmetros */}
        <div className="bg-cromia-surface border border-cromia-border rounded-sm p-8 mb-5 shadow-lg">
          <div className="text-lg font-semibold tracking-[0.15em] uppercase text-cromia-ink2 mb-6 flex items-center gap-[10px] after:content-[''] after:flex-1 after:h-[1px] after:bg-cromia-border/70">
            Tamanho da clínica
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-8">
            <div className="flex flex-col gap-[10px]">
              <div className="flex justify-between items-baseline">
                <span className="text-base text-cromia-ink2 tracking-wider">Consultas por dia</span>
                <span className="font-fraunces text-[1.8rem] font-semibold text-cromia-gold-dim">
                  {consultas} <small className="font-space-grotesk text-base text-cromia-muted font-normal">consultas</small>
                </span>
              </div>
              <input
                type="range" min="10" max="150" step="5" value={consultas}
                onChange={e => setConsultas(+e.target.value)}
                className="w-full h-[2px] bg-cromia-border appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:bg-[#b45f3b] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(200,130,10,0.35)] [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:transition-transform"
              />
            </div>
            <div className="flex flex-col gap-[10px]">
              <div className="flex justify-between items-baseline">
                <span className="text-base text-cromia-ink2 tracking-wider">Ticket médio</span>
                <span className="font-fraunces text-[1.8rem] font-semibold text-cromia-gold-dim">
                  R$ {ticket} <small className="font-space-grotesk text-base text-cromia-muted font-normal">/ consulta</small>
                </span>
              </div>
              <input
                type="range" min="100" max="300" step="10" value={ticket}
                onChange={e => setTicket(+e.target.value)}
                className="w-full h-[2px] bg-cromia-border appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:bg-[#b45f3b] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(200,130,10,0.35)] [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:transition-transform"
              />
            </div>
            <div className="flex flex-col gap-[10px]">
              <div className="flex justify-between items-baseline">
                <span className="text-base text-cromia-ink2 tracking-wider">Recepcionistas</span>
                <span className="font-fraunces text-[1.8rem] font-semibold text-cromia-gold-dim">
                  {recep} <small className="font-space-grotesk text-base text-cromia-muted font-normal">pessoas</small>
                </span>
              </div>
              <input
                type="range" min="1" max="10" value={recep}
                onChange={e => setRecep(+e.target.value)}
                className="w-full h-[2px] bg-cromia-border appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:bg-[#b45f3b] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(200,130,10,0.35)] [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:transition-transform"
              />
            </div>
            <div className="flex flex-col gap-[10px]">
              <div className="flex justify-between items-baseline">
                <span className="text-base text-cromia-ink2 tracking-wider">Salário recepção</span>
                <span className="font-fraunces text-[1.8rem] font-semibold text-cromia-gold-dim">
                  R$ {salario.toLocaleString('pt-BR')} <small className="font-space-grotesk text-base text-cromia-muted font-normal">/ mês</small>
                </span>
              </div>
              <input
                type="range" min="1200" max="4000" step="50" value={salario}
                onChange={e => setSalario(+e.target.value)}
                className="w-full h-[2px] bg-cromia-border appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:bg-[#b45f3b] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(200,130,10,0.35)] [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:transition-transform"
              />
            </div>
          </div>
        </div>

        {/* Cenários */}
        <div className="mt-15 mb-0 shadow-lg">
          <div className="text-xl font-semibold tracking-normal uppercase text-cromia-ink2 mb-5 mt-[40px] flex items-center gap-[10px] after:content-[''] after:flex-1 after:h-[1px] after:bg-cromia-border">
            Maturidade operacional atual
            <span className="text-base font-semibold tracking-wide normal-case text-cromia-ink2">— Quanto mais precária, maior o impacto da Yasmim</span>
          </div>
          <div className="flex border border-cromia-border rounded-sm overflow-hidden bg-cromia-surface shadow-lg">
            {Object.keys(scenarios).map(s => (
              <button
                key={s}
                onClick={() => setActiveScenario(s)}
                className={`flex-1 py-4 px-2 md:px-8 text-center cursor-pointer text-[15px] font-semibold tracking-wider uppercase transition-all duration-200 border-r border-cromia-border last:border-r-0 ${activeScenario === s ? 'bg-[#b45f3b] text-white' : 'bg-none text-cromia-ink'
                  }`}
              >
                <span className="block mb-1">{scenarios[s].label}</span>
                <span className="block text-sm font-normal tracking-normal lowercase opacity-100 leading-tight" dangerouslySetInnerHTML={{ __html: scenarios[s].shortDesc }} />
              </button>
            ))}
          </div>
          <div
            className="mt-0 p-[30px_30px] bg-white border border-[#b45f3b]/15 rounded-sm text-[18px] text-cromia-ink2 leading-[1.4] [&_strong]:font-black [&_strong]:text-cromia-gold-dim [&_strong]:italic-none"
            dangerouslySetInnerHTML={{ __html: scenarios[activeScenario].context }}
          />
        </div>

        {/* Base de Informações */}
        <div className="mb-20 px-8 py-10 bg-cromia-surface border border-cromia-border rounded-sm shadow-xl transition-all">
          <div className="text-base font-semibold tracking-[0.2em] uppercase text-cromia-gold mb-8 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cromia-gold animate-pulse"></span>
            Base de Cálculo e Referências
          </div>

          {/* Tag Navigation */}
          <div className="flex flex-wrap gap-0 mb-2 pb-6">
            {Object.keys(referenceData).map((key) => (
              <button
                key={key}
                onClick={() => setActiveRef(key)}
                className={`px-2.5 py-2 text-xs font-semibold tracking-normal transition-all duration-200 border ${activeRef === key
                  ? 'bg-cromia-gold text-white border-cromia-gold shadow-md'
                  : 'bg-white text-cromia-ink2 border-cromia-border hover:border-cromia-gold/50 cursor-pointer'
                  }`}
              >
                {referenceData[key].label}
              </button>
            ))}
          </div>

          {/* Active Content Area */}
          <div className="space-y-8 text-cromia-ink2 leading-relaxed text-base min-h-[300px]">
            <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <p>
                <strong className="text-cromia-gold-dim tracking-wider uppercase text-base">
                  {referenceData[activeRef].title}:
                </strong>
                <br />
                {referenceData[activeRef].base}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-2">
                {referenceData[activeRef].benchmarks.map((bench, idx) => (
                  <div key={idx} className="flex flex-col border-l-2 border-cromia-gold/30 pl-4 group hover:border-cromia-gold transition-colors">
                    <span className="text-4xl font-fraunces font-bold text-cromia-gold group-hover:scale-110 transition-transform origin-left inline-block">
                      {bench.value}
                    </span>
                    <span className="text-base leading-snug">
                      {bench.desc}
                    </span>
                  </div>
                ))}
              </div>

              {referenceData[activeRef].obs && (
                <p className="text-base italic opacity-100 border-t border-cromia-border/50 pt-6">
                  <strong className="not-italic text-cromia-gold-dim">Observação:</strong>{' '}
                  {referenceData[activeRef].obs}
                </p>
              )}
            </section>
          </div>
        </div>

        {/* Blocos de Valor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Economia */}
          <div className="rounded-sm p-7 bg-white border border-cromia-red/15 shadow-lg">
            <div className="text-lg font-semibold tracking-wider uppercase mb-[6px] text-cromia-red">O que deixa de perder</div>
            <div className="text-base text-cromia-ink2 mb-[18px] leading-[1.4]">Economia com automação do atendimento</div>
            <div className={`font-fraunces text-3xl md:text-4xl lg:text-[2.4rem] font-black leading-none mb-1 text-cromia-red transition-all duration-300 ${getPulseClass('totalEco')}`}>
              {fmt(results.totalEco)}
            </div>
            <div className="text-[18px] text-cromia-ink2 mb-[18px]">/ mês</div>
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
          <div className="rounded-sm p-7 bg-white border border-cromia-teal/15 shadow-lg">
            <div className="text-lg font-semibold tracking-wider uppercase mb-[6px] text-cromia-teal">O que passa a ganhar</div>
            <div className="text-base text-cromia-ink2 mb-[18px] leading-[1.4]">Receita nova capturando <strong>24/7</strong></div>
            <div className={`font-fraunces text-3xl md:text-4xl lg:text-[2.4rem] font-black leading-none mb-1 text-cromia-teal transition-all duration-300 ${getPulseClass('totalRec')}`}>
              {fmt(results.totalRec)}
            </div>
            <div className="text-[18px] text-cromia-ink2 mb-[18px]">/ mês</div>
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
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,#008000_50%,transparent_200%)] pointer-events-none" />
          <div className="text-base font-normal tracking-[0.2em] uppercase text-white/80 mb-[10px] relative z-10">
            Valor total gerado com a Yasmim por mês:
          </div>
          <div className={`font-fraunces text-[clamp(2.5rem,8vw,5rem)] font-black text-cromia-bg leading-none mb-2 transition-all duration-400 relative z-10 [text-shadow:0_0_80px_rgba(200,130,10,0.25)] ${getPulseClass('total')}`}>
            {fmt(results.total)}
          </div>
          <div className="text-[18px] text-white/70 tracking-wider leading-relaxed relative z-10">
            <strong className={`text-white/100 text-xl ${getPulseClass('totalAno')}`}>{fmt(results.totalAno)}</strong> por ano<br /><br />
            A Yasmim se paga em <strong className={`text-white/100 ${getPulseClass('paybackDias')}`}>{results.paybackDias} dias</strong> de operação
          </div>
        </div>

        {/* ROI / Pills */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-10 mt-10">
          <div className="bg-white border border-cromia-gold/20 rounded-sm p-[18px] text-center shadow-lg">
            <span className={`block font-fraunces text-3xl font-black text-cromia-teal mb-1 transition-all duration-300 ${getPulseClass('roi')}`}>{results.roi}%</span>
            <span className="text-[14px] text-cromia-ink2 tracking-widest uppercase">ROI sobre Mensalidade Starter* <i>(R$ 2000)</i></span>
          </div>
          <div className="bg-white border border-cromia-gold/20 rounded-sm p-[18px] text-center shadow-lg">
            <span className={`block font-fraunces text-3xl font-black text-cromia-teal mb-1 transition-all duration-300 ${getPulseClass('mult')}`}>{results.mult}x</span>
            <span className="text-[14px] text-cromia-ink2 tracking-widest uppercase">Retorno por cada R$ investido* <i>(Starter - R$ 2000)</i></span>
          </div>
          <div className="bg-white border border-cromia-gold/20 rounded-sm p-[18px] text-center shadow-lg pt-10">
            <span className={`block font-fraunces text-3xl font-black text-cromia-teal mb-1 transition-all duration-300 ${getPulseClass('consultasExtra')}`}>+ {fmtN(results.consultasExtra)}/mês</span>
            <span className="text-[14px] text-cromia-ink2 tracking-widest uppercase">Consultas novas/mês</span>
          </div>
        </div>

        {/* Pitch Argument */}
        <div className="bg-cromia-surface border border-cromia-border border-l-2 border-l-cromia-gold rounded-sm px-8 py-7 mb-10 shadow-lg">
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
