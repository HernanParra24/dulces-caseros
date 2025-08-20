'use client';

import { Suspense } from 'react';
import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import { FeaturedProducts } from '@/components/featured-products';
import { AllProducts } from '@/components/all-products';
import { UpcomingProducts } from '@/components/upcoming-products';
import { About } from '@/components/about';
import { Footer } from '@/components/footer';
import { CartSidebar } from '@/components/cart-sidebar';
import { useScrollToSection } from '@/hooks/use-scroll-to-section';
import { ChatWidget } from '@/components/chat-widget';


export default function HomePage() {
  useScrollToSection();
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Suspense fallback={<div className="h-96 flex items-center justify-center">Cargando productos...</div>}>
          <FeaturedProducts />
        </Suspense>
        <Suspense fallback={<div className="h-96 flex items-center justify-center">Cargando todos los productos...</div>}>
          <AllProducts />
        </Suspense>
        <UpcomingProducts />
        <About />
      </main>
      <Footer />
      <CartSidebar />
      <ChatWidget />
    </div>
  );
}
