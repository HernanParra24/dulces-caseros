'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, Mail, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { authService } from '@/lib/api';
import { BackButton } from '@/components/back-button';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setVerificationResult({
          success: false,
          message: 'Token de verificación no encontrado. Por favor, solicita un nuevo enlace de verificación desde tu perfil.',
        });
        setIsVerifying(false);
        return;
      }

      try {
        const result = await authService.verifyEmail(token);
        setVerificationResult({
          success: true,
          message: result.message || 'Email verificado exitosamente',
        });
        
        // Mostrar toast de éxito
        toast.success('¡Email verificado exitosamente!');
        
        // Redirigir al perfil después de 3 segundos
        setTimeout(() => {
          router.push('/perfil?tab=settings');
        }, 3000);
        
      } catch (error: any) {
        console.error('Error verifying email:', error);
        setVerificationResult({
          success: false,
          message: error.response?.data?.message || 'Error verificando el email. El enlace puede haber expirado.',
        });
        toast.error('Error verificando el email');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <BackButton />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-8"
        >
          {isVerifying ? (
            <div className="text-center">
              <div className="mb-6">
                <Loader2 className="w-16 h-16 text-orange-600 mx-auto animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Verificando tu email...
              </h1>
              <p className="text-gray-600">
                Por favor espera mientras verificamos tu dirección de correo electrónico.
              </p>
            </div>
          ) : verificationResult ? (
            <div className="text-center">
              <div className="mb-6">
                {verificationResult.success ? (
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
                ) : (
                  <XCircle className="w-16 h-16 text-red-600 mx-auto" />
                )}
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {verificationResult.success ? '¡Email Verificado!' : 'Error de Verificación'}
              </h1>
              
              <p className="text-gray-600 mb-6">
                {verificationResult.message}
              </p>

              {verificationResult.success ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800">
                      <strong>¡Felicidades!</strong> Tu cuenta está ahora completamente verificada.
                    </p>
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    Serás redirigido automáticamente a tu perfil en unos segundos...
                  </p>
                  
                  <Link
                    href="/perfil?tab=settings"
                    className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Ir a mi perfil
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-800">
                      <strong>Problema:</strong> No se pudo verificar tu email.
                    </p>
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    Puedes solicitar un nuevo enlace de verificación desde tu perfil.
                  </p>
                  
                  <Link
                    href="/perfil?tab=settings"
                    className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Solicitar nuevo enlace
                  </Link>
                </div>
              )}
            </div>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}


