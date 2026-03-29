import { Link } from 'react-router-dom';
import MeshBackground from '../components/MeshBackground';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './LegalPage.module.css';

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
              <h3>1. Termos</h3>
              <p>
                Ao acessar o site <a href="https://www.cromia.app" target="_blank" rel="noopener noreferrer">Cromia</a>,
                você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis e
                concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis. Se você não
                concordar com algum desses termos, está proibido de usar ou acessar este site.
              </p>

              <h3>2. Uso de Licença</h3>
              <p>
                É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software)
                no site Cromia, apenas para visualização transitória pessoal e não comercial. Esta é a concessão de
                uma licença, não uma transferência de título e, sob esta licença, você não pode:
              </p>
              <ul>
                <li>Modificar ou copiar os materiais;</li>
                <li>Usar os materiais para qualquer finalidade comercial ou para exibição pública (comercial ou não comercial);</li>
                <li>Tentar descompilar ou fazer engenharia reversa de qualquer software contido no site;</li>
                <li>Remover quaisquer direitos autorais ou outras notações de propriedade dos materiais.</li>
              </ul>

              <h3>3. Isenção de Responsabilidade</h3>
              <p>
                Os materiais no site da Cromia são fornecidos "como estão". A Cromia não oferece garantias,
                expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo,
                sem limitação, garantias implícitas ou condições de comercialização, adequação a um fim específico
                ou não violação de propriedade intelectual.
              </p>

              <h3>4. Limitações</h3>
              <p>
                Em nenhum caso a Cromia ou seus fornecedores serão responsáveis por quaisquer danos (incluindo,
                sem limitação, danos por perda de dados ou lucro ou devido a interrupção dos negócios) decorrentes
                do uso ou da incapacidade de usar os materiais no site.
              </p>

              <h3>5. Precisão dos Materiais</h3>
              <p>
                Os materiais exibidos no site da Cromia podem incluir erros técnicos, tipográficos ou fotográficos.
                A Cromia não garante que qualquer material em seu site seja preciso, completo ou atual.
              </p>

              <h3>6. Lei Aplicável</h3>
              <p>
                Estes termos e condições são regidos e interpretados de acordo com as leis do Brasil e você se
                submete irrevogavelmente à jurisdição exclusiva dos tribunais nesse estado ou localidade.
              </p>

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
