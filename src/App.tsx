import { useState } from 'react';
import { AmbientBackground } from '@/components/AmbientBackground';
import { Navbar } from '@/components/Navbar';
import { Marquee } from '@/components/Marquee';
import { Hero } from '@/components/Hero';
import { Drops } from '@/components/Drops';
import { Shop } from '@/components/Shop';
import { About } from '@/components/About';
import { Lookbook } from '@/components/Lookbook';
import { Reviews } from '@/components/Reviews';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';

function App() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#08080b] text-white">
      <AmbientBackground />
      <Navbar onOpenCart={() => setCartOpen(true)} />
      <main className="relative z-10">
        <Hero />
        <Marquee />
        <Drops />
        <Shop />
        <About />
        <Lookbook />
        <Reviews />
        <Contact />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

export default App;
