'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, Mail, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { authService } from '@/lib/api';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function VerificarEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'pending'>('loading');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const hasVerifiedRef = useRef(false);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Token de verificación no encontrado. Por favor, verifica el enlace del email.');
      return;
    }

    // Solo verificar una vez usando useRef
    if (!hasVerifiedRef.current) {
      hasVerifiedRef.current = true;
      verifyEmail(token);
    }
  }, []); // Array vacío para que solo se ejecute una vez

  const verifyEmail = async (token: string) => {
    try {
      console.log('🔍 Frontend: Iniciando verificación con token:', token);
      const response = await authService.verifyEmail(token);
      console.log('✅ Frontend: Verificación exitosa:', response);
      setStatus('success');
      setMessage(response.message || 'Email verificado exitosamente');
      toast.success('Email verificado exitosamente');
      
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        router.push('/login?message=Email verificado. Ya puedes iniciar sesión.');
      }, 3000);
    } catch (error: any) {
      console.error('❌ Frontend: Error en verificación:', error);
      setStatus('error');
      setMessage(error.response?.data?.message || 'Error al verificar el email');
      toast.error('Error al verificar el email');
    }
  };

  const handleResendEmail = async () => {
    if (!email.trim()) {
      toast.error('Por favor ingresa tu email');
      return;
    }

    setIsResending(true);
    try {
      await authService.resendVerificationEmail(email);
      toast.success('Email de verificación re-enviado exitosamente');
      setStatus('pending');
      setMessage('Email re-enviado. Por favor revisa tu bandeja de entrada.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al re-enviar el email');
    } finally {
      setIsResending(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Verificando tu email...</h2>
            <p className="text-gray-600">Por favor espera un momento.</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">¡Email verificado!</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">Serás redirigido al login en unos segundos...</p>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error de verificación</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">¿No recibiste el email?</h3>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Ingresa tu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button
                  onClick={handleResendEmail}
                  disabled={isResending}
                  className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Re-enviando...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      <span>Re-enviar email</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={() => router.push('/login')}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              Volver al login
            </button>
          </div>
        );

      case 'pending':
        return (
          <div className="text-center">
            <Mail className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Email re-enviado</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500 mb-6">
              Revisa tu bandeja de entrada y spam. El email puede tardar unos minutos en llegar.
            </p>
            
            <button
              onClick={() => router.push('/login')}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              Volver al login
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            {renderContent()}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
