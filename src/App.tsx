import './styles/global.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PoliticaPrivacidade from './pages/PoliticaPrivacidade';
import TermosDeUso from './pages/TermosDeUso';
import { ModalProvider, useModal } from './context/ModalContext';
import Modal from './components/Modal';
import { PoliticaPrivacidadeContent, TermosDeUsoContent } from './components/LegalContent';

function AppContent() {
  const { activeModal, closeModal } = useModal();

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
        <Route path="/termos-de-uso" element={<TermosDeUso />} />
      </Routes>

      <Modal 
        isOpen={activeModal !== null} 
        onClose={closeModal}
        title={activeModal === 'privacy' ? 'Política de Privacidade' : 'Termos de Uso'}
      >
        {activeModal === 'privacy' ? (
          <PoliticaPrivacidadeContent />
        ) : (
          <TermosDeUsoContent />
        )}
      </Modal>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ModalProvider>
        <AppContent />
      </ModalProvider>
    </BrowserRouter>
  );
}

export default App;
