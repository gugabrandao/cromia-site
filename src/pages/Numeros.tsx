import React, { useState, useMemo, useEffect } from 'react';
import MeshBackground from '../components/MeshBackground';

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
    context: '- Recepção funciona bem no horário comercial. No-show em torno de <strong>10%</strong> das consultas.</br></br>- <strong>Yasmim</strong> elimina <strong>40%</strong> disso com confirmação ativa.</br></br>- Cerca de <strong>20%</strong> das tentativas de agendamento chegam fora do expediente, e <strong>60%</strong> dessas se perdem hoje.</br></br>- A recepção gasta ~<strong>30%</strong> do tempo em tarefas repetitivas que a <strong>Yasmim</strong> absorve — esse tempo é redirecionado para acolhimento e atendimento de qualidade.</br></br>- Reencaixe de <strong>30%</strong> dos cancelamentos.</br></br>- Reativação residual de <strong>1%</strong> dos inativos por mês.',
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
    context: '- Recepção sobrecarregada, telefone frequentemente ocupado. No-show em torno de <strong>18%</strong>.</br></br>- <strong>Yasmim</strong> reduz <strong>55%</strong> disso com confirmação e reagendamento automático.</br></br>- <strong>30%</strong> das tentativas chegam fora do horário e <strong>75%</strong> dessas se perdem sem atendimento.</br></br>- A recepção gasta ~<strong>50%</strong> do tempo em triagem, agendamento e FAQ — tudo isso passa para a <strong>Yasmim</strong>, liberando a equipe para o que realmente importa.</br></br>- Reencaixe de <strong>45%</strong> dos cancelamentos.</br></br>- Reativação de <strong>2,5%</strong> da base de inativos por mês.',
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
    context: '- Sem nenhuma automação. No-show chega a <strong>28%</strong> da agenda.</br></br>- <strong>Yasmim</strong> elimina <strong>70%</strong> desse volume.</br></br>- <strong>40%</strong> das tentativas de agendamento chegam fora do expediente e <strong>90%</strong> se perdem por completo.</br></br>- A recepção gasta ~<strong>80%</strong> do tempo apenas atendendo telefone e respondendo mensagens repetitivas — a <strong>Yasmim</strong> assume esse volume inteiro, transformando a recepção num ponto de acolhimento, não de triagem.</br></br>- Reencaixe de <strong>60%</strong> dos cancelamentos.</br></br>- Reativação de <strong>5%</strong> da base inativa por mês — pacientes que nunca foram recontactados.',
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
  'eficiencia': {
    label: 'EFICIÊNCIA',
    title: 'Eficiência operacional da recepção',
    base: <>A Yasmim absorve as tarefas repetitivas da recepção — agendamento, confirmação, FAQ e cancelamento. O tempo liberado é redirecionado para acolhimento, qualidade no atendimento presencial e resolução de situações complexas. A proposta não é demitir, é <span className="font-semibold text-cromia-ink">transformar o papel da recepção</span>.</>,
    benchmarks: [
      { value: '30%', desc: 'Clínica organizada — recepção já tem processos, Yasmim otimiza o que é repetitivo' },
      { value: '50%', desc: 'Clínica média — metade do tempo da recepção era triagem e agendamento por telefone' },
      { value: '80%', desc: 'Clínica precária — recepção vivia apagando incêndio, Yasmim assume o volume inteiro' }
    ],
    obs: 'Com 3 recepcionistas e 50% do tempo liberado, são ~264h/mês redirecionadas. Isso vale mais do que qualquer corte de headcount.'
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
  const [medicos, setMedicos] = useState(8);
  const [consultaManual, setConsultaManual] = useState(false);
  const [consultas, setConsultas] = useState(40);
  const [ticket, setTicket] = useState(200);
  const [recep, setRecep] = useState(3);
  // const [salario, setSalario] = useState(1900);
  const [activeScenario, setActiveScenario] = useState('media');
  const [activeRef, setActiveRef] = useState('noshow-mercado');
  const [pulsing, setPulsing] = useState<Record<string, boolean>>({});

  const sc = scenarios[activeScenario];

  const planoRecomendado = medicos <= 5 ? 'starter' : medicos <= 15 ? 'standard' : 'pro';

  const planos = [
    { id: 'starter', label: 'Starter', preco: 2000, desc: '1–5 médicos' },
    { id: 'standard', label: 'Standard', preco: 2800, desc: '6–15 médicos' },
    { id: 'pro', label: 'Pro', preco: 3900, desc: '15+ médicos' },
  ];

  const results = useMemo(() => {
    // --- ECONOMIA ---
    const consultasMes = consultas * DIAS_MES;
    const noshowMes = consultasMes * sc.noshow_atual;
    const horasLiberadasMes = Math.round(recep * 176 * sc.recep_reducao);
    const horasLiberadasSemana = Math.round(horasLiberadasMes / 4);
    const ecoNoshow = noshowMes * sc.noshow_reducao * ticket;
    const totalEco = ecoNoshow;

    // --- RECEITA NOVA ---
    const tentativasFora = consultasMes * sc.fora_horario_vol;
    const recFora = tentativasFora * sc.fora_horario_perda * ticket;
    const recEncaixe = noshowMes * sc.encaixe_taxa * ticket;
    const recReativ = consultasMes * sc.reativ_taxa * ticket;
    const totalRec = recFora + recEncaixe + recReativ;

    // --- TOTAIS ---
    const total = totalEco + totalRec;
    const totalAno = total * 12;

    // Preço do plano para ROI e Payback dinâmicos
    const precoPlano = medicos <= 5 ? 2000 : medicos <= 15 ? 2800 : 3900;

    const paybackRaw = precoPlano / (total / DIAS_MES);
    const paybackDias = Math.ceil(paybackRaw);
    const isSubDay = paybackRaw < 1;

    const roi = Math.round((total / precoPlano - 1) * 100);
    const mult = (total / precoPlano).toFixed(1);
    const consultasExtra = Math.round((recFora + recEncaixe) / ticket);

    return {
      ecoNoshow, totalEco,
      recFora, recEncaixe, recReativ, totalRec,
      total, totalAno, paybackDias, isSubDay, roi, mult, consultasExtra,
      horasLiberadasMes, horasLiberadasSemana
    };
  }, [consultas, ticket, recep, salario, activeScenario, medicos]);

  useEffect(() => {
    const keys = Object.keys(results);
    const newPulsing: Record<string, boolean> = {};
    keys.forEach(k => { newPulsing[k] = true; });
    setPulsing(newPulsing);
    const timer = setTimeout(() => setPulsing({}), 400);
    return () => clearTimeout(timer);
  }, [results]);

  const getPulseClass = (id: string) => pulsing[id] ? 'animate-calculator-pulse' : '';

  // --- FRANKENSTEIN COST CALC (dinâmico por médicos) ---
  // Fontes: Make.com/pricing, Zapier.com/pricing, pesquisa de mercado BR saúde 2025, IBGE/CLT calculadora Contabilizei
  const recepDigital = Math.max(1, Math.ceil(medicos / 8)); // ~1 recep. digital a cada 8 médicos
  const USD_BRL = 5.80; // câmbio de referência conservador (abr/2026)
  const makeProMensal = Math.round(19 * USD_BRL);   // Make Pro: US$ 19/mês
  const zapierProMensal = Math.round(30 * USD_BRL);  // Zapier Professional: ~US$ 30/mês
  const frankRows = [
    {
      nome: 'Zenvia / TakeBlip (WhatsApp API)',
      funcao: 'Hub oficial de WhatsApp e Chat Omnichannel',
      min: 800, max: 2500,
      nota: 'Plataforma + taxas de conversação Meta. Sem tabela pública — orçamento sob demanda. Estimativa por relatos de mercado.',
    },
    {
      nome: 'Doctoralia + Feegow (mesmo grupo)',
      funcao: `Visibilidade + Prontuário — ${medicos} médico${medicos > 1 ? 's' : ''} ativos`,
      min: 300 * medicos, max: 800 * medicos,
      nota: `Feegow e Doctoralia são do mesmo grupo (Docplanner) desde 2022. A clínica paga duas licenças da mesma empresa. Sem preço público — R$ 300–800/médico/mês por relatos de gestores (Capterra/G2). Amplimed, concorrente com preço público, cobra R$ 89/médico/mês (plano Lite) — só agenda, sem IA.`,
    },
    {
      nome: 'Chatbot de IA de Prateleira',
      funcao: 'Responde FAQ — não agenda em banco de dados real',
      min: 300, max: 1500,
      nota: 'Ex.: Desler (~R$ 160/mês), Syntia, WTA3, SecretáriaIA. Prometem integração com Feegow para agendamento — sem casos de uso públicos verificados. Risco real de “burnar” a confiança do gestor na IA.',
    },
    {
      nome: `Make (Pro) ou Zapier (Professional)`,
      funcao: 'Middleware para conectar os sistemas acima',
      min: makeProMensal, max: zapierProMensal * 2,
      nota: `Make Pro: US$ 19/mês (~R$ ${makeProMensal}). Zapier Professional: ~US$ 30/mês (~R$ ${zapierProMensal}). Volume alto de operações sobe o plano. (make.com/pricing, zapier.com/pricing)`,
    },
    {
      nome: `${recepDigital} recepcionista${recepDigital > 1 ? 's' : ''} dedicada${recepDigital > 1 ? 's' : ''} ao WhatsApp`,
      funcao: 'Copiar, colar e responder manualmente 8h/dia',
      min: recepDigital * 3300, max: recepDigital * 3700,
      nota: `Custo real CLT: salário R$ 2.000 + FGTS + INSS patronal + 13º + férias + VT = R$ 3.300–3.700/funcionário (fonte: Contabilizei, Solides, 2024/2025). × ${recepDigital} pessoa${recepDigital > 1 ? 's' : ''}.`,
    },
  ];
  const frankTotalMin = frankRows.reduce((acc, r) => acc + r.min, 0);
  const frankTotalMax = frankRows.reduce((acc, r) => acc + r.max, 0);

  return (
    <>
      <MeshBackground />
      <div className="bg-transparent text-[#b45f3b] font-space-grotesk min-h-screen m-0 p-0 overflow-x-hidden pt-4">
        <div className="max-w-[860px] mx-auto px-6 py-[30px] relative">
          <a href="https://cromia.app" className="absolute top-4 right-6 transition-transform hover:scale-105 active:scale-95">
            <img src="/imgs/logo.svg" alt="Cromia Logo" className="w-40 md:w-40" />
          </a>
          {/* Header */}
          <div className="mb-12 border-b-1 border-cromia-ink/20 pb-8">
            <div className="text-base font-semibold tracking-[0.3em] uppercase text-[#b45f3b] mb-4 flex items-center gap-[10px] before:content-[''] before:w-6 before:h-[2px] before:bg-cromia-gold">
              Cromia Health
            </div>
            <h1 className="font-fraunces text-cromia-grey text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05] m-0 mb-3">
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
            {/* Agora o grid contém todos os campos necessários */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 mb-8">
              {/* Médicos — define plano e sugere consultas */}
              <div className="flex flex-col gap-[10px]">
                <div className="flex justify-between items-baseline">
                  <span className="text-base text-cromia-ink2 tracking-wider">Médicos ativos</span>
                  <span className="font-fraunces text-[1.8rem] font-semibold text-cromia-gold-dim">
                    {medicos} <small className="font-space-grotesk text-base text-cromia-muted font-normal">médicos</small>
                  </span>
                </div>
                <input
                  type="range" min="1" max="25" step="1" value={medicos}
                  onChange={e => {
                    const m = +e.target.value;
                    setMedicos(m);
                    // Sugere consultas/dia se o usuário nunca ajustou manualmente
                    if (!consultaManual) setConsultas(Math.round(m * 7));
                  }}
                  className="w-full h-[2px] bg-cromia-border appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:bg-[#b45f3b] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(200,130,10,0.35)] [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:transition-transform"
                />
                <span className="text-base text-cromia-muted italic">
                  Plano recomendado: <strong className="not-italic text-cromia-gold-dim">
                    {planoRecomendado.charAt(0).toUpperCase() + planoRecomendado.slice(1)}
                  </strong>
                </span>
              </div>

              {/* Consultas por dia — agora com flag de override manual */}
              <div className="flex flex-col gap-[10px]">
                <div className="flex justify-between items-baseline">
                  <span className="text-base text-cromia-ink2 tracking-wider">
                    Consultas por dia
                    {consultaManual && (
                      <button
                        onClick={() => { setConsultaManual(false); setConsultas(medicos * 7); }}
                        className="ml-2 text-xs text-cromia-gold underline font-normal cursor-pointer"
                      >
                        resetar sugestão
                      </button>
                    )}
                  </span>
                  <span className="font-fraunces text-[1.8rem] font-semibold text-cromia-gold-dim">
                    {consultas} <small className="font-space-grotesk text-base text-cromia-muted font-normal">consultas</small>
                  </span>
                </div>
                <input
                  type="range" min="10" max="200" step="5" value={consultas}
                  onChange={e => { setConsultaManual(true); setConsultas(+e.target.value); }}
                  className="w-full h-[2px] bg-cromia-border appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:bg-[#b45f3b] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(200,130,10,0.35)] [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:transition-transform"
                />
                {!consultaManual && (
                  <span className="text-sm text-cromia-muted italic">
                    Sugerido automaticamente (~7 /médico/dia)
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-[10px]">
                <div className="flex justify-between items-baseline">
                  <span className="text-base text-cromia-ink2 tracking-wider">Ticket médio</span>
                  <span className="font-fraunces text-[1.8rem] font-semibold text-cromia-gold-dim">
                    R$ {ticket} <small className="font-space-grotesk text-base text-cromia-muted font-normal">/ consulta</small>
                  </span>
                </div>
                <input
                  type="range" min="100" max="1000" step="50" value={ticket}
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
              {/*
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
              </div>*/}
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
            {/* Eficiência Operacional */}
            <div className="rounded-sm p-7 bg-white border border-cromia-gold-dim/15 shadow-lg">
              <div className="text-lg font-semibold tracking-wider uppercase mb-[6px] text-cromia-gold-dim">
                Ganho Operacional
              </div>
              <div className="text-base text-cromia-ink2 mb-[18px] leading-[1.4]">
                Horas liberadas da recepção por mês
              </div>
              <div className={`font-fraunces text-3xl md:text-4xl lg:text-[2.4rem] font-black leading-none mb-1 text-cromia-gold-dim transition-all duration-300 ${getPulseClass('horasLiberadasMes')}`}>
                {results.horasLiberadasMes}h
              </div>
              <div className="text-[18px] text-cromia-ink2 mb-[18px]">/ mês liberadas</div>
              <div className="flex flex-col gap-0">
                <div className="flex justify-between text-[15px] text-cromia-ink2 py-[6px] border-b border-black/5">
                  <span>Média por semana</span>
                  <strong className={getPulseClass('horasLiberadasSemana')}>~{results.horasLiberadasSemana}h</strong>
                </div>
                <div className="flex justify-between text-[15px] text-cromia-ink2 py-[6px] border-b border-black/5">
                  <span>Tarefas absorvidas pela Yasmim</span>
                  <strong className="text-cromia-gold text-right">agendamento, FAQ, confirmação</strong>
                </div>
                <div className="flex justify-between text-[15px] text-cromia-ink2 py-[6px]">
                  <span>Tempo redirecionado para</span>
                  <strong className="text-cromia-gold text-right">acolhimento e qualidade</strong>
                </div>
              </div>
            </div>

            {/* Ganho Financeiro */}
            <div className="rounded-sm p-7 bg-white border border-cromia-teal/15 shadow-lg">
              <div className="text-lg font-semibold tracking-wider uppercase mb-[6px] text-cromia-teal">Ganho Financeiro</div>
              <div className="text-base text-cromia-ink2 mb-[18px] leading-[1.4]">Receita recuperada e capturada <strong>24/7</strong></div>
              <div className={`font-fraunces text-3xl md:text-4xl lg:text-[2.4rem] font-black leading-none mb-1 text-cromia-teal transition-all duration-300 ${getPulseClass('total')}`}>
                {fmt(results.total)}
              </div>
              <div className="text-[18px] text-cromia-ink2 mb-[18px]">/ mês</div>
              <div className="flex flex-col gap-0">
                <div className="flex justify-between text-[15px] text-cromia-ink2 py-[6px] border-b border-black/5">
                  <span>Recuperação de no-show</span>
                  <strong className={getPulseClass('ecoNoshow')}>{fmt(results.ecoNoshow)}</strong>
                </div>
                <div className="flex justify-between text-[15px] text-cromia-ink2 py-[6px] border-b border-black/5">
                  <span>Agendamentos fora do horário</span>
                  <strong className={getPulseClass('recFora')}>{fmt(results.recFora)}</strong>
                </div>
                <div className="flex justify-between text-[15px] text-cromia-ink2 py-[6px] border-b border-black/5">
                  <span>Reencaixe de cancelamentos</span>
                  <strong className={getPulseClass('recEncaixe')}>{fmt(results.recEncaixe)}</strong>
                </div>
                <div className="flex justify-between text-[15px] text-cromia-ink2 py-[6px]">
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
              Valor total gerado pela Yasmim por mês:
            </div>
            <div className={`font-fraunces text-[clamp(2.5rem,8vw,5rem)] font-black text-cromia-bg leading-none mb-4 transition-all duration-400 relative z-10 [text-shadow:0_0_80px_rgba(200,130,10,0.25)] ${getPulseClass('total')}`}>
              {fmt(results.total)}
            </div>
            <div className="text-[18px] text-white/80 tracking-wider leading-relaxed -mb-2 relative z-10">
              <strong className={`font-fraunces font-semibold text-white/100 text-4xl ${getPulseClass('totalAno')}`}>{fmt(results.totalAno)}</strong> por ano<br /><br />
              A Yasmim se paga em <strong className={`text-white/100 ${getPulseClass('paybackDias')}`}>
                {results.isSubDay ? 'menos de 1 dia' : `${results.paybackDias} ${results.paybackDias === 1 ? 'dia' : 'dias'}`}
              </strong> de operação
            </div>
          </div>

          {/* ROI / Pills */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-10 mt-10">
            <div className="bg-white border border-cromia-gold/20 rounded-sm p-[18px] text-center shadow-lg flex flex-col justify-center">
              <span className={`block font-fraunces text-3xl font-black text-cromia-teal mb-1 transition-all duration-300 ${getPulseClass('roi')}`}>{results.roi}%</span>
              <span className="text-[14px] text-cromia-ink2 tracking-widest uppercase">ROI sobre mensalidade</span>
              <span className="text-[11px] text-cromia-muted mt-1 italic">plano {planos.find(p => p.id === planoRecomendado)?.label} — R$ {planos.find(p => p.id === planoRecomendado)?.preco.toLocaleString('pt-BR')}</span>
            </div>
            <div className="bg-white border border-cromia-gold/20 rounded-sm p-[18px] text-center shadow-lg flex flex-col justify-center">
              <span className={`block font-fraunces text-3xl font-black text-cromia-teal mb-1 transition-all duration-300 ${getPulseClass('mult')}`}>{results.mult}x</span>
              <span className="text-[14px] text-cromia-ink2 tracking-widest uppercase">Retorno por cada R$ investido</span>
              <span className="text-[11px] text-cromia-muted mt-1 italic">referência plano {planos.find(p => p.id === planoRecomendado)?.label}</span>
            </div>
            <div className="bg-white border border-cromia-gold/20 rounded-sm p-[18px] text-center shadow-lg flex flex-col justify-center">
              <span className={`block font-fraunces text-3xl font-black text-cromia-teal mb-1 transition-all duration-300 ${getPulseClass('consultasExtra')}`}>+ {fmtN(results.consultasExtra)}/mês</span>
              <span className="text-[14px] text-cromia-ink2 tracking-widest uppercase">Consultas novas capturadas</span>
            </div>
          </div>

          {/* Pitch Argument */}
          <div className="bg-cromia-surface border border-cromia-border border-l-10 border-l-cromia-gold rounded-sm px-8 py-16 mb-10 shadow-lg">
            <div className="font-fraunces text-[35px] font-bold tracking-normal uppercase text-cromia-gold mb-3.5">
              O fato é...
            </div>
            <p className="font-fraunces text-[1.4rem] font-light italic text-cromia-ink leading-[1.6] mb-8">
              "Com <strong className="font-semibold not-italic text-cromia-gold-dim">{consultas} consultas por dia</strong> e ticket médio de <strong className="font-semibold not-italic text-cromia-gold-dim">{fmt(ticket)}</strong>,
              a Clínica perde hoje em torno de <strong className="font-semibold not-italic text-cromia-gold-dim">{fmt(results.ecoNoshow)} por mês</strong> só com <strong className="font-semibold not-italic text-cromia-gold-dim">no-show</strong> —
              e mais <strong className="font-semibold not-italic text-cromia-gold-dim">{fmt(results.recFora)} por mês</strong> com pacientes que tentam agendar fora do horário e não encontram ninguém.
              Já a <strong className="font-semibold not-italic text-cromia-gold-dim">Yasmim</strong>, trabalha às 23h de um domingo. Sendo assim, no total, ela propõe <strong className="font-semibold not-italic text-cromia-gold-dim">{fmt(results.total)} por mês</strong> de valor real resolvendo gargalos e escoamentos da Clínica.
              O plano de parceria estratégica proposto para a estrutura apresentada é o <strong className="font-semibold not-italic text-cromia-gold-dim">{planos.find(p => p.id === planoRecomendado)?.label}</strong> que custa <strong className="font-semibold not-italic text-cromia-gold-dim">R$ {planos.find(p => p.id === planoRecomendado)?.preco.toLocaleString('pt-BR')}</strong> de mensalidade. Não chega a <strong className="font-semibold not-italic text-cromia-gold-dim">{Math.ceil((planos.find(p => p.id === planoRecomendado)!.preco / results.total) * 100)}%</strong> do ganho real que a <strong className="font-semibold not-italic text-cromia-gold-dim">Yasmim</strong> pode gerar. Logo, os outros <strong className="font-semibold not-italic text-cromia-gold-dim">{100 - Math.ceil((planos.find(p => p.id === planoRecomendado)!.preco / results.total) * 100)}%</strong> entram sorrindo no caixa da Clínica."
            </p>
            <div className="border-t border-cromia-gold/20 pt-8">
              <p className="font-fraunces text-[1.1rem] font-light text-cromia-ink2 leading-[1.7]">
                E isso sem contar que a maioria das clínicas chega a nós pagando entre{' '}
                <strong className="text-cromia-gold-dim not-italic font-bold">R$ 5.800 e R$ 9.800 por mês</strong>{' '}
                empilhando ferramentas das quais a Yasmim substitui todas de uma só vez — sem menus de "Aperte 1, 2 ou 3", sem Zapier, sem bot engessado e sem escalar custo por médico contratado.
                Um único ecossistema orgânico. Um único parceiro estratégico.
              </p>
            </div>
          </div>

          {/* Bloco: Custo do Frankenstein */}
          <div className="bg-white border border-cromia-border rounded-sm px-8 py-8 mb-5 shadow-lg">
            <div className="text-base font-semibold tracking-[0.2em] uppercase text-cromia-ink2 mb-2 flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-400"></span>
              O que a clínica paga hoje — sem a Cromia Health
            </div>
            <p className="text-sm text-cromia-muted mb-3 italic">
              Para ter algo próximo ao que a Cromia Health entrega, a clínica precisa empilhar ferramentas de múltiplos fornecedores — o chamado modelo "Frankenstein".
            </p>
            <p className="text-sm text-cromia-muted mb-6">
              Um exemplo real: a <strong className="text-cromia-ink">Doctoralia</strong> oferece o perfil de médico e agendamento online.
              Para ter prontuário eletrônico, a clínica contrata o <strong className="text-cromia-ink">Feegow</strong> — que é, literalmente, um <em>addon</em> da Doctoralia.
              Para ter IA no WhatsApp, contrata um terceiro agente que "promete integração" com o Feegow — sem casos de uso comprovados em clínicas reais.
              Para conectar tudo isso, usa Make ou Zapier. Para alguém operar o caos, contrata mais uma recepcionista.
              <strong className="text-cromia-ink"> Addon sobre addon. Custo sobre custo.</strong>
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-cromia-gold/30">
                    <th className="text-left py-3 pr-4 text-cromia-ink2 font-semibold tracking-wide text-xs uppercase">Solução no mercado</th>
                    <th className="text-left py-3 pr-4 text-cromia-ink2 font-semibold tracking-wide text-xs uppercase">Função</th>
                    <th className="text-right py-3 text-cromia-ink2 font-semibold tracking-wide text-xs uppercase">Custo estimado</th>
                  </tr>
                </thead>
                <tbody>
                  {frankRows.map((row, i) => (
                    <tr key={i} className="border-b border-cromia-border/40 hover:bg-cromia-surface transition-colors">
                      <td className="py-3 pr-4 font-semibold text-cromia-ink align-top">{row.nome}</td>
                      <td className="py-3 pr-4 text-cromia-ink2 align-top">
                        {row.funcao}
                        <div className="text-[11px] text-cromia-muted mt-0.5 italic">{row.nota}</div>
                      </td>
                      <td className="py-3 text-right text-cromia-gold-dim font-semibold whitespace-nowrap align-top">
                        {fmt(row.min)}
                        <span className="text-cromia-muted font-normal"> – </span>
                        {fmt(row.max)}
                        <div className="text-[11px] text-cromia-muted font-normal">/mês</div>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-red-50">
                    <td colSpan={2} className="py-4 pr-4 font-black text-cromia-ink text-base">CUSTO TOTAL MENSAL DO “FRANKENSTEIN”</td>
                    <td className="py-4 text-right font-black text-red-500 text-lg whitespace-nowrap">
                      {fmt(frankTotalMin)}<span className="text-red-400 font-normal"> – </span>{fmt(frankTotalMax)}
                      <div className="text-sm font-normal text-red-400">/mês</div>
                    </td>
                  </tr>
                  <tr className="bg-cromia-teal/5 border-t-2 border-cromia-teal/30">
                    <td colSpan={2} className="py-4 pr-4 font-black text-cromia-teal text-base">CROMIA HEALTH — Ecossistema Único</td>
                    <td className="py-4 text-right font-black text-cromia-teal text-lg whitespace-nowrap">
                      R$ {planos.find(p => p.id === planoRecomendado)?.preco.toLocaleString('pt-BR')}
                      <div className="text-sm font-normal text-cromia-teal/70">/mês</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="text-xs text-cromia-muted mt-5 border-t border-cromia-border/40 pt-4 space-y-2">
              <p className="italic">
                * Valores estimados com base em pesquisa de mercado (abril/2026). A licença da Cromia Health inclui WhatsApp API Oficial, IA generativa com LLM (GPT-4), CRM, agenda, automações completas, auditoria de tokens e painel administrativo White Label.
                O custo da infraestrutura de IA (OpenAI) é repassado a preço de custo, sem markup, sob auditoria direta do gestor.
              </p>
              <p className="italic">
                ** <strong className="not-italic text-cromia-ink2">Doctoralia e Feegow não publicam tabela de preços.</strong>{' '}
                Os valores da linha "Agenda SaaS" são baseados em relatos públicos de gestores de clínicas, avaliações no Capterra e G2, e cotações compartilhadas em comunidades médicas.
                Em geral, gestores de clínicas com mais de 10 médicos relatam gastos entre R$ 300–800 por profissional/mês com essas plataformas — valores que pedimos para você confirmar com um consultor deles antes de qualquer tomada de decisão.
              </p>
            </div>
          </div>

          {/* Bloco: Simples por Design */}
          <div className="border-l-4 border-cromia-gold bg-cromia-surface px-8 py-8 mb-5 rounded-r-sm shadow-lg">
            <div className="flex items-start gap-5">
              <div className="text-4xl select-none mt-1">💡</div>
              <div>
                <div className="text-base font-bold tracking-[0.2em] uppercase text-cromia-gold mb-3">
                  Simples por Design — Robusto por Dentro
                </div>
                <p className="text-[1.05rem] text-cromia-ink2 leading-[1.8] font-light">
                  Sistemas como o Feegow são extraordinariamente completos. Mas pergunte-se:{' '}
                  <strong className="text-cromia-ink font-semibold">
                    uma secretária que ganha R$ 1.800/mês vai ter tempo, disposição e suporte para aprender a operar
                    uma plataforma com dezenas de módulos, abas e submenus complexos?
                  </strong>
                </p>
                <p className="text-[1.05rem] text-cromia-ink2 leading-[1.8] font-light mt-4">
                  A Cromia Health foi projetada com a premissa oposta: a recepcionista usa no primeiro dia.
                  O fluxo de trabalho foi simplificado ao essencial — agendar, visualizar, confirmar e atender — sem sacrificar
                  nenhum passo do processo clínico. O resultado é uma adoção silenciosa, sem curva de aprendizado dolorosa
                  e sem depender de treinamentos caros que ninguém lembra no mês seguinte.
                </p>
                <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { icon: '✅', label: 'Onboarding em horas', desc: 'A equipe aprende na prática, sem manual de 80 páginas.' },
                    { icon: '✅', label: 'Interface focada no fluxo', desc: 'Sem menus escondidos. Cada ação está onde faz sentido.' },
                    { icon: '✅', label: 'IA absorve a complexidade', desc: 'A Yasmim faz o trabalho pesado. A recepção faz o acolhimento.' },
                  ].map((item, i) => (
                    <div key={i} className="bg-white rounded-sm border border-cromia-border p-4 shadow-sm">
                      <div className="text-base font-semibold text-cromia-ink mb-1">{item.icon} {item.label}</div>
                      <div className="text-sm text-cromia-ink2 font-light leading-snug">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bloco: Parceria Estratégica — Principal Predicado */}
          <div className="bg-cromia-ink text-white rounded-sm mb-5 shadow-xl relative overflow-hidden">

            {/* Gradients decorativos */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_100%,#d1602f60_0%,transparent_33%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_0%,#d1602f60_0%,transparent_66%)] pointer-events-none" />

            {/* Cabeçalho hero do bloco */}
            <div className="border-b border-white/10 px-8 pt-10 pb-8 relative z-10">
              <div className="text-lg font-bold tracking-[0.35em] uppercase text-cromia-gold/90 mb-4">
                O nosso maior predicado
              </div>
              <h2 className="font-fraunces text-5xl md:text-5xl font-black text-white leading-tight mb-4">
                Não vendemos um sistema.<br />
                <em className="font-light text-cromia-gold">Construímos uma parceria.</em>
              </h2>
              <p className="text-white/80 text-lg font-light leading-relaxed max-w-[620px]">
                Qualquer SaaS do mercado pode te vender um plano, gerar um boleto e desaparecer atrás de um formulário de suporte.
                A Cromia Health opera com uma premissa diferente: <strong className="text-white font-medium">só crescemos se você crescer.</strong>{' '}
                Isso muda completamente como tratamos cada relação, cada ajuste e cada evolução do sistema.
              </p>
            </div>

            {/* Pilares da parceria */}
            <div className="px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-white/10 relative z-10">
              <div className="space-y-5">
                <div className="w-8 h-[2px] bg-cromia-gold" />
                <div className="text-lg font-fraunces font-semibold text-white">Comprometimento com o seu resultado</div>
                <p className="text-white/80 text-base leading-relaxed font-light">
                  Antes de fechar qualquer contrato, mapeamos a operação da sua clínica, entendemos os gargalos reais
                  e só propomos uma solução se acreditarmos que ela vai funcionar para o seu contexto específico.
                  Não existe proposta genérica aqui.
                </p>
              </div>
              <div className="space-y-5">
                <div className="w-8 h-[2px] bg-cromia-gold" />
                <div className="text-lg font-fraunces font-semibold text-white">Presença além do onboarding</div>
                <p className="text-white/80 text-base leading-relaxed font-light">
                  Um SaaS tradicional te abandona depois da implantação. O suporte vira um ticket sem rosto.
                  Com a Cromia, você tem um interlocutor que conhece a sua clínica pelo nome,
                  seu histórico e seus próximos objetivos — disponível de verdade quando algo precisa evoluir.
                </p>
              </div>
              <div className="space-y-5">
                <div className="w-8 h-[2px] bg-cromia-gold" />
                <div className="text-lg font-fraunces font-semibold text-white">Evolução contínua e co-criada</div>
                <p className="text-white/80 text-base leading-relaxed font-light">
                  O sistema cresce com a clínica. Feedbacks viram funcionalidades.
                  Problemas viram prioridades de desenvolvimento — não entram numa fila de anos esperando pela
                  próxima versão de um SaaS que serve mil mercados ao mesmo tempo.
                </p>
              </div>
            </div>

            {/* Declaração de valores + customização */}
            <div className="px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-white/10 relative z-10">
              <div className="space-y-3">
                <div className="text-lg font-bold tracking-wide uppercase text-cromia-gold/70">O sistema veste a sua marca</div>
                <p className="text-white/80 text-base leading-relaxed font-light">
                  Cada clínica parceira recebe um sistema configurado com a sua identidade visual — nome, cores, logotipo.
                  Seus médicos e pacientes interagem com algo que parece construído exclusivamente para a sua instituição.
                  Porque foi. Isso não é template. É dedicação.
                </p>
              </div>
              <div className="space-y-3">
                <div className="text-lg font-bold tracking-wide uppercase text-cromia-gold/70">Transparência total de custos</div>
                <p className="text-white/80 text-base leading-relaxed font-light">
                  Ao contrário dos SaaS que ocultam os preços e empurram planos anuais no escuro,
                  na Cromia você sabe exatamente o que paga e o que recebe — incluindo o custo de IA
                  repassado sem markup direto da OpenAI, auditável centavo a centavo no painel de gestão.
                </p>
              </div>
            </div>

            {/* Rodapé: IA real + CTA */}
            <div className="px-8 py-8 relative z-10">
              <div className="text-lg font-bold tracking-wide uppercase text-cromia-gold/70 mb-3">
                Sobre a IA: entrega real, não promessa de marketing
              </div>
              <p className="text-white/80 text-base leading-relaxed font-light max-w-[680px] mb-6">
                O mercado está cheio de "agentes de IA" (Desler, Syntia, WTA3) que prometem agendamento inteligente
                e entregam um chatbot de FAQ com menu numerado revestido de marketing. Isso{' '}
                <strong className="text-white font-medium">queima a confiança do gestor</strong>{' '}
                antes que ele experimente algo de verdade.
                A Yasmim agenda em uma agenda real, altera em um banco de dados real, responde áudios e
                mantém contexto de conversa. Não pedimos fé — pedimos 30 minutos de demonstração ao vivo.
              </p>
            </div>
          </div>

          {/* Planos */}
          <div className="bg-cromia-surface2 border border-cromia-border rounded-sm px-8 py-7 mb-5 shadow-lg">
            <div className="text-base font-semibold tracking-widest uppercase text-cromia-ink2 mb-6 flex items-center gap-[10px] after:content-[''] after:flex-1 after:h-[1px] after:bg-cromia-border">
              Planos de Implementação - Proporcionais ao tamanho da Clínica
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {planos.map(({ id, label, preco, desc }) => {
                const isRecomendado = id === planoRecomendado;
                return (
                  <div
                    key={id}
                    className={`border rounded-sm p-5 bg-cromia-surface text-center transition-all duration-300 relative
          ${isRecomendado
                        ? 'border-[#b45f3b] shadow-[0_0_0_2px_rgba(180,95,59,0.25)] scale-[1.03]'
                        : 'border-cromia-border opacity-70'
                      }`}
                  >
                    {isRecomendado && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#b45f3b] text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full whitespace-nowrap">
                        Recomendado
                      </div>
                    )}
                    <div className="text-base font-semibold tracking-widest uppercase text-cromia-muted mb-2">{label}</div>
                    <div className="font-fraunces text-[1.8rem] font-black text-cromia-ink mb-1">R$ {preco.toLocaleString('pt-BR')}</div>
                    <div className="text-[17px] text-cromia-ink2 mb-3.5">{desc}</div>
                    <span className={`text-sm px-2.5 py-1 rounded-full font-semibold inline-block transition-all duration-300 ${getPulseClass('total')} ${isRecomendado
                      ? 'bg-cromia-teal-light text-cromia-teal'
                      : 'bg-cromia-border/40 text-cromia-muted'
                      }`}>
                      {isRecomendado
                        ? `Se paga em ${results.paybackDias <= 1 ? 'menos de 1 dia' : `menos de ${results.paybackDias} dias`} de operação`
                        : 'não aplicável para este porte'
                      }
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-12 text-cromia-muted text-sm tracking-widest border-t border-cromia-border">
          DESENVOLVIDO PELA <a href="https://cromia.app" className="font-semibold hover:text-cromia-gold transition-colors underline decoration-cromia-border underline-offset-4">CROMIA</a> - {new Date().getFullYear()}
        </div>
      </div>
    </>
  );
};

export default Numeros;
