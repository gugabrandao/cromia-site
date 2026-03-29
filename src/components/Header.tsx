import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.menu_bg}>
      <a href="#home">
        <img src="/imgs/logo.svg" alt="Logo Cromia" className={styles.logo} id="logo" />
      </a>
      <nav className={styles.menu}>
        <ul className={styles.nav}>
          <li><a href="#home">HOME</a></li>
          <li className={styles.divisor}>|</li>
          <li><a href="#sobre">SOBRE</a></li>
          <li className={styles.divisor}>|</li>
          <li><a href="#servicos">SERVIÇOS</a></li>
          <li className={styles.divisor}>|</li>
          <li><a href="#contato">CONTATO</a></li>
        </ul>
      </nav>
    </header>
  );
}
