import styles from './Sobre.module.css';

const produtos = [
  {
    titulo: 'Cromia Health',
    texto: 'Um ecossistema completo para clínicas médicas que buscam excelência no atendimento. Integramos agendamentos complexos com a Yasmim, nossa Inteligência Artificial dedicada a humanizar e agilizar o contato com o paciente.',
  },
  /* {
    titulo: 'Cromia Maitre',
    texto: 'Revolucionamos a organização de bares e restaurantes. Nosso sistema automatiza o fluxo de pedidos e atendimento com uma precisão nunca vista antes, eliminando gargalos operacionais.',
  },*/
  {
    titulo: 'Cromia Stock',
    texto: 'Especialmente desenhado para lojas físicas com necessidade em atendimento por Whatsapp eficiente. Automatizamos o atendimento com acesso direto ao estoque em tempo real, acelerando o ciclo de venda e precisão do inventário.',
  },
  {
    titulo: 'Parceria Estratégica',
    texto: 'Somos desenvolvedores de ecossistemas e parceiros estratégicos empenhados em resolver gargalos. Analisamos seus processos para implementar a automação ideal para o seu crescimento.',
  },
];

export default function Sobre() {
  return (
    <section id="sobre" className={`${styles.secao_conteudo} ${styles.bg_parallax}`}>
      <div className={styles.container}>
        <h2 className={styles.titulo_secao}>• SOBRE A CROMIA •</h2>

        <div className={styles.box_branco}>
          <p className={styles.citacao}>"Transformando processos em ecossistemas inteligentes."</p>
          <p>
            A <b>Cromia</b> é uma empresa de Parceria Estratégica focada em soluções e implementações
            de automações e Inteligência Artificial em processos empresariais. Desenvolvemos
            produtos SaaS sob medida para resolver os desafios reais do seu mercado.
            <br /> <br />   <br />
          </p>

          {produtos.map((p, i) => (
            <div key={i} className={styles.destaque_texto}>
              <h4>{p.titulo}</h4>
              <p>{p.texto}</p>
            </div>
          ))}

          <p>
            Se o seu negócio precisa de mais eficiência, tecnologia e uma visão estratégica
            de futuro, nós temos o ecossistema pronto para você.
          </p>
        </div>
      </div>
    </section>
  );
}
