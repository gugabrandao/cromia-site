import styles from './Hero.module.css';

export default function Hero() {
  return (
    <div id="home" className={styles.home}>
      <div className={styles.capa_home}>
        <div className={styles.logo_cromia} id="logo_cromia">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 120" width="100%" height="100%">
            <defs>
              <style>{`
                .nude-org-stroke-c1 { stroke: #D29B8C; fill: none; stroke-width: 9; stroke-linecap: butt; }
                .amber-tech-fill-c2 { stroke: #B45F3B; fill: none; stroke-width: 9; stroke-linecap: butt; }
                .deep-brown-fill { fill: #4A2C2A; }
                .amber-tech-fill { fill: #B45F3B; }
                .grey-fill { fill: #3A3A3A; }
                .grey-stroke { stroke: #3A3A3A; fill: none; stroke-width: 7.5; }
                .cromia-text {
                  font-family: 'Montserrat', system-ui, sans-serif;
                  font-size: 52px;
                  letter-spacing: 0px;
                  font-weight: 700;
                }
                .parallax-c1 { animation: float-c1 3s ease-in-out infinite alternate; transform-origin: 60px 60px; }
                .parallax-c2 { animation: float-c2 3s ease-in-out infinite alternate; transform-origin: 60px 60px; }
                .parallax-letras { animation: float-letras 6s ease-in-out infinite alternate; }
                .parallax-bola-marrom { animation: float-bola-marrom 3s ease-in-out infinite alternate; transform-origin: 52px 60px; }
                .parallax-bola-laranja { animation: float-bola-laranja 3s ease-in-out infinite alternate; transform-origin: 218px 59.5px; }

                @keyframes float-c1 { 0% { transform: scale(1) translate(0px, 0px); } 100% { transform: scale(1.05) translate(2px, 0px); } }
                @keyframes float-c2 { 0% { transform: scale(1) translate(0px, 0px); } 100% { transform: scale(1.05) translate(2px, 0px); } }
                @keyframes float-letras { 0% { transform: scale(1) translate(0px, 0px); } 100% { transform: scale(1.05) translate(-10.5px, -3px); } }
                @keyframes float-bola-marrom { 0% { transform: scale(1) translate(0px, 0px); } 100% { transform: scale(1.25) translate(0px, 0px); } }
                @keyframes float-bola-laranja { 0% { transform: scale(1) translate(0px, 0px); } 100% { transform: scale(2) translate(0px, 0px); } }
              `}</style>
            </defs>

            <g id="simbolo-cromia" transform="translate(30, 0)">
              <g className="parallax-c1 nude-org-stroke-c1">
                <path d="M 56 20.2 A 40 40 0 0 0 56 99.8" />
                <path d="M 64 20.2 A 40 40 0 0 1 88.3 31.7" />
                <path d="M 64 99.8 A 40 40 0 0 0 88.3 88.3" />
              </g>
              <g className="parallax-c2 amber-tech-fill-c2">
                <path d="M 75 43.9 A 22 22 0 1 0 75 76.1" />
              </g>
              <g className="parallax-bola-marrom">
                <circle cx="60" cy="60" r="9" className="deep-brown-fill" />
              </g>
            </g>

            <g className="parallax-letras">
              <text x="120" y="78" className="cromia-text grey-fill">CR</text>
              <circle cx="218" cy="59.5" r="15" className="grey-stroke" />
              <text x="239" y="78" className="cromia-text grey-fill">MIA</text>
            </g>

            <g className="parallax-bola-laranja">
              <circle cx="218" cy="59.5" r="6" className="amber-tech-fill" />
            </g>
          </svg>
        </div>

        <ul className={styles.legenda} id="legenda">
          <li>Desenvolvimento</li>
          <li className={styles.divisor2}></li>
          <li>Marketing <br className={styles.quebra_mobile} />Estratégico</li>
          <li className={styles.divisor2}></li>
          <li>Tecnologia</li>
        </ul>
      </div>
    </div>
  );
}
