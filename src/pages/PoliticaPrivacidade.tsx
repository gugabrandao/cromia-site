import { Link } from 'react-router-dom';
import MeshBackground from '../components/MeshBackground';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './LegalPage.module.css';
import { PoliticaPrivacidadeContent } from '../components/LegalContent';

export default function PoliticaPrivacidade() {
  return (
    <>
      <MeshBackground />
      <Header />
      <main>
        <section className={`${styles.secao_conteudo} ${styles.bg_parallax}`}>
          <div className={styles.container}>
            <h2 className={styles.titulo_secao}>Política de Privacidade</h2>

            <div className={styles.box_branco}>
              <PoliticaPrivacidadeContent />

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
