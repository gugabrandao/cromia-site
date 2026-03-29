import { Link } from 'react-router-dom';
import MeshBackground from '../components/MeshBackground';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './LegalPage.module.css';

export default function PoliticaPrivacidade() {
  const year = new Date().getFullYear();

  return (
    <>
      <MeshBackground />
      <Header />
      <main>
        <section className={`${styles.secao_conteudo} ${styles.bg_parallax}`}>
          <div className={styles.container}>
            <h2 className={styles.titulo_secao}>Política de Privacidade</h2>

            <div className={styles.box_branco}>
              <p><strong>Última atualização: {year}</strong></p>

              <h3>1. Introdução</h3>
              <p>
                A sua privacidade é importante para nós. É política da <strong>Cromia — Marketing e Negócios</strong> respeitar
                a sua privacidade em relação a qualquer informação sua que possamos coletar no site{' '}
                <a href="https://www.cromiamkt.com.br" target="_blank" rel="noopener noreferrer">Cromia</a>.
              </p>

              <h3>2. Coleta de Dados</h3>
              <p>
                Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço
                (como entrar em contato via WhatsApp ou e-mail). Fazemo-lo por meios justos e legais, com o seu
                conhecimento e consentimento.
              </p>

              <h3>3. Uso das Informações</h3>
              <p>
                Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado.
                Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis para evitar perdas
                e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.
              </p>

              <h3>4. Compartilhamento de Dados</h3>
              <p>
                Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto
                quando exigido por lei.
              </p>

              <h3>5. Links Externos</h3>
              <p>
                O nosso site pode ter links para sites externos (como WhatsApp, LinkedIn e Instagram) que não são
                operados por nós. Esteja ciente de que não temos controle sobre o conteúdo e práticas desses sites
                e não podemos aceitar responsabilidade por suas respectivas políticas de privacidade.
              </p>

              <h3>6. Seus Direitos (LGPD)</h3>
              <p>
                Você é livre para recusar a nossa solicitação de informações pessoais, entendendo que talvez não
                possamos fornecer alguns dos serviços desejados. Se você tiver alguma dúvida sobre como lidamos com
                dados do usuário e informações pessoais, entre em contato conosco.
              </p>

              <h3>7. Contato</h3>
              <p>
                Para exercer seus direitos de titular de dados ou esclarecer dúvidas, entre em contato pelo e-mail:{' '}
                <strong>cromia.contato@gmail.com</strong>.
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
