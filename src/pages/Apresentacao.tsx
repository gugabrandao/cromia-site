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
    context: '- Recepção funciona bem no horário comercial. No-show em torno de <strong>10%</strong> das consultas.</br></br>- <strong>Yasmim</strong> elimina <strong>40%</strong> disso com confirmação ativa.</br></br> - Cerca de <strong>20%</strong> das tentativas de agendamento chegam fora do expediente, e <strong>60%</strong> dessas se perdem hoje.</br></br> - A recepção gasta ~<strong>30%</strong> do tempo em tarefas repetitivas que a <strong>Yasmim</strong> absorve — esse tempo é redirecionado para acolhimento e atendimento de qualidade.</br></br> - Reencaixe de <strong>30%</strong> dos cancelamentos.</br></br> - Reativação residual de <strong>1%</strong> dos inativos por mês.',
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
    <div className="w-full md:w-[100%] bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-xl -mt-12 p-6 md:p-11">
      <div className="text-lg lg:text-[24px] font-bold tracking-widest uppercase text-cromia-gold mb-6 opacity-80">Item {number}</div>
      <h2 className="font-fraunces text-2xl md:text-4xl font-black text-[#3a3a3a] mb-6 leading-[1.1]">
        {title}
      </h2>
      <div className="text-base md:text-[18px] text-cromia-ink2 leading-[1.5] md:leading-[1.8] font-light opacity-90">
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

const Apresentacao = () => {
  // --- Estados do Lightbox (CromiaHealth) ---
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

  // --- Estados e lógica de Cálculos (Numeros) ---
  const [medicos, setMedicos] = useState(8);
  const [consultaManual, setConsultaManual] = useState(false);
  const [consultas, setConsultas] = useState(40);
  const [ticket, setTicket] = useState(200);
  const [recep, setRecep] = useState(3);
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
  }, [consultas, ticket, recep, activeScenario, medicos]);

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
    <>
      <MeshBackground />
      <div className="bg-cromia-gold/5 text-[#b45f3b] font-space-grotesk min-h-screen m-0 p-0 overflow-x-hidden pt-4">
        <div className="w-full max-w-[860px] mx-auto px-4 lg:px-0 relative">

          {/* Logo */}
          <a href="https://cromia.app" className="flex justify-center mb-8">
            <img src="/imgs/logo.svg" alt="Cromia Logo" className="w-50 md:w-80 lg:w-100 -mt-2 mb-1 md:mb-4 md:mt-0" />
          </a>

          {/* ======================= CONTEÚDO DO NUMEROS.TSX ======================= */}
          <div className="w-full mb-20">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 mb-8">
                {/* Médicos */}
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

                {/* Consultas por dia */}
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

            {/* Pitch Argument */}
            <div className="bg-cromia-surface border border-cromia-border border-l-10 border-l-cromia-gold rounded-sm px-8 py-16 mb-10 shadow-lg mt-10">
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
          </div>
        </div>

        {/* ======================= CONTEÚDO DO CROMIAHEALTH.TSX ======================= */}

        {/* Hero Section - Apresentação */}
        <div className="mb-30 lg:p-14 p-6 text-left w-full max-w-[860px] h-[800px] mx-auto bg-white/80 backdrop-blur-sm border border-cromia-border/40 rounded-xs shadow-lg relative overflow-x-hidden overflow-y-auto scrollbar">
          <h2 className="font-fraunces text-5xl tracking-tight font-semibold text-cromia-gold-dark">Ecossistema que
            <em className="italic font-bold text-cromia-ink2 text-[40px] lg:text-5xl"> muda o jogo</em>
          </h2>
          <div className="mt-10 lg:mt-20 h-[1px] w-[740px] bg-cromia-gold/80 mx-auto" />
          <p className="text-base lg:text-xl text-cromia-ink2 leading-[1.7] font-light mt-10 lg:mt-20">
            <span className="font-semibold">Cromia Health</span> é um Ecossistema desenvolvido meticulosamente para o uso com as mais modernas <span className="font-semibold">ferramentas de automação</span> e com a nossa agente de <span className="font-semibold">IA</span> com atendimento extremamente humanizado, capaz de fazer multiplos agendamentos ao mesmo tempo, sem filas, sem qualquer necessidade de intervenção humana e o detalhe mais importante: com uma <span className="font-semibold">escala de 24/7</span>, sem nunca mais perder clientes fora do horário comercial.<br /><br />
            Chamamos carinhosamente de <span className="font-semibold italic">Yasmim</span>, mas você pode dar o nome que lhes for mais agradável. Uma especialista na gestão da sua Clínica, ela é treinada pra saber tudo sobre as particularidades do seu negócio. Realiza agendamentos, confirmações, reagendamentos, cancelamentos e muito mais de forma nativa, sem qualquer <span className="font-semibold">gambiarra</span> de integração com Sistemas de terceiros. Responde as <span className="font-semibold">"Perguntas Mais Frequentes"</span> dos pacientes, que hoje são respondidas exaustivamente pela recepção ou pior: deixam de ser respondidas, gerando perda de receita.<br /><br />
            O <span className="font-semibold">Portal Administrativo</span>, muito mais que um <span className="italic">Sistema de Agendamento</span>, é um Painel inteligente projetado para Clínicas que buscam eficiência e crescimento em escala com as ferramentas mais modernas do Mercado e está em constante evolução, com atualizações frequentes para performar ainda melhor a cada dia.<br /><br />
            Diferente de Sistemas que possuem a Interface complexa, com ferramentas e funcionalidades em excesso, o <span className="font-semibold">Cromia Health</span> é focado na experiência do usuário, com uma interface extremamente intuitiva e agradável de usar. Permitindo que sua secretária ou recepcionista esteja apta a usar o sistema em minutos, sem a batalha inglória com esses Sistemas que se colocam como "simples", mas que são extremamente desconfortáveis de usar.<br /><br />
            Uma infraestrutura robusta e moderna, com o que há de mais avançado em tecnologia para garantir performance e segurança mas com uma usabilidade simples e objetiva - O melhor dos dois mundos.<br /><br />
            E para complementar esse <span className="font-semibold">Ecossistema</span>, várias automações são implementadas para uma melhor experiência dos envolvidos e gerenciamento por parte dos administradores, sem qualquer necessidade de programação e envolvimento humano:<br /><br />
            • Envio diário direcionado aos Gestores da Clínica com os números do dia: Faturamento Bruto (simples e direto), número de agendamentos/cancelamentos e o aproveitamento, especialidades mais procuradas, médicos mais agendados, planos de saúde mais usados, relatórios que permitem uma melhor administração de recursos e planejamentos estratégicos do dia-a-dia.<br /><br />
            • Envio diário das Agendas do Dia Seguinte direcionada ao Corpo Clínico com informações relevantes.<br /><br />
            • Envio de lembretes de consultas para os pacientes (no dia anterior e 2 horas antes da consulta), imprescindíveis para reduzir o índice de <span className="font-semibold">No-Show</span>. Dependendo da agenda, podendo ser programado pra enviar com até 7 dias de antecedência, para agendas mais espaçadas.<br /><br />
            • Envio de mensagens de <span className="font-semibold">Follow-up</span> para esquentar relacionamentos com pacientes inativos, como por exemplo, mensagens de aniversário, mensagens de feliz natal, mensagens de feliz páscoa, etc de forma automatizada, sem tomar o tempo precioso das secretárias. Essas mensagens embora pareçam bobagens, geram conexão e humanização, resultando em um impacto financeiro significativo, trabalhando de mãos dadas com a área de Marketing da sua Clínica. Eles agradecerão!<br /><br />
            • O acesso ao Painel é na Nuvem e pode ser logado em qualquer computador com acesso à Internet, inclusive de dispositivos móveis, trazendo flexibilidade e mobilidade para a gestão da Clínica. Você não precisa estar preso aos computadores da rede da Clínica.<br /><br />
            Aqui é uma breve apresentação do que o <span className="font-semibold">Cromia Health</span> é capaz de oferecer, suas funcionalidades e como ele pode transform a gestão da sua Clínica e o impacto financeiro que ele pode gerar.
          </p>
        </div>

        {/* Jornada por Capítulos */}
        <div className="flex flex-col items-center space-y-12 max-w-[860px] mx-auto">
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
                Gerencie as datas especiais, recessos e feriados com um clique. Ao inserir uma data especial no Painel Administrativo ou algum recesso específico da Clínica ou mesmo em algum expediente atípico como uma quarta-feira de cinzas com o meio expediente à partir de 12h ou como um feriadão prolongado e recessos, a <strong>Yasmim</strong>, automatically, para de oferecer horários e começa a gerenciar as expectativas dos pacientes para os dias úteis seguintes. Você tem o controle absoluto de quando a Clínica opera, sem precisar lutar contra a agenda e os Sistemas engessados do Mercado.
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

          {/* whatsapp item 10 */}
          <div className="w-full max-w-[860px] bg-cromia-ink text-white rounded-2xl p-6 md:p-15 mb-10 relative overflow-hidden !shadow-xl mx-auto">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_50%,#30df4de3_10%,transparent_120%)] pointer-events-none z-0" />
            <svg className="absolute top-1/2 left-10/12 -translate-y-1/2 -translate-x-1/2 w-[850px] h-[850px] text-white opacity-5 pointer-events-none z-0 -rotate-12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <div className="text-lg md:text-[24px] font-bold tracking-[0.3em] uppercase text-white mb-4">ITEM 10</div>
                <h2 className="font-fraunces text-3xl md:text-4xl font-black mb-6">Whatsapp API Oficial & Chat/CRM: Comunicação Segura</h2>
                <p className="text-base md:text-lg text-white/100 leading-[1.8] font-light italic">
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

        </div>

        {/* CTA Reunião */}
        <div className="w-full max-w-[860px] mx-auto bg-cromia-ink text-white rounded-2xl p-10 md:p-14 mb-16 relative overflow-hidden !shadow-2xl text-center border border-white/5">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,#30df4de3_50%,transparent_100%)] pointer-events-none z-0 opacity-40" />
          <svg className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[800px] h-[800px] text-white opacity-5 pointer-events-none z-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="font-fraunces text-3xl md:text-4xl text-white font-black mb-8 [text-shadow:0_4px_12px_rgba(0,0,0,0.1)]">
              Não espere mais para transformar a gestão da sua clínica.
            </h2>
            <a
              href="https://wa.me/5521994679907?text=Oi%2C%20Cromia%21%20Estou%20entrando%20em%20contato%20atrav%C3%A9s%20do%20Site."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white !text-cromia-ink hover:bg-cromia-surface font-bold tracking-widest uppercase py-4 px-8 md:px-10 rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(255,255,255,0.2)] text-sm md:text-base cursor-pointer"
            >
              Marcar uma Reunião
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-12 text-cromia-muted text-sm tracking-widest border-t border-cromia-border">
          DESENVOLVIDO PELA <a href="https://cromia.app" className="font-semibold hover:text-cromia-gold transition-colors underline decoration-cromia-border underline-offset-4">CROMIA</a> - {new Date().getFullYear()}
        </div>
      </div>

      {lightboxData && (
        <ImageLightbox images={lightboxData.images} initialIndex={lightboxData.index} onClose={() => setLightboxData(null)} />
      )
      }
    </>
  );
};

export default Apresentacao;
