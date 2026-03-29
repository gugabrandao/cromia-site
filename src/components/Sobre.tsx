import styles from './Sobre.module.css';

const principios = [
  {
    titulo: null,
    texto: 'Acredito que o marketing deve servir aos objetivos, e não o contrário. Por isso, conduzo cada projeto baseada em princípios inegociáveis:',
  },
  {
    titulo: 'A Regra do Maestro:',
    texto: 'Agências e freelances são ferramentas, mas o sucesso depende da sua capacidade de saber o que pedir. Instruo empresários e profissionais a assumirem o comando estratégico, parando de girar a roda em falso.',
  },
  {
    titulo: 'Fundamento sobre Fórmula (O Método):',
    titulo_italic: true,
    texto: 'Marketing não salva empresa desorganizada, mas também não se resolve com "fórmulas de bolo". Distancio-me de promessas de atalhos ou resultados previsíveis em contextos diferentes. Instruo a construção de um caminho estruturado e adaptável à sua realidade. Visibilidade sem fundamento é apenas custo.',
  },
  {
    titulo: 'Lucro com Integridade:',
    texto: 'Existem formas de enriquecer que empobrecem a sua mente e a sociedade. Direciono a construção de resultados reais e sustentáveis, fugindo de táticas agressivas que sacrificam a sua paz ou a sua reputação.',
  },
  {
    titulo: 'Evolução de Carreira:',
    texto: 'Mentoro profissionais na transição para o pensamento estratégico, ensinando a enxergar as alavancas que a maioria ignora. Aqui a conta fecha: as empresas encontram a maturidade que buscam, e você conquista a valorização que merece.',
  },
  {
    titulo: 'A Harmonia das 3 Camadas:',
    texto: 'Nada funciona isolado. Conecto o seu Porquê (estratégia), o seu Quê (comunicação) e o seu Como (tática). Se essas três partes não conversam, qualquer plano perde a força.',
  },
];

export default function Sobre() {
  return (
    <section id="sobre" className={`${styles.secao_conteudo} ${styles.bg_parallax}`}>
      <div className={styles.container}>
        <h2 className={styles.titulo_secao}>• SOBRE •</h2>

        <div className={styles.box_branco}>
          <img src="/imgs/foto_carol.jpeg" className={styles.foto_perfil} alt="Carol Rodrigues" />
          <p className={styles.citacao}>"Estratégia, clareza e o fim do marketing por improviso."</p>
          <p>Olá, eu sou a <b>Carol Rodrigues</b>.</p>
          <p>
            Minha trajetória no Marketing soma 20 anos — tempo que transformei em repertório para
            garantir que negócios e profissionais não percam espaço por falta de estratégia. Como
            consultora, Fractional CMO e mentora, direciono a sua marca ou a sua carreira para que
            deixem de ser "apenas mais um perfil" e se tornem referências sólidas, lucrativas e
            com rota definida.
          </p>

          {principios.map((p, i) => (
            <div key={i} className={styles.destaque_texto}>
              {p.titulo && (
                <h4>{p.titulo_italic ? <i>{p.titulo}</i> : p.titulo}</h4>
              )}
              <p>{p.texto}</p>
            </div>
          ))}

          <p>
            Se você busca uma parceira estratégica para instruir e conduzir o crescimento do seu
            negócio ou da sua carreira com maturidade, vamos conversar.
          </p>
        </div>
      </div>
    </section>
  );
}
