import { Link } from 'react-router-dom';
import MeshBackground from '../components/MeshBackground';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './LegalPage.module.css';
import { TermosDeUsoContent } from '../components/LegalContent';

export default function TermosDeUso() {
  return (
    <>
      <MeshBackground />
      <Header />
      <main>
        <section className={`${styles.secao_conteudo} ${styles.bg_parallax}`}>
          <div className={styles.container}>
            <h2 className={styles.titulo_secao}>Termos de Uso</h2>

            <div className={styles.box_branco}>
              <TermosDeUsoContent />

              <div className={styles.voltar}>
                <Link to="/">← Voltar ao site</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
