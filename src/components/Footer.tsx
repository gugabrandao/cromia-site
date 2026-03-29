import styles from './Footer.module.css';
import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className={styles.footer_bg} id="footer_bg">
        Desenvolvido pela <b>Cromia</b> - Todos os Direitos Reservados ® - {year}
        <br className={styles.mobile_break} />
        &nbsp;|&nbsp;
        <Link to="/politica-de-privacidade">Política de Privacidade</Link>
        &nbsp;|&nbsp;
        <Link to="/termos-de-uso">Termos de Uso</Link>
      </div>
    </footer>
  );
}
