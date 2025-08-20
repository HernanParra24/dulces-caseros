'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, User, Menu, X, Heart } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { configService } from '@/lib/api';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [siteConfig, setSiteConfig] = useState({
    storeName: 'Dulce Twilight',
    logoUrl: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const { items: cartItems, isOpen, toggleCart } = useCartStore();
  const { user, logout, isAuthenticated, checkAuth } = useAuthStore();
  const router = useRouter();

  console.log('Header component rendered with user:', user);

  useEffect(() => {
    console.log('Header component mounted');
    loadSiteConfig();
  }, []);

  useEffect(() => {
    // Verificar autenticación al montar el componente
    console.log('Calling checkAuth...');
    checkAuth();
  }, []);

  // Debug: Log user state
  useEffect(() => {
    console.log('=== HEADER DEBUG ===');
    console.log('User:', user);
    console.log('isAuthenticated:', isAuthenticated);
    if (user) {
      console.log('User firstName:', user.firstName);
      console.log('User email:', user.email);
    }
    console.log('==================');
  }, [user, isAuthenticated]);

  const loadSiteConfig = async () => {
    try {
      const config = await configService.getPublicConfig();
      setSiteConfig({
        storeName: config.storeName || 'Dulce Twilight',
        logoUrl: config.logoUrl || ''
      });
    } catch (error) {
      console.error('Error loading site config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);



  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            {siteConfig.logoUrl ? (
              <img 
                src={siteConfig.logoUrl} 
                alt={siteConfig.storeName}
                className="h-8 w-auto object-contain"
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
            )}
            <span className="font-serif text-xl font-bold text-gray-900">{siteConfig.storeName}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-orange-600 transition-colors">
              Inicio
            </Link>
            <button 
              onClick={() => scrollToSection('productos')} 
              className="text-gray-700 hover:text-orange-600 transition-colors"
            >
              Productos
            </button>
            <button 
              onClick={() => scrollToSection('productos')} 
              className="text-gray-700 hover:text-orange-600 transition-colors"
            >
              Categorías
            </button>
            <button 
              onClick={() => scrollToSection('sobre-nosotros')} 
              className="text-gray-700 hover:text-orange-600 transition-colors"
            >
              Quiénes Somos
            </button>
            <Link 
              href="/soporte" 
              className="text-gray-700 hover:text-orange-600 transition-colors"
            >
              Soporte
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Favorites */}
            {user && (
              <Link
                href="/perfil#favoritos"
                className="p-2 text-gray-700 hover:text-orange-600 transition-colors"
              >
                <Heart className="h-6 w-6" />
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-gray-700 hover:text-orange-600 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition-colors">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                    {user.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-500 to-purple-500 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {user.firstName?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">
                      {user.firstName && user.lastName 
                        ? `${user.firstName} ${user.lastName}`
                        : user.firstName || user.email?.split('@')[0] || 'Usuario'
                      }
                    </span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                  </div>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1">
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Panel Admin
                      </Link>
                    )}
                    <Link
                      href="/perfil"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Mi Perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-orange-600 transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/registro"
                  className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-gray-700 hover:text-orange-600 transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="space-y-2">
              <Link
                href="/"
                className="block px-4 py-2 text-gray-700 hover:text-orange-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <button
                onClick={() => scrollToSection('productos')}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:text-orange-600 transition-colors"
              >
                Productos
              </button>
              <button
                onClick={() => scrollToSection('productos')}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:text-orange-600 transition-colors"
              >
                Categorías
              </button>
              <button
                onClick={() => scrollToSection('sobre-nosotros')}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:text-orange-600 transition-colors"
              >
                Quiénes Somos
              </button>
              <Link
                href="/soporte"
                className="block px-4 py-2 text-gray-700 hover:text-orange-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Soporte
              </Link>
            </nav>

            {/* Mobile Actions */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between px-4">
                {/* Favorites */}
                {user && (
                  <Link
                    href="/perfil#favoritos"
                    className="p-2 text-gray-700 hover:text-orange-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Heart className="h-6 w-6" />
                  </Link>
                )}

                {/* Cart */}
                <button
                  onClick={toggleCart}
                  className="relative p-2 text-gray-700 hover:text-orange-600 transition-colors"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </button>

                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 px-4 py-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                        {user.profileImage ? (
                          <img 
                            src={user.profileImage} 
                            alt={`${user.firstName} ${user.lastName}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-500 to-purple-500 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {user.firstName?.charAt(0) || user.email?.charAt(0) || 'U'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {user.firstName && user.lastName 
                            ? `${user.firstName} ${user.lastName}`
                            : user.firstName || user.email?.split('@')[0] || 'Usuario'
                          }
                        </span>
                        <span className="text-xs text-gray-500">{user.email}</span>
                      </div>
                    </div>
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:text-orange-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Panel Admin
                      </Link>
                    )}
                    <Link
                      href="/perfil"
                      className="block px-4 py-2 text-sm text-gray-700 hover:text-orange-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Mi Perfil
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-orange-600 transition-colors"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      className="block px-4 py-2 text-gray-700 hover:text-orange-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      href="/registro"
                      className="block px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Registrarse
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
