import styles from './MeshBackground.module.css';

export default function MeshBackground() {
  return (
    <div className={styles.cromia_mesh_bg}>
      <div className={`${styles.blob} ${styles.nude1}`}></div>
      <div className={`${styles.blob} ${styles.amber}`}></div>
      <div className={`${styles.blob} ${styles.nude2}`}></div>
    </div>
  );
}
