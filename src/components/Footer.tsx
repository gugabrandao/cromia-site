import styles from './Footer.module.css';
import { useModal } from '../context/ModalContext';

export default function Footer() {
  const year = new Date().getFullYear();
  const { openModal } = useModal();

  return (
    <footer>
      <div className={styles.footer_bg} id="footer_bg">
        Desenvolvido pela <b>Cromia</b> - Todos os Direitos Reservados ® - {year}
        <br className={styles.mobile_break} />
        &nbsp;|&nbsp;
        <span className={styles.link_modal} onClick={() => openModal('privacy')}>Política de Privacidade</span>
        &nbsp;|&nbsp;
        <span className={styles.link_modal} onClick={() => openModal('terms')}>Termos de Uso</span>
      </div>
    </footer>
  );
}
