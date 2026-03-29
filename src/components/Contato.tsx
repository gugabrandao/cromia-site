import styles from './Contato.module.css';

const WA_LINK = "https://wa.me/5521994679907?text=Oi%2C%20Carol!%20Tudo%20bem%3F%20Estou%20entrando%20em%20contato%20com%20voc%C3%AA%20atrav%C3%A9s%20do%20site.";

export default function Contato() {
  return (
    <section id="contato" className={`${styles.secao_conteudo} ${styles.bg_parallax}`}>
      <div className={styles.container}>
        <h2 className={styles.titulo_secao}>• CONTATO •</h2>

        <div className={`${styles.box_branco} ${styles.box_center}`}>
          <p className={styles.dados_contato}>
            <strong>Celular / Whatsapp:</strong><br />
            (21) 99467-9907
          </p>
          <p className={styles.dados_contato}>
            <strong>Email:</strong><br />
            <a href="mailto:cromia.contato@gmail.com" target="_blank" rel="noopener noreferrer">
              cromia.contato@gmail.com
            </a>
          </p>

          <br />
          <p className={styles.midia_titulo}>Acompanhe nossas mídias:</p>

          <div className={styles.social_container}>
            {/* Instagram */}
            <a href="https://www.instagram.com/cromia.mkt" target="_blank" rel="noopener noreferrer"
              className={`${styles.btn_social} ${styles.instagram}`} aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="#ffffff" d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M18,5A1,1 0 0,1 19,6A1,1 0 0,1 18,7A1,1 0 0,1 17,6A1,1 0 0,1 18,5Z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a href="https://www.linkedin.com/in/rodriguescarolina/" target="_blank" rel="noopener noreferrer"
              className={`${styles.btn_social} ${styles.linkedin}`} aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path fill="#fff" d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.28c12.4-23.47 42.69-48.28 87.88-48.28 93.98 0 111.28 61.9 111.28 142.3V448z" />
              </svg>
            </a>

            {/* WhatsApp */}
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
              className={`${styles.btn_social} ${styles.whatsapp}`} aria-label="WhatsApp">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path fill="#fff" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-26.5l-6.7-4-69.8 18.3 18.6-68.1-4.4-6.9c-18.6-29.5-28.4-63.4-28.4-98.5 0-101.9 82.8-184.6 184.6-184.6 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-4-10.5-6.8z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
