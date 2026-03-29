import { type ReactNode, useEffect } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.modal_overlay} onClick={onClose}>
      <div 
        className={styles.modal_content} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modal_header}>
          <h2>{title}</h2>
          <button className={styles.close_button} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.modal_body}>
          {children}
        </div>
      </div>
    </div>
  );
}
