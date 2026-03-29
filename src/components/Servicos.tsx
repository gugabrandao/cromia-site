import styles from './Servicos.module.css';

const servicos = [
  {
    titulo: 'Instrução Estratégica: Raio-X de Marketing',
    descricao: 'Um diagnóstico profundo para mapear a real maturidade do seu marketing. Analiso processos, estruturas de equipe e fluxos de trabalho para identificar exatamente o que trava o seu crescimento. Você recebe a clareza necessária para "organizar a casa".',
  },
  {
    titulo: 'Direcionamento Estratégico de Marketing',
    descricao: 'Desenvolvimento de soluções sob medida para os desafios táticos e de comunicação do seu negócio. Atuo diretamente no desenho do posicionamento de mercado, inteligência de canais e estruturação de processos. Foco na construção de resultados sustentáveis.',
  },
  {
    titulo: 'Liderança Estratégica Fracionada (PMO)',
    descricao: 'Tenha uma líder de marketing sênior no seu time sem o custo fixo de um executivo em tempo integral. Atuo como sua gerente de marketing não exclusiva, integrando-me à rotina da empresa para assumir a governança técnica e elevar o nível de maturidade da equipe.',
  },
  {
    titulo: 'Mentoria Estratégica (Coletiva)',
    descricao: 'Um programa de desenvolvimento profissional desenhado para quem está começando ou deseja migrar da execução operacional para o pensamento estratégico. Ensino as alavancas que a maioria ignora para você conquistar valorização.',
  },
  {
    titulo: 'Instrução em Automação e Processos',
    descricao: 'Tecnologia a serviço da agilidade. Implemento soluções de IA, chatbots e fluxos automatizados para eliminar gargalos manuais e qualificar leads. Transformo processos que hoje "estão na cabeça das pessoas" em sistemas inteligentes.',
  },
];

export default function Servicos() {
  return (
    <section id="servicos" className={`${styles.secao_conteudo} ${styles.bg_parallax}`}>
      <div className={styles.container}>
        <h2 className={styles.titulo_secao}>• SERVIÇOS •</h2>

        <div className={styles.box_branco}>
          {servicos.map((s, i) => (
            <div key={i} className={styles.servico_item}>
              <h3>{s.titulo}</h3>
              <p>{s.descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
