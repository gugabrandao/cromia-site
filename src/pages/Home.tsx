import MeshBackground from '../components/MeshBackground';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Sobre from '../components/Sobre';
import Servicos from '../components/Servicos';
import Contato from '../components/Contato';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

export default function Home() {
  return (
    <>
      <MeshBackground />
      <Header />
      <main>
        <Hero />
        <Sobre />
        <Servicos />
        <Contato />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
