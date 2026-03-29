import styles from './Servicos.module.css';

const servicos = [
  {
    titulo: 'Diagnóstico e Mapeamento de Ecossistemas',
    descricao: 'Analisamos profundamente os fluxos atuais da sua empresa para identificar exatamente onde a tecnologia pode eliminar gargalos, reduzir custos operacionais e acelerar seus resultados.',
  },
  {
    titulo: 'Implementação de Inteligência Artificial',
    descricao: 'Levamos a IA para o coração do seu negócio. Integramos assistentes inteligentes (como a Yasmim) para humanizar o atendimento em larga escala e agilizar processos de agendamento e triagem.',
  },
  {
    titulo: 'Desenvolvimento de Soluções SaaS',
    descricao: 'Criamos plataformas robustas, escaláveis e intuitivas. Entregamos o ecossistema completo para a gestão da sua operação, garantindo que o software se molde ao seu negócio, e não o contrário.',
  },
  {
    titulo: 'Automação de Atendimento e Vendas',
    descricao: 'Transformamos o contato com o cliente em um fluxo automatizado e fluido. Conectamos seu atendimento a estoques e sistemas internos para garantir respostas precisas e conversões mais rápidas.',
  },
  {
    titulo: 'Parceria e Mentoria Estratégica',
    descricao: 'Não somos apenas fornecedores; somos parceiros. Oferecemos o suporte tático necessário para garantir que sua equipe extraia o máximo potencial das novas tecnologias implementadas.',
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
